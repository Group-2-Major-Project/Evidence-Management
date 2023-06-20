import { PDFDocument, StandardFonts } from "pdf-lib";

const generateChallan = async (jobTitle, vno, first, last, phone, address, imageName) => {
  const date = new Date();
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const response = await fetch('/accidents/' + imageName)
  const imageBytes = await response.arrayBuffer();
  const image = await pdfDoc.embedJpg(imageBytes)

  page.drawImage(image, {
    x: 200,
    y: 500,
    width: 200,
    height: 200,
  });
  page.drawText(`${jobTitle} Challan`, {
    x: 150,
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

  const pdfBytes = await pdfDoc.save();
  const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(pdfBlob);
  downloadLink.download = 'challan.pdf';
  downloadLink.click();
}

export default generateChallan;