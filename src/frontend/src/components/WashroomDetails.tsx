import {
  Accessibility,
  Baby,
  CheckCircle2,
  MapPin,
  Navigation,
  ShieldCheck,
  Users,
  X,
  XCircle,
} from "lucide-react";
import type { Washroom } from "../backend";
import { calculateDistance, formatDistance } from "../utils/distance";

interface WashroomDetailsProps {
  washroom: Washroom;
  userLocation: { latitude: number; longitude: number };
  onClose: () => void;
}

function FeatureItem({
  icon,
  label,
  available,
}: {
  icon: React.ReactNode;
  label: string;
  available: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 p-3.5 rounded-xl border ${
        available
          ? "border-primary/25 bg-primary/5"
          : "border-border bg-muted/40 opacity-60"
      }`}
    >
      <div
        className={`flex-shrink-0 ${available ? "text-primary" : "text-muted-foreground"}`}
        aria-hidden="true"
      >
        {icon}
      </div>
      <span
        className={`font-medium text-sm ${available ? "text-foreground" : "text-muted-foreground"}`}
      >
        {label}
      </span>
      <div className="ml-auto flex-shrink-0">
        {available ? (
          <CheckCircle2
            className="w-5 h-5 text-primary"
            aria-label="Available"
          />
        ) : (
          <XCircle
            className="w-5 h-5 text-muted-foreground"
            aria-label="Not available"
          />
        )}
      </div>
    </div>
  );
}

export default function WashroomDetails({
  washroom,
  userLocation,
  onClose,
}: WashroomDetailsProps) {
  const distance = calculateDistance(userLocation, washroom.coordinates);

  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${washroom.coordinates.latitude},${washroom.coordinates.longitude}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="absolute inset-0 bg-foreground/30 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
      data-ocid="details.panel"
    >
      <dialog
        open
        className="bg-card border-t md:border-2 border-border rounded-t-2xl md:rounded-2xl shadow-panel w-full max-w-lg max-h-[90vh] overflow-auto slide-up m-0 p-0"
        aria-labelledby="washroom-details-title"
      >
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border px-5 py-4 flex items-start justify-between gap-4 rounded-t-2xl md:rounded-t-none">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl" aria-hidden="true">
                ♿
              </span>
              <h2
                id="washroom-details-title"
                className="text-xl font-display font-bold text-foreground leading-tight truncate"
              >
                {washroom.name}
              </h2>
            </div>
            <div className="flex items-center gap-1.5 text-primary font-semibold text-sm">
              <Navigation
                className="w-4 h-4 flex-shrink-0"
                aria-hidden="true"
              />
              <span>{formatDistance(distance)} away</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex-shrink-0 w-11 h-11 rounded-xl bg-secondary hover:bg-secondary/70 flex items-center justify-center transition-colors"
            aria-label="Close details panel"
            data-ocid="details.close_button"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-4 space-y-5">
          {/* Address */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-muted/50 border border-border">
            <MapPin
              className="w-5 h-5 text-primary flex-shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide mb-0.5">
                Address
              </p>
              <p className="text-sm font-medium text-foreground">
                {washroom.address}
              </p>
            </div>
          </div>

          {/* Accessibility Features */}
          <div>
            <h3 className="font-display font-bold text-foreground mb-3">
              Accessibility Features
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <FeatureItem
                icon={<Accessibility className="w-5 h-5" />}
                label="Wheelchair Accessible"
                available={washroom.features.wheelchairAccessible}
              />
              <FeatureItem
                icon={<ShieldCheck className="w-5 h-5" />}
                label="Accessible Stalls"
                available={washroom.features.accessibleStalls}
              />
              <FeatureItem
                icon={<Baby className="w-5 h-5" />}
                label="Baby Changing Station"
                available={washroom.features.babyChangingStation}
              />
              <FeatureItem
                icon={<Users className="w-5 h-5" />}
                label="Gender Neutral"
                available={washroom.features.genderNeutral}
              />
            </div>
          </div>

          {/* Get Directions Button */}
          <button
            type="button"
            onClick={handleGetDirections}
            className="w-full bg-primary text-primary-foreground font-bold py-4 px-6 rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 min-h-[54px] shadow-card"
            aria-label={`Get directions to ${washroom.name}`}
            data-ocid="details.directions_button"
          >
            <Navigation className="w-5 h-5" aria-hidden="true" />
            <span>Get Directions</span>
          </button>
        </div>
      </dialog>
    </div>
  );
}
