const XLSX = require("xlsx");

async function logToSheet(checkInSummary) {
  const fileName = "checkInHistory";

  var workbook = null;

  try {
    workbook = XLSX.readFile(`${fileName}.xls`);
  } catch (e) {
    if (!workbook) {
      workbook = XLSX.utils.book_new(); // Create xlsx book

      const data = [];
      data.push(["Script Run Date", "CheckedIn?"]);

      const sheet = XLSX.utils.aoa_to_sheet(data); // Create a sheet
      XLSX.utils.book_append_sheet(workbook, sheet, "sheet1"); // Attach the sheet
    }
  }

  var first_sheet_name = workbook.SheetNames[0];

  /* Get worksheet */
  let worksheet = workbook.Sheets[first_sheet_name];

  var date = new Date().toJSON().slice(0, 10).replace(/-/g, "/");

  /* Append row */
  await XLSX.utils.sheet_add_json(
    worksheet,
    [
      {
        A: `${date}`,
        B: `${checkInSummary.isChecked}`,
      },
    ],
    {
      header: ["A", "B"],
      skipHeader: true,
      origin: -1,
    }
  );

  XLSX.writeFile(workbook, `${fileName}.xls`); // Save the file
}

module.exports = {
  logToSheet,
};
