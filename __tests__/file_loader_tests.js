import { loadAndPrintDocuments } from '../src/document_loaders/load_docs.js'; // Replace with the path to your file

async function testLoadAndPrintDocuments() {
  // Capture console.log output
  const originalLog = console.log;
  let consoleOutput = [];
  console.log = (output) => consoleOutput.push(output);

  console.log("WE ARE MEAT 1!");

  await loadAndPrintDocuments();

  // Restore console.log
  console.log = originalLog;

  // Check if console.log was called
  if (consoleOutput.length === 0) {
    console.error('Test failed: loadAndPrintDocuments did not log anything');
  } else {
    console.log('Test passed: loadAndPrintDocuments logged', consoleOutput);
  }
}

// Run the test
testLoadAndPrintDocuments();