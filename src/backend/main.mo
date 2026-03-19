import Array "mo:core/Array";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Float "mo:core/Float";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";

actor {
  type Coordinates = {
    latitude : Float;
    longitude : Float;
  };

  type WashroomFeatures = {
    wheelchairAccessible : Bool;
    genderNeutral : Bool;
    babyChangingStation : Bool;
    accessibleStalls : Bool;
  };

  type Washroom = {
    name : Text;
    address : Text;
    coordinates : Coordinates;
    features : WashroomFeatures;
    radiusMeters : Float;
  };

  module Washroom {
    public func compare(washroom1 : Washroom, washroom2 : Washroom) : Order.Order {
      switch (washroom1.name.compare(washroom2.name)) {
        case (#equal) { washroom1.address.compare(washroom2.address) };
        case (order) { order };
      };
    };
  };

  type DistanceWashroom = {
    distance : Float;
    washroom : Washroom;
  };

  let washrooms = Map.empty<Text, Washroom>();

  func calculateDistance(coord1 : Coordinates, coord2 : Coordinates) : Float {
    let earthRadius = 6371000.0;

    let dLat = ((coord2.latitude - coord1.latitude) * 3.1415926535) / 180.0;
    let dLon = ((coord2.longitude - coord1.longitude) * 3.1415926535) / 180.0;

    let a = (
      Float.pow(Float.sin(dLat / 2.0), 2.0) +
      Float.cos(coord1.latitude * 3.1415926535 / 180.0) *
      Float.cos(coord2.latitude * 3.1415926535 / 180.0) *
      Float.pow(Float.sin(dLon / 2.0), 2.0)
    );
    let c = 2.0 * Float.arctan2(Float.sqrt(a), Float.sqrt(1.0 - a));

    earthRadius * c;
  };

  func trimWhitespace(text : Text) : Text {
    text.trimStart(#char(' ')).trimEnd(#char(' '));
  };

  func cleanWashroomName(name : Text) : Text {
    trimWhitespace(name);
  };

  func getNearbyWashrooms(location : Coordinates, searchRadius : Float) : [Washroom] {
    washrooms.values().toArray().filter(
      func(washroom) {
        calculateDistance(location, washroom.coordinates) <= searchRadius + washroom.radiusMeters;
      }
    );
  };

  func hasSeedData() : Bool {
    not washrooms.isEmpty();
  };

  func addSeedWashroom(name : Text, address : Text, lat : Float, lon : Float, features : WashroomFeatures, radius : Float) {
    let washroom : Washroom = {
      name;
      address;
      coordinates = {
        latitude = lat;
        longitude = lon;
      };
      features;
      radiusMeters = radius;
    };
    washrooms.add(name, washroom);
  };

  func seedWashrooms() {
    addSeedWashroom(
      "Toronto Public Library",
      "789 Queen St, Toronto, Canada",
      43.668,
      -79.3915,
      {
        wheelchairAccessible = true;
        genderNeutral = true;
        babyChangingStation = true;
        accessibleStalls = true;
      },
      20.0,
    );
    addSeedWashroom(
      "Vancouver Mall",
      "2468 Oak Ave, Vancouver, Canada",
      49.2827,
      -123.1207,
      {
        wheelchairAccessible = true;
        genderNeutral = false;
        babyChangingStation = true;
        accessibleStalls = true;
      },
      30.0,
    );
    addSeedWashroom(
      "London Park Restroom",
      "1357 Elm St, London, UK",
      51.5060,
      -0.1400,
      {
        wheelchairAccessible = true;
        genderNeutral = true;
        babyChangingStation = false;
        accessibleStalls = true;
      },
      25.0,
    );
    addSeedWashroom(
      "Sydney Beach Facility",
      "321 Ocean Rd, Sydney, Australia",
      -33.8688,
      151.2093,
      {
        wheelchairAccessible = true;
        genderNeutral = false;
        babyChangingStation = true;
        accessibleStalls = true;
      },
      15.0,
    );
    addSeedWashroom(
      "New York Central Park",
      "987 Park Ave, New York, USA",
      40.7851,
      -73.9683,
      {
        wheelchairAccessible = true;
        genderNeutral = true;
        babyChangingStation = false;
        accessibleStalls = false;
      },
      22.0,
    );
    addSeedWashroom(
      "Melbourne Shopping Center",
      "654 Main St, Melbourne, Australia",
      -37.8150,
      144.9631,
      {
        wheelchairAccessible = true;
        genderNeutral = false;
        babyChangingStation = true;
        accessibleStalls = true;
      },
      18.0,
    );
    addSeedWashroom(
      "Paris City Hall",
      "456 King St, Paris, France",
      48.8566,
      2.3522,
      {
        wheelchairAccessible = true;
        genderNeutral = true;
        babyChangingStation = true;
        accessibleStalls = false;
      },
      20.0,
    );
    addSeedWashroom(
      "Tokyo Train Station",
      "987 Travel Blvd, Tokyo, Japan",
      35.6812,
      139.7671,
      {
        wheelchairAccessible = true;
        genderNeutral = false;
        babyChangingStation = true;
        accessibleStalls = true;
      },
      16.0,
    );
    addSeedWashroom(
      "San Francisco Public Library",
      "321 Book Lane, San Francisco, USA",
      37.7749,
      -122.4194,
      {
        wheelchairAccessible = true;
        genderNeutral = true;
        babyChangingStation = true;
        accessibleStalls = true;
      },
      24.0,
    );
    addSeedWashroom(
      "Toronto Union Station",
      "789 Main Stn, Toronto, Canada",
      43.6452,
      -79.3809,
      {
        wheelchairAccessible = true;
        genderNeutral = true;
        babyChangingStation = true;
        accessibleStalls = true;
      },
      22.0,
    );
  };

  public shared ({ caller }) func initializeIfEmpty() : async () {
    let hasSeeds = hasSeedData();

    if (not hasSeeds) {
      seedWashrooms();
    };
  };

  public shared ({ caller }) func addWashroom(name : Text, address : Text, coordinates : Coordinates, features : WashroomFeatures, radiusMeters : Float) : async () {
    if (name == "") {
      Runtime.trap("Washroom name cannot be empty");
    };

    if (washrooms.containsKey(name)) {
      Runtime.trap("Washroom with this name already exists");
    };

    let washroom = {
      name;
      address;
      coordinates;
      features;
      radiusMeters;
    };

    washrooms.add(cleanWashroomName(name), washroom);
  };

  public shared ({ caller }) func updateWashroomFeatures(name : Text, features : WashroomFeatures) : async () {
    switch (washrooms.get(name)) {
      case (null) { Runtime.trap("Washroom not found") };
      case (?existingWashroom) {
        let updatedWashroom : Washroom = {
          existingWashroom with features
        };
        washrooms.add(cleanWashroomName(name), updatedWashroom); // Use cleaned name
      };
    };
  };

  public query ({ caller }) func findAccessibleWashroomsCoords(searchCoords : Coordinates, searchRadius : Float) : async [Washroom] {
    let resultsArray = getNearbyWashrooms(searchCoords, searchRadius);

    resultsArray.filter(
      func(washroom) { washroom.features.wheelchairAccessible }
    );
  };

  public query ({ caller }) func findAccessibleWashrooms(searchAddress : Text, searchRadius : Float) : async [Washroom] {
    let addressToCoords : Map.Map<Text, Coordinates> = Map.fromIter<Text, Coordinates>(
      [
        ("Toronto", { latitude = 43.668; longitude = -79.3915 }),
        ("Vancouver", { latitude = 49.2827; longitude = -123.1207 }),
        ("London", { latitude = 51.5060; longitude = -0.1400 }),
        ("Sydney", { latitude = -33.8688; longitude = 151.2093 }),
        ("New York", { latitude = 40.7851; longitude = -73.9683 }),
        ("Melbourne", { latitude = -37.8150; longitude = 144.9631 }),
        ("Paris", { latitude = 48.8566; longitude = 2.3522 }),
        ("Tokyo", { latitude = 35.6812; longitude = 139.7671 }),
        ("San Francisco", { latitude = 37.7749; longitude = -122.4194 }),
      ].values()
    );

    switch (addressToCoords.get(searchAddress)) {
      case (null) { Runtime.trap("Invalid address for test query") };
      case (?searchCoords) {
        let resultsArray = getNearbyWashrooms(searchCoords, searchRadius);
        resultsArray.filter(
          func(washroom) { washroom.features.wheelchairAccessible }
        );
      };
    };
  };

  public query ({ caller }) func findNearestAccessibleWashroom(searchCoords : Coordinates) : async ?Washroom {
    let resultsArray = getNearbyWashrooms(searchCoords, 10000.0);

    let accessible = resultsArray.filter(
      func(washroom) {
        washroom.features.wheelchairAccessible;
      }
    );

    if (accessible.size() > 0) {
      ?accessible[0];
    } else {
      null;
    };
  };
};
