const fs = require('fs');
const { exec } = require('child_process');
const { PDFDocument, StandardFonts } = require('pdf-lib');

async function generatePDF(vno, first, last, phone, address) {
  const date = new Date();
  // Read image file
  const imageBytes = fs.readFileSync('accident.jpg');

  // Read text file
  // const text = fs.readFileSync('data.txt', 'utf-8');

  // Extract details from text
  // const [vno, id] = text.split('\n');

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Add a new page
  const page = pdfDoc.addPage();

  // Load the image
  const image = await pdfDoc.embedJpg(imageBytes);

  // Draw the image on the page
  page.drawImage(image, {
    x: 200,
    y: 500,
    width: 200,
    height: 200,
  });

  // Add text to the page
  page.drawText("Challan", {
    x: 250,
    y: 750,
    font: await pdfDoc.embedFont(StandardFonts.TimesRomanBold),
    size: 30
  });
  page.drawText(`Vehicle No.: ${vno}`, {
    x: 80,
    y: 400,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    size: 14,
  });
  page.drawText(`Name: ${first + ' ' + last}`, {
    x: 80,
    y: 360,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    size: 14,
  });
  page.drawText(`Phone No.: ${phone}`, {
    x: 80,
    y: 320,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    size: 14,
  });
  page.drawText(`Address: ${address}`, {
    x: 80,
    y: 280,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    size: 14,
  });
  page.drawText(`Time of incident: ${date.toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}`, {
    x: 80,
    y: 240,
    font: await pdfDoc.embedFont(StandardFonts.Helvetica),
    size: 14,
  });
  // page.drawText(`Address: ${address}`, {
  //   x: 50,
  //   y: 340,
  //   font: await pdfDoc.embedFont(StandardFonts.Helvetica),
  //   size: 12,
  // });

  // Save the PDF to a file
  fs.writeFileSync('output.pdf', await pdfDoc.save());

  // Show the PDF using the default PDF viewer
  exec('open output.pdf');
}

generatePDF(123, 'first', 'last', 456, 'xyz');
export default generatePDF;