import { useQuery } from "@tanstack/react-query";
import type { Coordinates, Washroom } from "../backend";
import { useActor } from "./useActor";

export function useWashrooms(
  userLocation: Coordinates | null,
  searchRadius: number,
) {
  const { actor, isFetching } = useActor();

  return useQuery<Washroom[]>({
    queryKey: [
      "washrooms",
      userLocation?.latitude,
      userLocation?.longitude,
      searchRadius,
    ],
    queryFn: async () => {
      if (!actor || !userLocation) return [];
      const result = await actor.findAccessibleWashroomsCoords(
        userLocation,
        searchRadius,
      );
      return result ?? [];
    },
    enabled: !!actor && !isFetching && !!userLocation,
  });
}
