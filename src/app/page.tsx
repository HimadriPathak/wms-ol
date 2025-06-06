export const dynamic = "force-dynamic";

import MapContainer from "./components/MapContainer";
import ServerMap from "./components/ServerMap";

export default function Home() {
  return (
    <main className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">WMS Map Viewer</h1>
      <div className="relative">
        <ServerMap className="w-full h-[800px] rounded-lg shadow-lg" />
        <div className="absolute inset-0">
          <MapContainer className="w-full h-full" />
        </div>
      </div>
    </main>
  );
}
