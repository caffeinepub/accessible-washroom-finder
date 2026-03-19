import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface WashroomFeatures {
    babyChangingStation: boolean;
    wheelchairAccessible: boolean;
    accessibleStalls: boolean;
    genderNeutral: boolean;
}
export interface Washroom {
    features: WashroomFeatures;
    name: string;
    address: string;
    radiusMeters: number;
    coordinates: Coordinates;
}
export interface Coordinates {
    latitude: number;
    longitude: number;
}
export interface backendInterface {
    addWashroom(name: string, address: string, coordinates: Coordinates, features: WashroomFeatures, radiusMeters: number): Promise<void>;
    findAccessibleWashrooms(searchAddress: string, searchRadius: number): Promise<Array<Washroom>>;
    findAccessibleWashroomsCoords(searchCoords: Coordinates, searchRadius: number): Promise<Array<Washroom>>;
    findNearestAccessibleWashroom(searchCoords: Coordinates): Promise<Washroom | null>;
    initializeIfEmpty(): Promise<void>;
    updateWashroomFeatures(name: string, features: WashroomFeatures): Promise<void>;
}
