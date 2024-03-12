// Object.defineProperty(exports, '__esModule', { value: true });

// var Node = require('llamaindex/Node');
// var env = require('llamaindex/env');

import { Document } from 'llamaindex/Node'; // Adjust the import path based on your project structure
import { defaultFS, createSHA256 } from 'llamaindex/env'; // Adjust the import path
import PdfParser from 'pdf2json'; // Ensure this package supports ES Module import


function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
/**
 * Read the text of a PDF
 */ 
// class PDFReader {
//     loadData(file, fs = env.defaultFS) {
//         return _async_to_generator(function*() {
//             const content = yield fs.readRawFile(file);
//             const text = yield readPDF(content);
//             return text.map((text)=>{
//                 const sha256 = env.createSHA256();
//                 sha256.update(text);
//                 const filename = file.split('/').pop(); // Extract filename without the path
//                 return new Node.Document({
//                     text,
//                     id_:  filename + '||' +sha256.digest()
//                 });
//             });
//         })();
//     }
// }


class PDFReader {
    async loadData(file, fs = defaultFS) {
        const content = await fs.readRawFile(file);
        const textChunks = await readPDF(content);
        return textChunks.map(text => {
            const sha256 = createSHA256();
            sha256.update(text);
            const filename = file.split('/').pop(); // Extract filename without the path
            return new Document({
                text,
                id_: filename + '||' + sha256.digest('hex') // Assuming hex encoding for the digest
            });
        });
    }
}

async function readPDF(data) {
    const parser = new PdfParser(null, 1);
    return new Promise((resolve, reject) => {
        parser.on("pdfParser_dataError", err => reject(err));
        parser.on("pdfParser_dataReady", () => {
            resolve(parser.getRawTextContent());
        });
        parser.parseBuffer(data);
    }).then(text => text.split(/----------------Page \(\d+\) Break----------------/g));
}

// function _readPDF() {
//     _readPDF = _async_to_generator(function*(data) {
//         const parser = yield import('pdf2json').then(({ default: Pdfparser })=>new Pdfparser(null, 1));
//         const text = yield new Promise((resolve, reject)=>{
//             parser.on("pdfParser_dataError", (error)=>{
//                 reject(error);
//             });
//             parser.on("pdfParser_dataReady", ()=>{
//                 resolve(parser.getRawTextContent());
//             });
//             parser.parseBuffer(data);
//         });
//         return text.split(/----------------Page \(\d+\) Break----------------/g);
//     });
//     return _readPDF.apply(this, arguments);
// }



// exports.PDFReader = PDFReader;
export { PDFReader };