import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "xvyxwo8y";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "dentist-template";
const token = process.env.SANITY_API_TOKEN;

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-01-01",
  useCdn: false
});

async function checkData() {
  try {
    const doc = await client.fetch('*[_id == "clinicConfig"][0]');
    console.log("Current Sanity document structure:");
    console.log(JSON.stringify(doc, null, 2));
  } catch (error) {
    console.error("Error fetching document:", error);
  }
}

checkData();
