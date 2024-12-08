const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs'); // Import the File System module

// Render PDF and Save to File
const renderPDF = async (html, outputFilename) => {
  const reportsDir = path.join(__dirname, '../reports');
  
  // Check if the 'reports' folder exists, if not, create it
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir);
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setContent(html);

  // Save the PDF to the reports folder
  const outputPath = path.join(reportsDir, outputFilename);
  await page.pdf({ path: outputPath, format: 'A4' });

  await browser.close();
  return outputPath; // Return the file path of the saved PDF
};

// Handle Errors
const handleError = (res, err) => {
  console.error(err);
  res.status(500).send({ message: 'Error generating report', error: err.message });
};

module.exports = { renderPDF, handleError };
