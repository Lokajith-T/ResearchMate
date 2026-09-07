const fs = require('fs');

if (typeof global.DOMMatrix === 'undefined') {
  global.DOMMatrix = class {};
  global.Path2D = class {};
  global.ImageData = class {};
}

const pdf = require('pdf-parse');

async function test() {
  const dummyPdf = Buffer.from('%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Count 1\n/Kids [ 3 0 R ]\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/Resources << >>\n/MediaBox [ 0 0 612 792 ]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<< /Length 21 >>\nstream\nBT\n/F1 12 Tf\n10 10 Td\n(Hello) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000216 00000 n \ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n288\n%%EOF');

  try {
    const data = await pdf(dummyPdf);
    console.log("Success with pdf()", data.text);
  } catch (e) {
    console.error("Failed pdf()", e.message);
  }
  
  try {
    if (pdf.default) {
      const data = await pdf.default(dummyPdf);
      console.log("Success with pdf.default()", data.text);
    } else {
      console.log("pdf.default is undefined");
    }
  } catch (e) {
    console.error("Failed pdf.default()", e?.message);
  }
  
  try {
    if (pdf.PDFParse) {
      console.log("PDFParse type:", typeof pdf.PDFParse);
      console.log("PDFParse keys:", Object.keys(pdf.PDFParse));
      console.log("PDFParse prototype:", Object.keys(pdf.PDFParse.prototype));
      // How do we use the class? 
      // Maybe const parser = new pdf.PDFParse(dummyPdf)?
    }
  } catch (e) {
    console.error("Failed PDFParse inspection", e?.message);
  }
}

test();
