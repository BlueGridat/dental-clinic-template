import { createDataAttribute } from "next-sanity";

const sanityData = createDataAttribute({
  baseUrl: "/studio",
  id: "clinicConfig",
  type: "clinicConfig",
  tool: "presentation"
});

export function dataSanity(path: string) {
  return sanityData(path);
}
