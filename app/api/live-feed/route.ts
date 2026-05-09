import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

const categories = ["Electronics", "Clothing", "Home", "Sports", "Food"];
const categoryWeights = [30, 25, 20, 15, 10];
const regions = ["West", "South", "East", "North"];
const regionWeights = [35, 25, 22, 18];

const cities: Record<string, { name: string; lat: number; lng: number }[]> = {
  West: [
    { name: "Los Angeles", lat: 34.05, lng: -118.24 },
    { name: "San Francisco", lat: 37.77, lng: -122.42 },
    { name: "Seattle", lat: 47.61, lng: -122.33 },
  ],
  South: [
    { name: "Houston", lat: 29.76, lng: -95.37 },
    { name: "Miami", lat: 25.76, lng: -80.19 },
    { name: "Atlanta", lat: 33.75, lng: -84.39 },
  ],
  East: [
    { name: "New York", lat: 40.71, lng: -74.01 },
    { name: "Boston", lat: 42.36, lng: -71.06 },
  ],
  North: [
    { name: "Chicago", lat: 41.88, lng: -87.63 },
    { name: "Denver", lat: 39.74, lng: -104.99 },
  ],
};

const categoryPriceRange: Record<string, [number, number]> = {
  Electronics: [50, 500],
  Clothing: [15, 150],
  Home: [20, 300],
  Sports: [10, 200],
  Food: [5, 80],
};

function weightedPick<T>(items: T[], weights: number[]): T {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export async function POST() {
  const db = getDb();

  const maxId = db.prepare("SELECT MAX(CAST(SUBSTR(id, 5) AS INTEGER)) as maxId FROM orders").get() as { maxId: number };
  let nextId = (maxId?.maxId || 10100) + 1;

  const customerIds = (db.prepare("SELECT id FROM customers ORDER BY RANDOM() LIMIT 20").all() as { id: string }[]).map(r => r.id);
  if (customerIds.length === 0) {
    return NextResponse.json({ error: "No customers found" }, { status: 500 });
  }

  const now = new Date();
  const today = now.toISOString().split("T")[0];

  const batchSize = 2 + Math.floor(Math.random() * 3); // 2-4 orders per tick
  const newOrders: Array<{
    id: string;
    category: string;
    region: string;
    city: string;
    total: number;
    status: string;
  }> = [];

  const insert = db.prepare(`
    INSERT INTO orders (id, customer_id, order_date, total, discount, status, category, region, city, lat, lng)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertBatch = db.transaction(() => {
    for (let i = 0; i < batchSize; i++) {
      const category = weightedPick(categories, categoryWeights);
      const region = weightedPick(regions, regionWeights);
      const cityList = cities[region];
      const city = cityList[Math.floor(Math.random() * cityList.length)];
      const customerId = customerIds[Math.floor(Math.random() * customerIds.length)];

      const [minP, maxP] = categoryPriceRange[category];
      const discount = Math.random() < 0.3 ? Math.round(randomBetween(0.05, 0.15) * 100) / 100 : 0;
      const total = Math.round(randomBetween(minP, maxP) * (1 - discount) * 100) / 100;

      const r = Math.random();
      const status = r < 0.05 ? "cancelled" : r < 0.08 ? "refunded" : "completed";

      const orderId = `ord_${String(nextId++).padStart(6, "0")}`;

      insert.run(
        orderId,
        customerId,
        today,
        total,
        discount,
        status,
        category,
        region,
        city.name,
        city.lat + randomBetween(-0.1, 0.1),
        city.lng + randomBetween(-0.1, 0.1)
      );

      newOrders.push({ id: orderId, category, region, city: city.name, total, status });
    }
  });

  insertBatch();

  const totalCount = (db.prepare("SELECT COUNT(*) as count FROM orders").get() as { count: number }).count;

  return NextResponse.json({
    inserted: newOrders.length,
    totalOrders: totalCount,
    orders: newOrders,
    timestamp: now.toISOString(),
  });
}

export async function GET() {
  const db = getDb();
  const totalCount = (db.prepare("SELECT COUNT(*) as count FROM orders").get() as { count: number }).count;
  const todayOrders = (db.prepare("SELECT COUNT(*) as count FROM orders WHERE order_date = date('now')").get() as { count: number }).count;

  return NextResponse.json({
    totalOrders: totalCount,
    todayOrders: todayOrders,
  });
}
