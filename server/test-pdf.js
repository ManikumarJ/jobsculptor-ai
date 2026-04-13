const fs = require('fs');
const pdfParse = require('pdf-parse');

async function testPdf() {
    try {
        // We'll just check if the module loads and has the expected signature
        console.log(typeof pdfParse);
        console.log("PDF parse loaded correctly.");
    } catch (err) {
        console.error("PDF Parse error: ", err);
    }
}

testPdf();
