import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Coordinates, WashroomFeatures } from "../backend";
import { useActor } from "../hooks/useActor";

interface AddWashroomModalProps {
  userLocation?: { latitude: number; longitude: number } | null;
}

const defaultFeatures: WashroomFeatures = {
  wheelchairAccessible: true,
  accessibleStalls: false,
  babyChangingStation: false,
  genderNeutral: false,
};

export default function AddWashroomModal({
  userLocation,
}: AddWashroomModalProps) {
  const [open, setOpen] = useState(false);
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState(
    userLocation ? String(userLocation.latitude.toFixed(6)) : "",
  );
  const [lng, setLng] = useState(
    userLocation ? String(userLocation.longitude.toFixed(6)) : "",
  );
  const [features, setFeatures] = useState<WashroomFeatures>(defaultFeatures);

  const addMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      const latNum = Number.parseFloat(lat);
      const lngNum = Number.parseFloat(lng);
      if (Number.isNaN(latNum) || Number.isNaN(lngNum))
        throw new Error("Invalid coordinates");
      if (!name.trim()) throw new Error("Name is required");
      if (!address.trim()) throw new Error("Address is required");

      const coords: Coordinates = { latitude: latNum, longitude: lngNum };
      await actor.addWashroom(
        name.trim(),
        address.trim(),
        coords,
        features,
        50,
      );
    },
    onSuccess: () => {
      toast.success("Washroom added successfully!");
      queryClient.invalidateQueries({ queryKey: ["washrooms"] });
      handleClose();
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to add washroom");
    },
  });

  const handleClose = () => {
    setOpen(false);
    setName("");
    setAddress("");
    setLat(userLocation ? String(userLocation.latitude.toFixed(6)) : "");
    setLng(userLocation ? String(userLocation.longitude.toFixed(6)) : "");
    setFeatures(defaultFeatures);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMutation.mutate();
  };

  const toggleFeature = (key: keyof WashroomFeatures) => {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-panel flex items-center justify-center hover:bg-primary/90 active:scale-95 transition-all z-40"
        aria-label="Add new washroom"
        data-ocid="add.open_modal_button"
      >
        <Plus className="w-6 h-6" aria-hidden="true" />
      </button>

      <Dialog
        open={open}
        onOpenChange={(val) => {
          if (!val) handleClose();
          else setOpen(true);
        }}
      >
        <DialogContent
          className="max-w-md w-full rounded-2xl"
          data-ocid="add.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-xl flex items-center gap-2">
              <span aria-hidden="true">♿</span> Add Accessible Washroom
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="add-name" className="text-sm font-semibold">
                Name{" "}
                <span className="text-destructive" aria-hidden="true">
                  *
                </span>
              </Label>
              <Input
                id="add-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. City Library — Ground Floor"
                required
                autoComplete="off"
                className="min-h-[44px]"
                data-ocid="add.name_input"
              />
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <Label htmlFor="add-address" className="text-sm font-semibold">
                Address{" "}
                <span className="text-destructive" aria-hidden="true">
                  *
                </span>
              </Label>
              <Input
                id="add-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 123 Main Street, Toronto"
                required
                autoComplete="street-address"
                className="min-h-[44px]"
                data-ocid="add.address_input"
              />
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="add-lat" className="text-sm font-semibold">
                  Latitude{" "}
                  <span className="text-destructive" aria-hidden="true">
                    *
                  </span>
                </Label>
                <Input
                  id="add-lat"
                  type="number"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  placeholder="43.6532"
                  step="any"
                  min="-90"
                  max="90"
                  required
                  className="min-h-[44px]"
                  data-ocid="add.lat_input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="add-lng" className="text-sm font-semibold">
                  Longitude{" "}
                  <span className="text-destructive" aria-hidden="true">
                    *
                  </span>
                </Label>
                <Input
                  id="add-lng"
                  type="number"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  placeholder="-79.3832"
                  step="any"
                  min="-180"
                  max="180"
                  required
                  className="min-h-[44px]"
                  data-ocid="add.lng_input"
                />
              </div>
            </div>

            {/* Features */}
            <fieldset>
              <legend className="text-sm font-semibold mb-3">
                Accessibility Features
              </legend>
              <div className="space-y-3">
                <div className="flex items-center gap-3 min-h-[44px]">
                  <Checkbox
                    id="add-wheelchair"
                    checked={features.wheelchairAccessible}
                    onCheckedChange={() =>
                      toggleFeature("wheelchairAccessible")
                    }
                    data-ocid="add.wheelchair_checkbox"
                  />
                  <Label
                    htmlFor="add-wheelchair"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Wheelchair Accessible
                  </Label>
                </div>
                <div className="flex items-center gap-3 min-h-[44px]">
                  <Checkbox
                    id="add-stalls"
                    checked={features.accessibleStalls}
                    onCheckedChange={() => toggleFeature("accessibleStalls")}
                    data-ocid="add.stalls_checkbox"
                  />
                  <Label
                    htmlFor="add-stalls"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Accessible Stalls
                  </Label>
                </div>
                <div className="flex items-center gap-3 min-h-[44px]">
                  <Checkbox
                    id="add-baby"
                    checked={features.babyChangingStation}
                    onCheckedChange={() => toggleFeature("babyChangingStation")}
                    data-ocid="add.baby_checkbox"
                  />
                  <Label
                    htmlFor="add-baby"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Baby Changing Station
                  </Label>
                </div>
                <div className="flex items-center gap-3 min-h-[44px]">
                  <Checkbox
                    id="add-gender"
                    checked={features.genderNeutral}
                    onCheckedChange={() => toggleFeature("genderNeutral")}
                    data-ocid="add.gender_checkbox"
                  />
                  <Label
                    htmlFor="add-gender"
                    className="text-sm font-medium cursor-pointer"
                  >
                    Gender Neutral
                  </Label>
                </div>
              </div>
            </fieldset>

            <DialogFooter className="gap-2 flex-col sm:flex-row pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="w-full sm:w-auto min-h-[44px]"
                data-ocid="add.cancel_button"
              >
                <X className="w-4 h-4 mr-1" aria-hidden="true" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={addMutation.isPending}
                className="w-full sm:w-auto min-h-[44px] font-bold"
                data-ocid="add.submit_button"
              >
                {addMutation.isPending ? (
                  <>
                    <Loader2
                      className="w-4 h-4 mr-2 animate-spin"
                      aria-hidden="true"
                    />
                    Adding…
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-1" aria-hidden="true" />
                    Add Washroom
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
