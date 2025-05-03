const map = new maplibregl.Map({
  container: "map",
  style: {
    version: 8,
    sources: {},
    layers: [],
  },
  center: [51, 45],
  zoom: 2,
});

map.on("load", () => {
  map.addSource("countries", {
    type: "geojson",
    data: "./data/countries.geojson",
    attribution: "Natural Earth",
  });

  map.addLayer({
    id: "background",
    type: "background",
    paint: {
      "background-color": "rgb(215, 248, 255)",
    },
  });

  map.addLayer({
    id: "countries-layer",
    type: "fill",
    source: "countries",
    paint: {
      "fill-color": [
        "match",
        ["get", "MAPCOLOR7"],

        1,
        "#f0daa5",
        2,
        "#96bb9f",
        3,
        "#e5c185",
        4,
        "#fbf2c4",
        5,
        "#dae0b8",
        6,
        "#b8cdab",
        7,
        "#74a892",
        "rgb(211, 201, 231)",
      ],
    },
  });

  map.addSource("rivers", {
    type: "geojson",
    data: "./data/rivers.geojson",
  });

  map.addLayer({
    id: "rivers-layer",
    type: "line",
    source: "rivers",
    paint: {
      "line-color": "#00BFFF",
    },
  });

  map.addSource("lakes", {
    type: "geojson",
    data: "./data/lakes.geojson",
  });

  map.addLayer({
    id: "lakes-layer",
    type: "fill",
    source: "lakes",
    paint: {
      "fill-color": "lightblue",
      "fill-outline-color": "#00BFFF",
    },
  });

  map.addLayer({
    id: "lakes-border-layer",
    type: "line",
    source: "lakes",
    paint: {
      "line-color": "#00BFFF",
      "line-width": 2,
    },
  });

  map.addSource("cities", {
    type: "geojson",
    data: "./data/cities.geojson",
  });

  map.addLayer({
    id: "cities-layer",
    type: "circle",
    source: "cities",
    paint: {
      "circle-color": [
        "match",
        ["get", "NAME"],
        "Moscow",
        "red",
        "rgb(1, 70, 15)",
      ],
      "circle-radius": 3,
    },

    filter: [">", ["get", "POP_MAX"], 1000000],
  });

  map.on("click", (e) => {
    const cityFeatures = map.queryRenderedFeatures(e.point, {
      layers: ["cities-layer"],
    });

    if (cityFeatures.length > 0) {
      new maplibregl.Popup({ className: "custom-popup" })
        .setLngLat(cityFeatures[0].geometry.coordinates)
        .setHTML(cityFeatures[0].properties.NAME)
        .addTo(map);
      return;
    }

    const countryFeatures = map.queryRenderedFeatures(e.point, {
      layers: ["countries-layer"],
    });

    if (countryFeatures.length > 0) {
      new maplibregl.Popup({ className: "custom-popup" })
        .setLngLat(e.lngLat)
        .setHTML(countryFeatures[0].properties.NAME)
        .addTo(map);
    }
  });

  map.on("mouseenter", "cities-layer", () => {
    map.getCanvas().style.cursor = "pointer";
  });
  map.on("mouseleave", "cities-layer", () => {
    map.getCanvas().style.cursor = "";
  });

  map.on("mouseenter", "countries-layer", () => {
    map.getCanvas().style.cursor = "crosshair";
  });
  map.on("mouseleave", "countries-layer", () => {
    map.getCanvas().style.cursor = "";
  });
});
