const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

const filePath = path.join(__dirname, "products.xlsx");
const sheetName = "Products";

// ✅ READ DATA FROM EXCEL
function readData() {
  if (!fs.existsSync(filePath)) return [];

  const workbook = XLSX.readFile(filePath);
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) return [];

  return XLSX.utils.sheet_to_json(sheet);
}

// ✅ WRITE DATA TO EXCEL
function writeData(data) {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);

  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, filePath);
}

module.exports = { readData, writeData };