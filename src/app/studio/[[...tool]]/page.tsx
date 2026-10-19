"use client";

import dynamic from "next/dynamic";

// The Studio touches `window` at import time (DOMPurify), so it must never render on the server.
const Studio = dynamic(() => import("./Studio"), { ssr: false });

export default function StudioPage() {
  return <Studio />;
}
