import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import formidable from 'formidable';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDirectory = path.join(dirname, '../_data/');

// Function to get all file names in a directory
function getFileNames(directoryPath=dataDirectory) {
  return new Promise((resolve, reject) => {
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        reject(err);
      } else {
        resolve(files);
      }
    });
  });
}


// Function to delete a file if it exists
function deleteFile(fileName, directoryPath = dataDirectory) {
    const filePath = path.join(directoryPath, fileName);
  
    return new Promise((resolve, reject) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          if (err.code === 'ENOENT') {
            resolve(`File doesn't exist, won't remove it.`);
          } else {
            reject(`Error occurred while trying to remove file: ${err}`);
          }
        } else {
          resolve(`Removed file: ` + fileName);
        }
      });
    });
  }


  async function saveFiles(req, directoryPath = dataDirectory) {
    const form = formidable();
  
    await form.parse(req, (err, fields, files) => {
      if (err) {
        throw err;
      }
  
      for (let file of Object.values(files)) {
        const oldPath = file.path;
        const newPath = path.join(directoryPath, file.name);
  
        // Check if the file has an extension
        if (path.extname(newPath) === '') {
          throw new Error(`File ${file.name} has no extension`);
        }
  
        fs.rename(oldPath, newPath, function (err) {
          if (err) throw err;
        });
      }
    });
  }
// Usage
// // Get all file names in a directory
// getFileNames()
//   .then(console.log)
//   .catch(console.error);

// // Delete a file if it exists
// deleteFile("online_orders.txt")
//   .then(console.log)
//   .catch(console.error);