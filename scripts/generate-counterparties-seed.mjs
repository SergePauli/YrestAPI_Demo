import { faker } from "@faker-js/faker";
import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(__dirname, "../db/seeds/counterparties.csv");
const counterpartyCount = 240;

faker.seed(20260331);

const businessSuffixes = ["LLC", "Inc.", "JSC", "Ltd.", "Corp.", "Group", "Holdings"];

function buildTin(index) {
  return String(7700000000 + index).padStart(10, "0");
}

function buildTaxRegistrationCode(index) {
  return String(770400000 + index).padStart(9, "0");
}

function csvEscape(value) {
  const stringValue = String(value ?? "");
  return `"${stringValue.replaceAll('"', '""')}"`;
}

function buildCompanyName(index) {
  const baseName = faker.company
    .name()
    .replace(/\s+(LLC|Inc\.?|Ltd\.?|Corp\.?|PLC|Group|Holdings|JSC)\s*$/i, "")
    .replace(/\s+(LLC|Inc\.?|Ltd\.?|Corp\.?|PLC|Group|Holdings|JSC)\s*$/i, "");
  const suffix = businessSuffixes[index % businessSuffixes.length];
  return `${baseName} ${suffix}`;
}

const rows = [];
for (let index = 1; index <= counterpartyCount; index += 1) {
  rows.push(
    [
      buildCompanyName(index),
      buildTin(index),
      buildTaxRegistrationCode(index),
    ].map(csvEscape).join(",")
  );
}

writeFileSync(outputPath, `${rows.join("\n")}\n`, "utf8");
console.log(`Generated ${counterpartyCount} counterparties at ${outputPath}`);
