"use client";

import { useEffect, useRef, useState } from "react";
import createGlobe from "cobe";
import type { MapWidget } from "@/lib/schema";
import { GlobeIcon } from "../icons";

function latLngToAngles(lat: number, lng: number): [number, number] {
  return [
    Math.PI - ((lng * Math.PI) / 180 - Math.PI / 2),
    (lat * Math.PI) / 180,
  ];
}

export function GlobeWidget({ widget }: { widget: MapWidget }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const phiRef = useRef(0);
  const [hovered, setHovered] = useState<number | null>(null);

  const maxVal = Math.max(...widget.markers.map((m) => m.value), 1);

  useEffect(() => {
    if (!canvasRef.current) return;

    const markers = widget.markers.map((m) => ({
      location: [m.lat, m.lng] as [number, number],
      size: 0.04 + (m.value / maxVal) * 0.12,
    }));

    const avgLat = widget.markers.reduce((s, m) => s + m.lat, 0) / widget.markers.length;
    const avgLng = widget.markers.reduce((s, m) => s + m.lng, 0) / widget.markers.length;
    const [targetPhi, targetTheta] = latLngToAngles(avgLat, avgLng);

    const width = canvasRef.current.offsetWidth;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: targetPhi,
      theta: targetTheta * 0.6,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 20000,
      mapBrightness: 2.4,
      baseColor: [0.05, 0.07, 0.12],
      markerColor: [0.055, 0.647, 0.914],
      glowColor: [0.035, 0.06, 0.12],
      markers,
    });

    let raf: number;
    const animate = () => {
      const phi = targetPhi + pointerRef.current.x * 0.3;
      phiRef.current = phi;
      globe.update({ phi });
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      globe.destroy();
    };
  }, [widget.markers, maxVal]);

  return (
    <div className="globe-card">
      <div className="globe-head">
        <div className="globe-title-row">
          <span className="events-icon">
            <GlobeIcon size={14} style={{ color: "#38bdf8" }} />
          </span>
          <h3 className="chart-title">{widget.title}</h3>
          <span className="events-count mono">{widget.markers.length}</span>
        </div>
      </div>
      <div className="globe-body">
        <div className="globe-canvas-wrap">
          <canvas
            ref={canvasRef}
            style={{ width: "100%", height: "100%", aspectRatio: "1" }}
            onPointerMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              pointerRef.current = {
                x: (e.clientX - rect.left - rect.width / 2) / rect.width,
                y: 0,
              };
            }}
            onPointerLeave={() => {
              pointerRef.current = { x: 0, y: 0 };
            }}
          />
        </div>
        <div className="globe-legend thin-scroll">
          {widget.markers
            .sort((a, b) => b.value - a.value)
            .map((m, i) => (
              <div
                key={i}
                className={`globe-legend-row ${hovered === i ? "globe-legend-active" : ""}`}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <span className="globe-legend-rank mono">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="globe-legend-label">{m.label}</span>
                <span className="globe-legend-bar-wrap">
                  <span
                    className="globe-legend-bar"
                    style={{ width: `${(m.value / maxVal) * 100}%` }}
                  />
                </span>
                <span className="globe-legend-val mono">
                  {m.value >= 1000
                    ? `$${(m.value / 1000).toFixed(1)}k`
                    : `$${m.value.toLocaleString()}`}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
