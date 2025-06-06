"use client";

import Map from "ol/Map.js";
import View from "ol/View.js";
import TileLayer from "ol/layer/Tile.js";
import "ol/ol.css";
import OSM from "ol/source/OSM.js";
import TileWMS from "ol/source/TileWMS.js";
import { useEffect, useRef } from "react";

interface ClientMapProps {
  className?: string;
}

const ClientMap = ({ className }: ClientMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const wmsSource = new TileWMS({
      url: "http://34.124.153.242:8087/geoserver/ws27313/wms",
      params: {
        LAYERS: "ws27313:sat_tiles",
        TILED: true,
        VERSION: "1.1.0",
        FORMAT: "image/png",
        TRANSPARENT: true,
        STYLES: "",
      },
      serverType: "geoserver",
      transition: 0,
      tileLoadFunction: async (tile, src) => {
        try {
          const response = await fetch(
            `/api/tiles?url=${encodeURIComponent(src)}`
          );
          if (!response.ok) throw new Error("Tile fetch failed");

          const { data } = await response.json();
          if (data) {
            (tile as any).getImage().src = data;
          }
        } catch (err) {
          console.error("Tile load error:", err);
        }
      },
    });

    const layers = [
      new TileLayer({
        source: new OSM(),
      }),
      new TileLayer({
        source: wmsSource,
      }),
    ];

    const map = new Map({
      target: mapRef.current,
      layers: layers,
      view: new View({
        center: [-9188000, 3166000],
        zoom: 16,
        projection: "EPSG:3857",
      }),
    });

    mapInstance.current = map;

    return () => {
      if (mapInstance.current) {
        mapInstance.current.setTarget(undefined);
      }
    };
  }, []);

  return (
    <div
      ref={mapRef}
      className={className || "w-full h-[600px]"}
      style={{ position: "relative" }}
    />
  );
};

export default ClientMap;
