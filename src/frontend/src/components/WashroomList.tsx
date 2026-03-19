import { Badge } from "@/components/ui/badge";
import {
  Accessibility,
  Baby,
  MapPin,
  Navigation,
  ShieldCheck,
  Users,
} from "lucide-react";
import type { Washroom } from "../backend";
import { calculateDistance, formatDistance } from "../utils/distance";

interface WashroomListProps {
  washrooms: Washroom[];
  userLocation: { latitude: number; longitude: number };
  onSelectWashroom: (washroom: Washroom) => void;
  selectedWashroom: Washroom | null;
}

function FeaturePill({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  if (!active) return null;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-accent text-accent-foreground">
      {icon}
      {label}
    </span>
  );
}

export default function WashroomList({
  washrooms,
  userLocation,
  onSelectWashroom,
  selectedWashroom,
}: WashroomListProps) {
  const sortedWashrooms = [...washrooms].sort((a, b) => {
    const distA = calculateDistance(userLocation, a.coordinates);
    const distB = calculateDistance(userLocation, b.coordinates);
    return distA - distB;
  });

  if (washrooms.length === 0) {
    return (
      <div
        className="flex items-center justify-center min-h-[320px] p-8"
        data-ocid="washroom.empty_state"
      >
        <div className="text-center space-y-3 max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto">
            <MapPin
              className="w-8 h-8 text-muted-foreground"
              aria-hidden="true"
            />
          </div>
          <h2 className="text-xl font-display font-bold text-foreground">
            No Washrooms Found
          </h2>
          <p className="text-base text-muted-foreground">
            No accessible washrooms were found in this area. Try increasing the
            search radius.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ul
      className="container mx-auto px-4 py-4 space-y-3 list-none"
      data-ocid="washroom.list"
      aria-label={`${washrooms.length} accessible washroom${washrooms.length !== 1 ? "s" : ""} found`}
    >
      {sortedWashrooms.map((washroom, index) => {
        const distance = calculateDistance(userLocation, washroom.coordinates);
        const isSelected = selectedWashroom?.name === washroom.name;
        const markerIndex = index + 1;

        return (
          <li key={washroom.name}>
            <button
              type="button"
              onClick={() => onSelectWashroom(washroom)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all min-h-[88px] shadow-card hover:shadow-card-hover ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-card-hover"
                  : "border-border bg-card hover:border-primary/40"
              }`}
              aria-pressed={isSelected}
              aria-label={`${washroom.name}, ${formatDistance(distance)} away`}
              data-ocid={`washroom.item.${markerIndex}`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-accent text-accent-foreground"
                  }`}
                  aria-hidden="true"
                >
                  ♿
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-base font-display font-bold text-foreground leading-tight">
                      {washroom.name}
                    </h3>
                    <Badge
                      variant="secondary"
                      className={`flex-shrink-0 text-xs font-bold px-2 py-0.5 ${
                        isSelected ? "bg-primary/15 text-primary" : ""
                      }`}
                    >
                      <Navigation className="w-3 h-3 mr-1" aria-hidden="true" />
                      {formatDistance(distance)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2 leading-snug truncate">
                    {washroom.address}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <FeaturePill
                      icon={<Accessibility className="w-3 h-3" />}
                      label="Wheelchair"
                      active={washroom.features.wheelchairAccessible}
                    />
                    <FeaturePill
                      icon={<ShieldCheck className="w-3 h-3" />}
                      label="Accessible Stall"
                      active={washroom.features.accessibleStalls}
                    />
                    <FeaturePill
                      icon={<Baby className="w-3 h-3" />}
                      label="Baby Station"
                      active={washroom.features.babyChangingStation}
                    />
                    <FeaturePill
                      icon={<Users className="w-3 h-3" />}
                      label="Gender Neutral"
                      active={washroom.features.genderNeutral}
                    />
                  </div>
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
