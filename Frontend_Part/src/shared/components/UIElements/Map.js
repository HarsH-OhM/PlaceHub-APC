import React, { useRef, useEffect, useState } from "react";

import "./Map.css";

const Map = (props) => {
  const mapRef = useRef();

  const [map, setMap] = useState(null);
  const { center, zoom } = props;

  // useEffect(() => {
  //   const map = new window.google.maps.Map(mapRef.current, {
  //     center: center,
  //     zoom: zoom,
  //   });

  //   new window.google.maps.Marker({ position: center, map: map });
  // }, [center, zoom]);

  useEffect(() => {
    const H = window.H;
    const platform = new H.service.Platform({
      apikey: "here map api key",
    });
    const defaultLayers = platform.createDefaultLayers();

    // Create an instance of the map
    const map = new H.Map(mapRef.current, defaultLayers.vector.normal.map, {
      // This map is centered over Europe
      // center: center,
      // zoom: zoom,
      center: center,
      zoom: zoom,
      pixelRatio: window.devicePixelRatio || 1,
    });

    // new H.Map({ position: center, map: map });
    setMap(map);
  }, [center, zoom]);

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    ></div>
  );
};

export default Map;
