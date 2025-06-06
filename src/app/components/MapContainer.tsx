"use client";

import dynamic from "next/dynamic";

const ClientMap = dynamic(() => import("./ClientMap"), {
  ssr: false,
  loading: () => <div className="w-full h-[800px] bg-gray-100 animate-pulse" />,
});

interface MapContainerProps {
  className?: string;
}

export default function MapContainer({ className }: MapContainerProps) {
  return (
    <div className={className || "w-full h-[800px] relative"}>
      <ClientMap className="w-full h-full" />
    </div>
  );
}
