// import { SimpleDirectoryReader } from "llamaindex/readers/SimpleDirectoryReader";
// import Database from '../database/db_openai.js'; // Adjust the import path according to your project structure
// import Database from '../database/db_free.js'; // Adjust the import path according to your project structure

// import path from 'path';
// import { fileURLToPath } from 'url';

// async function loadAndPrintDocuments(db='free', file_storage='../_data/') {
//   const reader = new SimpleDirectoryReader();
//   const dirname = path.dirname(fileURLToPath(import.meta.url));
//   const dataDirectory = path.join(dirname, '../_data/');
//   const documents = await reader.loadData(dataDirectory);

//   documents.forEach((doc) => {
//     console.log(`document (${doc.id_}):`, doc.getText());
//   });
// }

// // Call the function
// loadAndPrintDocuments();

import { SimpleDirectoryReader } from "llamaindex/readers/SimpleDirectoryReader";
import path from "path";
import { fileURLToPath } from "url";

export async function loadAndPrintDocuments(
  db = "free",
  file_storage = "../_data/"
) {
  let Database;
  if (db === "openai") {
    Database = await import("../database/db_openai.js");
  } else {
    Database = await import("../database/db_free.js");
  }

  function generateRandomString(length) {
    return Math.random().toString(36).substring(2, 2 + length);
  }

  const reader = new SimpleDirectoryReader();
  const dirname = path.dirname(fileURLToPath(import.meta.url));
  const dataDirectory = path.join(dirname, file_storage);
  // console.log("dataDirectory", dataDirectory)
  const documents = await reader.loadData(dataDirectory)

    let originalFileName; // = path.basename(doc.id_);
     
  documents.forEach((doc) => {
    if (doc.id_.includes('\\')) {
      originalFileName = path.basename(doc.id_);
      doc.id_ = originalFileName + '||' + generateRandomString(5);
      
    }
    else{
      doc.id_ = originalFileName + '||' + generateRandomString(5);
    }
    console.log("i am doc.id", doc.id_)
  });

  // console.log("i is documents", documents)
  const Database_default = Database.default;
  const database = await new Database_default();
  await database.init();

  // console.log("I am DATABASE", database);
  await database.insertDocuments(await documents);
  console.log(`Inserted ${documents.length} documents into the database.`);
}

// Call the function
// loadAndPrintDocuments();
