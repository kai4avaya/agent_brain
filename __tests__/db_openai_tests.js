import Database from '../src/database/db_openai.js'; // Adjust the import path according to your project structure

async function testDatabase() {
  console.log("Initializing Database...");
  const db = new Database("./test_storage_openai"); // Specify a test directory
  await db.init();
  // Insert documents
  const documents = [
    { text: 'This is the first document.', id_: 'doc1' },
    { text: 'This is the second document.', id_: 'doc2' },
  ];
  await db.insertDocuments(documents);
  console.log("Querying the Database...");
  // Perform a query - replace with the actual query method you implement
  // Query the database
  let response = await db.query('first document');
  console.log('Query response:', response.toString());


  // Here, implement your logic to validate the query result
  // This is dependent on how you structure your query results
  // For example:
  if (response) {
    console.log('Test passed: Query returned results');
  } else {
    console.error('Test failed: Query did not return expected results');
  }

  console.log("Deleting All Documents...");
  await db.deleteAllDocuments();

  // Optionally, verify deletion - this may require checking the storage directory or implementing a method to check for the absence of documents
  console.log("All tests completed.");
}

testDatabase().catch(console.error);
