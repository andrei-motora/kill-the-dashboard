import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_DIR = path.join(__dirname, "..", "data");
const DB_PATH = path.join(DB_DIR, "store.db");

if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
if (fs.existsSync(DB_PATH)) fs.unlinkSync(DB_PATH);

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");

// --- Schema ---
db.exec(`
  CREATE TABLE customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    signup_date TEXT NOT NULL
  );

  CREATE TABLE orders (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    order_date TEXT NOT NULL,
    total REAL NOT NULL,
    discount REAL DEFAULT 0,
    status TEXT NOT NULL,
    category TEXT NOT NULL,
    region TEXT NOT NULL,
    city TEXT NOT NULL,
    lat REAL,
    lng REAL,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
  );

  CREATE INDEX idx_orders_date ON orders(order_date);
  CREATE INDEX idx_orders_category ON orders(category);
  CREATE INDEX idx_orders_region ON orders(region);
  CREATE INDEX idx_orders_status ON orders(status);
`);

// --- Helpers ---
function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

const rand = seededRandom(42);

function pick(arr, weights) {
  if (!weights) return arr[Math.floor(rand() * arr.length)];
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rand() * total;
  for (let i = 0; i < arr.length; i++) {
    r -= weights[i];
    if (r <= 0) return arr[i];
  }
  return arr[arr.length - 1];
}

function randomBetween(min, max) {
  return min + rand() * (max - min);
}

function formatDate(d) {
  return d.toISOString().split("T")[0];
}

// --- City data with lat/lng ---
const cities = {
  West: [
    { name: "Los Angeles", lat: 34.05, lng: -118.24 },
    { name: "San Francisco", lat: 37.77, lng: -122.42 },
    { name: "Seattle", lat: 47.61, lng: -122.33 },
    { name: "Portland", lat: 45.52, lng: -122.68 },
  ],
  South: [
    { name: "Houston", lat: 29.76, lng: -95.37 },
    { name: "Miami", lat: 25.76, lng: -80.19 },
    { name: "Atlanta", lat: 33.75, lng: -84.39 },
    { name: "Dallas", lat: 32.78, lng: -96.8 },
  ],
  East: [
    { name: "New York", lat: 40.71, lng: -74.01 },
    { name: "Boston", lat: 42.36, lng: -71.06 },
    { name: "Philadelphia", lat: 39.95, lng: -75.17 },
  ],
  North: [
    { name: "Chicago", lat: 41.88, lng: -87.63 },
    { name: "Detroit", lat: 42.33, lng: -83.05 },
    { name: "Minneapolis", lat: 44.98, lng: -93.27 },
    { name: "Denver", lat: 39.74, lng: -104.99 },
  ],
};

const categories = ["Electronics", "Clothing", "Home", "Sports", "Food"];
const categoryWeights = [30, 25, 20, 15, 10];
const regions = ["West", "South", "East", "North"];
const regionWeights = [35, 25, 22, 18];

const categoryPriceRange = {
  Electronics: [50, 500],
  Clothing: [15, 150],
  Home: [20, 300],
  Sports: [10, 200],
  Food: [5, 80],
};

const firstNames = [
  "James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael",
  "Linda", "David", "Elizabeth", "William", "Barbara", "Richard", "Susan",
  "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen", "Daniel",
  "Lisa", "Matthew", "Nancy", "Anthony", "Betty", "Mark", "Margaret",
  "Donald", "Sandra", "Steven", "Ashley", "Paul", "Kimberly", "Andrew",
  "Emily", "Joshua", "Donna", "Kenneth", "Michelle", "Kevin", "Carol",
  "Brian", "Amanda", "George", "Dorothy", "Timothy", "Melissa", "Ronald",
  "Deborah",
];

const lastNames = [
  "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller",
  "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez",
  "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin",
];

// --- Generate Customers ---
console.log("Generating customers...");
const customerCount = 500;
const insertCustomer = db.prepare(
  "INSERT INTO customers (id, name, email, signup_date) VALUES (?, ?, ?, ?)"
);

const customerIds = [];
const insertCustomers = db.transaction(() => {
  for (let i = 0; i < customerCount; i++) {
    const id = `cust_${String(i).padStart(4, "0")}`;
    const first = pick(firstNames);
    const last = pick(lastNames);
    const name = `${first} ${last}`;
    const email = `${first.toLowerCase()}.${last.toLowerCase()}${i}@example.com`;
    const signupDate = new Date(
      2024,
      Math.floor(rand() * 12),
      1 + Math.floor(rand() * 28)
    );
    insertCustomer.run(id, name, email, formatDate(signupDate));
    customerIds.push(id);
  }
});
insertCustomers();
console.log(`  Created ${customerCount} customers`);

// --- Generate Orders ---
console.log("Generating orders...");

const DROP_WEEK_START = new Date(2026, 3, 21); // April 21, 2026
const DROP_WEEK_END = new Date(2026, 3, 27);   // April 27, 2026

const startDate = new Date(2025, 4, 1);  // May 1, 2025
const endDate = new Date(2026, 3, 30);   // April 30, 2026

const insertOrder = db.prepare(`
  INSERT INTO orders (id, customer_id, order_date, total, discount, status, category, region, city, lat, lng)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

let orderCount = 0;
const insertOrders = db.transaction(() => {
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const isDropWeek =
      currentDate >= DROP_WEEK_START && currentDate <= DROP_WEEK_END;

    // Base ~27 orders/day with ±30% variance
    let dailyOrders = Math.round(27 * (0.7 + rand() * 0.6));

    // Slight seasonality: more orders in Nov-Dec (holiday), less in Jan-Feb
    const month = currentDate.getMonth();
    if (month === 10 || month === 11) dailyOrders = Math.round(dailyOrders * 1.3);
    if (month === 0 || month === 1) dailyOrders = Math.round(dailyOrders * 0.85);

    for (let i = 0; i < dailyOrders; i++) {
      const category = pick(categories, categoryWeights);

      // Revenue drop scenario: 90% fewer Electronics orders during drop week
      if (isDropWeek && category === "Electronics" && rand() < 0.9) continue;

      const region = pick(regions, regionWeights);
      const city = pick(cities[region]);
      const customerId = pick(customerIds);

      const [minPrice, maxPrice] = categoryPriceRange[category];
      let total = Math.round(randomBetween(minPrice, maxPrice) * 100) / 100;

      // Drop week: higher discounts across all categories
      let discount = 0;
      if (isDropWeek) {
        discount = Math.round(randomBetween(0.15, 0.35) * 100) / 100;
      } else {
        discount = rand() < 0.3 ? Math.round(randomBetween(0.05, 0.15) * 100) / 100 : 0;
      }

      total = Math.round(total * (1 - discount) * 100) / 100;

      // Drop week: higher cancellation rate (40% vs normal 5%)
      let status;
      if (isDropWeek) {
        const r = rand();
        status = r < 0.4 ? "cancelled" : r < 0.5 ? "refunded" : "completed";
      } else {
        const r = rand();
        status = r < 0.05 ? "cancelled" : r < 0.08 ? "refunded" : "completed";
      }

      const orderId = `ord_${String(orderCount).padStart(6, "0")}`;
      insertOrder.run(
        orderId,
        customerId,
        formatDate(currentDate),
        total,
        discount,
        status,
        category,
        region,
        city.name,
        city.lat + randomBetween(-0.1, 0.1),
        city.lng + randomBetween(-0.1, 0.1)
      );
      orderCount++;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }
});
insertOrders();

console.log(`  Created ${orderCount} orders`);

// --- Verify ---
const totalOrders = db.prepare("SELECT COUNT(*) as count FROM orders").get();
const totalCustomers = db.prepare("SELECT COUNT(*) as count FROM customers").get();
const dropWeekOrders = db
  .prepare(
    "SELECT COUNT(*) as count FROM orders WHERE order_date BETWEEN '2026-04-21' AND '2026-04-27'"
  )
  .get();
const normalWeekOrders = db
  .prepare(
    "SELECT COUNT(*) as count FROM orders WHERE order_date BETWEEN '2026-04-14' AND '2026-04-20'"
  )
  .get();
const dropWeekElectronics = db
  .prepare(
    "SELECT COUNT(*) as count FROM orders WHERE order_date BETWEEN '2026-04-21' AND '2026-04-27' AND category='Electronics'"
  )
  .get();
const normalWeekElectronics = db
  .prepare(
    "SELECT COUNT(*) as count FROM orders WHERE order_date BETWEEN '2026-04-14' AND '2026-04-20' AND category='Electronics'"
  )
  .get();
const dropWeekCancelled = db
  .prepare(
    "SELECT COUNT(*) as count, ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM orders WHERE order_date BETWEEN '2026-04-21' AND '2026-04-27'), 1) as pct FROM orders WHERE order_date BETWEEN '2026-04-21' AND '2026-04-27' AND status='cancelled'"
  )
  .get();

console.log("\n--- Verification ---");
console.log(`Total orders: ${totalOrders.count}`);
console.log(`Total customers: ${totalCustomers.count}`);
console.log(`Normal week (Apr 14-20) orders: ${normalWeekOrders.count}`);
console.log(`Drop week (Apr 21-27) orders: ${dropWeekOrders.count}`);
console.log(`Normal week Electronics: ${normalWeekElectronics.count}`);
console.log(`Drop week Electronics: ${dropWeekElectronics.count}`);
console.log(
  `Drop week cancellations: ${dropWeekCancelled.count} (${dropWeekCancelled.pct}%)`
);

db.close();
console.log("\nSeed complete! Database at:", DB_PATH);
