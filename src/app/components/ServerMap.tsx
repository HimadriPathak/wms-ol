interface ServerMapProps {
  className?: string;
}

async function getInitialTile() {
  const baseUrl = "http://34.124.153.242:8087/geoserver/ws27313/wms";
  const params = new URLSearchParams({
    service: "WMS",
    version: "1.1.0",
    request: "GetMap",
    layers: "ws27313:sat_tiles",
    bbox: "-9190826.590568729,3160990.5493044234,-9185238.278560376,3171981.2689187014",
    width: "390",
    height: "768",
    srs: "EPSG:3857",
    styles: "",
    format: "image/png",
    transparent: "true",
  });

  const url = `${baseUrl}?${params.toString()}`;
  const response = await fetch(
    `${
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    }/api/tiles?url=${encodeURIComponent(url)}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch initial tile");
  }

  const { data } = await response.json();
  return data;
}

export default async function ServerMap({ className }: ServerMapProps) {
  const initialTile = await getInitialTile();

  return (
    <div className={className || "w-full h-[600px] relative"}>
      {initialTile && (
        <img
          src={initialTile}
          alt="Initial map tile"
          className="w-full h-full object-cover"
        />
      )}
      <div id="map" className="absolute inset-0" />
    </div>
  );
}
