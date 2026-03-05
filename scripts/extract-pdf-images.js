/**
 * Extract all images and icons from TURKOV PDF catalogue
 * Run: node scripts/extract-pdf-images.js
 */
import { createRequire } from "module";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const { ExtractImages } = require("pdf-image-extractor");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pdfPath = "c:\\Users\\Mila\\Desktop\\Турков\\Turkov_catalogue_ver._3.1_web.pdf";
const outputDir = path.join(__dirname, "..", "public", "turkov-catalogue-images");

async function main() {
  if (!fs.existsSync(pdfPath)) {
    console.error("PDF not found:", pdfPath);
    process.exit(1);
  }

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log("Created output dir:", outputDir);
  }

  try {
    console.log("Reading PDF file...");
    const pdfBuffer = fs.readFileSync(pdfPath);
    const pdfBlob = new Blob([pdfBuffer], { type: "application/pdf" });

    console.log("Extracting images from PDF...");
    const images = await ExtractImages({ pdf: pdfBlob, fileType: "blob" });

    console.log(`Found ${images.length} images`);

    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const ext = img.imageType?.includes("png") ? "png" : "jpg";
      const filename = `turkov-img-${String(i + 1).padStart(3, "0")}.${ext}`;
      const filepath = path.join(outputDir, filename);

      const buffer = await img.blob.arrayBuffer();
      fs.writeFileSync(filepath, Buffer.from(buffer));
      console.log(`Saved: ${filename} (${img.imageType || "unknown"})`);
    }

    console.log(`\nDone! ${images.length} images saved to ${outputDir}`);
  } catch (err) {
    console.error("Error:", err.message);
    console.error(err.stack);
    process.exit(1);
  }
}

main();
