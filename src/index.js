import express from 'express';
import jwt from 'jsonwebtoken';
import { expressjwt } from "express-jwt";
import cors from 'cors';
import {scrapeWebsite} from './scraper/scrape.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {loadAndPrintDocuments} from './document_loaders/load_docs_extends_llamaIndex.js';
import Database from './database/db_free.js';
import morgan from 'morgan';
import config from './configs/server.config.js';
import multer from 'multer';
import { query_agent, query_retriever_agent } from './agents/query_agent.js'; 

const DB = new Database()
DB.init()

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


app.use(cors());
// Use express.json() middleware to parse JSON bodies
app.use(express.json());
// Middleware to check JWT
app.use(expressjwt({ secret: config.secret, algorithms: ['HS256'] }).unless({ path: ['/token'] }));

// Route to generate a new token
app.post('/token', (req, res) => {
  // Here you would normally validate the user's credentials before generating a token
  const token = jwt.sign({ user: config.username }, config.secret, { expiresIn: config.tokenExpiry });
  res.send({ token });
});

// Set up multer to store files in src/_data with original filenames
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'src/_data')
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  }
})

morgan.token('jwt', function (req, res) {
  return req.headers.authorization;
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :jwt'));


const upload = multer({ storage: storage });

// Route to upload files
app.post('/upload', upload.array('files'), async (req, res) => {
  // req.files is an array of files uploaded
  await loadAndPrintDocuments();
  res.send('Files uploaded');
});

app.get('/query', async (req, res) => {
  const query = req.query.query;
  console.log("query", query)
  const response = await DB.query(query);
  res.json(response);
})


app.delete('/nuke', async (req, res) => { 
  try {
    // Get all files in the _data directory
    const files = fs.readdirSync(path.join(__dirname, '_data'));

    // Delete each file
    for (const file of files) {
      fs.unlinkSync(path.join(__dirname, '_data', file));
    }

    // Delete all documents in the database
    await DB.deleteAllDocuments();

    res.send('All documents deleted');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});


// app.get('/chat', async (req, res) => {
//   const query = req.query.message; // Get the query from the request
//   const stream = await query_retriever_agent(DB.chatEngine, query);
//   stream.pipe(res); // Pipe the stream to the response
// });
app.get('/chat', async (req, res) => {
  const query = req.query.message; // Get the query from the request
  console.log("query", query)
  try {
    const stream = await query_retriever_agent(DB.chatEngine, query);
    console.log("query", query, stream)

    // Check if the object is an async generator
    if (stream && typeof stream[Symbol.asyncIterator] === 'function') {
      res.setHeader('Content-Type', 'text/plain');
      for await (const chunk of stream) {
        console.log("         ME chunk", chunk)
        res.write(chunk.response);
      }
      res.end();
    } else if (stream && typeof stream.then === 'function') {
      // If it's a promise or thenable (async data), wait for the data and then send it
      stream.then(data => {
        if (typeof data === 'string' || Buffer.isBuffer(data)) {
          res.send(data);
        } else {
          // If the data is an object, convert it to a string (e.g., JSON)
          res.json(data);
        }
      }).catch(err => {
        console.error('Error processing chat stream:', err);
        res.status(500).send('Internal Server Error');
      });
    } else {
      // If the returned object is neither a stream nor a promise, send it directly
      // This assumes the data is in a format that can be sent (string, Buffer, or object)
      if (typeof stream === 'string' || Buffer.isBuffer(stream)) {
        res.send(stream);
      } else {
        res.json(stream);
      }
    }
  } catch (error) {
    console.error('Error during chat operation:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/ai', async (req, res) => {
  const query = req.query.query;
  let ai_type = req.query.ai_type;
  if (!ai_type) ai_type = "openai" // placeholder for future if we have more than one ai agent

  let queryEngineTool; 
  if (ai_type === "openai") {
    queryEngineTool = DB.queryEngineTools
    // we can add different agents here (cohere, gemini etc.)
  }

  console.log("running query", query, "with ai_type", ai_type, "and queryEngineTool", queryEngineTool)
  const response = await query_agent(queryEngineTool,query)
  res.json(response);


})

// this needs to run anytime files are uploaded or removed directlry from _data
app.get('/load_docs', async (req, res) => {
  console.log("I AM LOADING DOCS")
  await loadAndPrintDocuments();
  res.send('Documents loaded');
}
)


app.get('/files', (req, res) => {
  const directoryPath = path.join(__dirname, '_data');

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).send(['Unable to scan directory: '] + err);
    }

    res.json(files);
  });
});



app.post('/scrape', async (req, res) => {

  const urls = req.body.urls;

  for (const url of urls) {
    const data = await scrapeWebsite(url);

    if (data) {
      const filename = url.replace(/^https?:\/\//, '').replace(/\./g, '_').replace(/[^a-z0-9_]/gi, '_').toLowerCase() + '.txt';
      const filepath = path.join('src/_data', filename);

      fs.writeFile(filepath, data.siteText, (err) => {
        if (err) {
          console.error(`Error writing file ${filepath}: ${err}`);
        }
      });
    }
  }

  res.send('Scraping started');
});


app.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join('src/_data', filename);

  fs.access(filepath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`File ${filepath} does not exist: ${err}`);
      res.status(404).send(`File ${filename} does not exist.`);
    } else {
      res.download(filepath, filename, (err) => {
        if (err) {
          console.error(`Error downloading file ${filepath}: ${err}`);
          res.status(500).send(`Error downloading file ${filename}: ${err}`);
        }
      });
    }
  });
});


app.delete('/document/:id', async (req, res) => {
  const id = req.params.id;
  

  try {
    await DB.deleteDocument(id);

    // Delete the file from src/_data
    fs.unlink(path.join('src/_data', id), (err) => {
      if (err) {
        console.error(`Error deleting file with ID ${id}: ${err}`);
      } else {
        console.log(`File with ID ${id} has been deleted.`);
      }
    });

    res.status(200).send(`Document with ID ${id} has been deleted.`);
  } catch (error) {
    console.error(`Error deleting document with ID ${id}: ${error}`);
    res.status(500).send(`Error deleting document with ID ${id}: ${error}`);
  }
});

// Protected route
app.get('/protected', (req, res) => {
  res.send('This is a protected route');
});

app.listen(config.port, () => console.log(`Server started on port ${config.port}`));