import { MapPin, ZoomIn, ZoomOut } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Washroom } from "../backend";

interface WashroomMapProps {
  userLocation: { latitude: number; longitude: number };
  washrooms: Washroom[];
  selectedWashroom: Washroom | null;
  onSelectWashroom: (washroom: Washroom) => void;
}

export default function WashroomMap({
  userLocation,
  washrooms,
  selectedWashroom,
  onSelectWashroom,
}: WashroomMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(14);
  const [center, setCenter] = useState(userLocation);
  const [animFrame, setAnimFrame] = useState(0);

  // Pulse animation tick
  useEffect(() => {
    const id = setInterval(() => {
      setAnimFrame((f) => (f + 1) % 60);
    }, 50);
    return () => clearInterval(id);
  }, []);

  // Auto-fit center to include all markers
  useEffect(() => {
    if (washrooms.length > 0) {
      const allLats = [
        userLocation.latitude,
        ...washrooms.map((w) => w.coordinates.latitude),
      ];
      const allLngs = [
        userLocation.longitude,
        ...washrooms.map((w) => w.coordinates.longitude),
      ];
      const centerLat = (Math.max(...allLats) + Math.min(...allLats)) / 2;
      const centerLng = (Math.max(...allLngs) + Math.min(...allLngs)) / 2;
      setCenter({ latitude: centerLat, longitude: centerLng });
    } else {
      setCenter(userLocation);
    }
  }, [washrooms, userLocation]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const scale = 2 ** (zoom - 10) * 100000;

    const toCanvasCoords = (lat: number, lng: number) => ({
      x: width / 2 + (lng - center.longitude) * scale,
      y: height / 2 - (lat - center.latitude) * scale,
    });

    // Background — light topographic feel
    ctx.fillStyle = "#eef2f5";
    ctx.fillRect(0, 0, width, height);

    // Grid lines (streets)
    ctx.strokeStyle = "#dde3e8";
    ctx.lineWidth = 1;
    const gridSpacing = 50;
    for (let x = 0; x < width; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Road-like diagonal stripes for visual texture
    ctx.strokeStyle = "#d4dde6";
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 32]);
    for (let i = -height; i < width + height; i += 100) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + height, height);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // Draw search radius circle
    const userPos = toCanvasCoords(
      userLocation.latitude,
      userLocation.longitude,
    );
    const radiusPx = (5000 * scale) / 111000; // approx 5km in px
    ctx.strokeStyle = "rgba(66, 150, 150, 0.2)";
    ctx.fillStyle = "rgba(66, 150, 150, 0.05)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(
      userPos.x,
      userPos.y,
      Math.min(radiusPx, Math.max(width, height)),
      0,
      Math.PI * 2,
    );
    ctx.fill();
    ctx.stroke();

    // Draw washroom markers
    for (const washroom of washrooms) {
      const pos = toCanvasCoords(
        washroom.coordinates.latitude,
        washroom.coordinates.longitude,
      );
      const isSelected = selectedWashroom?.name === washroom.name;

      // Drop shadow
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.beginPath();
      ctx.ellipse(pos.x, pos.y + 26, 10, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pin body
      const pinColor = isSelected ? "#0f766e" : "#2b8a8a";
      ctx.fillStyle = pinColor;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y - 16, 16, 0, Math.PI * 2);
      ctx.fill();

      // Pin tail
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y + 2);
      ctx.lineTo(pos.x - 9, pos.y - 12);
      ctx.lineTo(pos.x + 9, pos.y - 12);
      ctx.closePath();
      ctx.fill();

      // Icon
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("♿", pos.x, pos.y - 16);

      // Label for selected
      if (isSelected) {
        const label =
          washroom.name.length > 20
            ? `${washroom.name.slice(0, 18)}…`
            : washroom.name;
        const labelWidth = ctx.measureText(label).width + 20;
        ctx.fillStyle = "rgba(15, 118, 110, 0.95)";
        const lx = pos.x - labelWidth / 2;
        const ly = pos.y + 8;
        ctx.beginPath();
        ctx.roundRect(lx, ly, labelWidth, 26, 6);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(label, pos.x, ly + 13);
      }
    }

    // User location — animated pulse
    const pulsePhase = animFrame / 60;
    const pulseRadius = 18 + 14 * Math.sin(pulsePhase * Math.PI * 2);
    const pulseAlpha = 0.15 + 0.1 * Math.cos(pulsePhase * Math.PI * 2);

    ctx.fillStyle = `rgba(239, 68, 68, ${pulseAlpha})`;
    ctx.beginPath();
    ctx.arc(userPos.x, userPos.y, pulseRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(userPos.x, userPos.y, 11, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(userPos.x, userPos.y, 11, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(userPos.x, userPos.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }, [userLocation, washrooms, selectedWashroom, zoom, center, animFrame]);

  // Resize canvas to container
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const resize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      draw();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    return () => ro.disconnect();
  }, [draw]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);
    const scale = 2 ** (zoom - 10) * 100000;

    let closest: Washroom | null = null;
    let closestDist = 28;
    for (const washroom of washrooms) {
      const mx =
        canvas.width / 2 +
        (washroom.coordinates.longitude - center.longitude) * scale;
      const my =
        canvas.height / 2 -
        (washroom.coordinates.latitude - center.latitude) * scale -
        16;
      const dist = Math.sqrt((x - mx) ** 2 + (y - my) ** 2);
      if (dist < closestDist) {
        closestDist = dist;
        closest = washroom;
      }
    }
    if (closest) onSelectWashroom(closest);
  };

  const handleCanvasKeyDown = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      // Allow keyboard activation, but we can't easily select by position
      // Users can tab to zoom buttons for navigation
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-muted"
      data-ocid="washroom.canvas_target"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer"
        onClick={handleCanvasClick}
        onKeyDown={handleCanvasKeyDown}
        tabIndex={0}
        aria-label="Interactive map showing accessible washroom locations near you. Use zoom controls to navigate."
      />

      {/* Zoom Controls */}
      <div
        className="absolute top-4 right-4 flex flex-col gap-1.5"
        aria-label="Map zoom controls"
      >
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(z + 1, 18))}
          className="w-11 h-11 bg-card border border-border rounded-lg shadow-card flex items-center justify-center hover:bg-accent transition-colors"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(z - 1, 8))}
          className="w-11 h-11 bg-card border border-border rounded-lg shadow-card flex items-center justify-center hover:bg-accent transition-colors"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm border border-border rounded-xl shadow-card p-3">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-2">
          Legend
        </p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-destructive border-2 border-white shadow-sm flex-shrink-0" />
            <span className="text-xs font-medium text-foreground">
              Your Location
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white text-[10px] flex-shrink-0">
              ♿
            </div>
            <span className="text-xs font-medium text-foreground">
              Accessible Washroom
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-primary/60 flex items-center justify-center text-white text-[10px] flex-shrink-0">
              ♿
            </div>
            <span className="text-xs font-medium text-foreground">
              Selected
            </span>
          </div>
        </div>
      </div>

      {/* Empty overlay */}
      {washrooms.length === 0 && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm"
          data-ocid="washroom.empty_state"
        >
          <div className="text-center space-y-3 max-w-sm px-6 py-8 bg-card rounded-2xl border border-border shadow-card">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto">
              <MapPin className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-display font-bold text-foreground">
              No Washrooms Found
            </h3>
            <p className="text-sm text-muted-foreground">
              Try increasing the search radius or adjusting your filters.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
