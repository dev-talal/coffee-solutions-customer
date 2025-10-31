import fs from "fs";
import path from "path";

export async function getTranslations(locale = "en", ns = "common") {
  const filePath = path.join(
    process.cwd(),
    "public",
    "locales",
    locale,
    `${ns}.json`
  );
  const file = await fs.promises.readFile(filePath, "utf-8");
  return JSON.parse(file);
}
