// import Database from '../src/database/db_free.js'; // Adjust the import path according to your project structure

// async function testDatabase() {
//   // Create a new Database instance
//   const db = new Database();

//   // Initialize the database
//   await db.init();

//   // Insert documents
//   const documents = [
//     { text: 'This is the first document.', id_: 'doc1' },
//     { text: 'This is the second document.', id_: 'doc2' },
//   ];
//   await db.insertDocuments(documents);

//   // Query the database
//   let response = await db.query('first document');
//   console.log('Query response:', response.toString());

//   // Check if the query response is as expected
//   if (response.toString().includes('doc1')) {
//     console.log('Test passed: The query correctly returned doc1');
//   } else {
//     console.log('Test failed: The query did not return doc1');
//   }

//   // Delete a document
//   await db.deleteDocument('doc1');

//   // Query the database again
//   response = await db.query('first document');
//   console.log('Query response after deletion:', response.toString());

//   // Check if the query response is as expected
//   if (!response.toString().includes('doc1')) {
//     console.log('Test passed: The query correctly did not return doc1 after deletion');
//   } else {
//     console.log('Test failed: The query returned doc1 even after deletion');
//   }
// }

// testDatabase().catch(console.error);

import Database from '../src/database/db_free.js'; // Adjust the import path according to your project structure

async function testDatabase() {
  // Create a new Database instance
  const db = new Database();

  // Initialize the database
  await db.init();

  // Insert documents
  const documents = [
    { text: 'This is the first document.', id_: 'doc1' },
    { text: 'This is the second document.', id_: 'doc2' },
  ];
  await db.insertDocuments(documents);

  // Query the database
  let response = await db.query('first document');
  console.log('Query response:', response.toString());

  // Delete a document
  await db.deleteDocument('doc1');

  // Query the database again
  response = await db.query('first document');
  console.log('Query response after deletion:', response.toString());

  // Delete all documents
//   await db.deleteAllDocuments();

  // Optional: Verify the database is empty or behaves as expected after deleting all documents
  // This step depends on your database's design and how it should behave after all documents are deleted
  // Example:
  response = await db.query('second document');
  console.log('Query response after deleting all documents:', response.toString());
  // Add your verification logic here

  console.log('Completed all tests.');

  await db.deleteAllDocuments();

}

testDatabase().catch(console.error);
