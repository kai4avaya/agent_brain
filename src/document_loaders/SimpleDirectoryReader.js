// Object.defineProperty(exports, '__esModule', { value: true });

// var _ = require('lodash');
// var Node = require('llamaindex/Node');
// var env = require('llamaindex/env');
// var CSVReader = require('llamaindex/readers/CSVReader');
// var DocxReader = require('llamaindex/readers/DocxReader');
// var HTMLReader = require('llamaindex/readers/HTMLReader');
// var ImageReader = require('llamaindex/readers/ImageReader');
// var MarkdownReader = require('llamaindex/readers/MarkdownReader');
// var PDFReader = require('llamaindex/readers/PDFReader');

import _ from 'lodash';
import {Document} from 'llamaindex/Node';
import {defaultFS}  from 'llamaindex/env';
import { PapaCSVReader } from 'llamaindex/readers/CSVReader';
import { DocxReader } from 'llamaindex/readers/DocxReader';
import { HTMLReader } from 'llamaindex/readers/HTMLReader';
import { ImageReader } from 'llamaindex/readers/ImageReader';
import { MarkdownReader } from 'llamaindex/readers/MarkdownReader';
// import { PDFReader as OriginalPDFReader } from 'llamaindex/readers/PDFReader';
// import fs from 'fs/promises';
// import pdfParse from 'pdf-parse'; // Assuming pdf-parse is a placeholder for actual PDF parsing logic
import { PDFReader } from './updated_pdf_reader.js'; // Path to your updated PDFReader


function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var ___default = /*#__PURE__*/_interopDefault(_);

function _async_generator(gen) {
    var front, back;
    function send(key, arg) {
        return new Promise(function(resolve, reject) {
            var request = {
                key: key,
                arg: arg,
                resolve: resolve,
                reject: reject,
                next: null
            };
            if (back) {
                back = back.next = request;
            } else {
                front = back = request;
                resume(key, arg);
            }
        });
    }
    function resume(key, arg) {
        try {
            var result = gen[key](arg);
            var value = result.value;
            var wrappedAwait = value instanceof _await_value;
            Promise.resolve(wrappedAwait ? value.wrapped : value).then(function(arg) {
                if (wrappedAwait) {
                    resume("next", arg);
                    return;
                }
                settle(result.done ? "return" : "normal", arg);
            }, function(err) {
                resume("throw", err);
            });
        } catch (err) {
            settle("throw", err);
        }
    }
    function settle(type, value) {
        switch(type){
            case "return":
                front.resolve({
                    value: value,
                    done: true
                });
                break;
            case "throw":
                front.reject(value);
                break;
            default:
                front.resolve({
                    value: value,
                    done: false
                });
                break;
        }
        front = front.next;
        if (front) {
            resume(front.key, front.arg);
        } else {
            back = null;
        }
    }
    this._invoke = send;
    if (typeof gen.return !== "function") {
        this.return = undefined;
    }
}
if (typeof Symbol === "function" && Symbol.asyncIterator) {
    _async_generator.prototype[Symbol.asyncIterator] = function() {
        return this;
    };
}
_async_generator.prototype.next = function(arg) {
    return this._invoke("next", arg);
};
_async_generator.prototype.throw = function(arg) {
    return this._invoke("throw", arg);
};
_async_generator.prototype.return = function(arg) {
    return this._invoke("return", arg);
};
function _async_generator_delegate(inner, awaitWrap) {
    var iter = {}, waiting = false;
    function pump(key, value) {
        waiting = true;
        value = new Promise(function(resolve) {
            resolve(inner[key](value));
        });
        return {
            done: false,
            value: awaitWrap(value)
        };
    }
    if (typeof Symbol === "function" && Symbol.iterator) {
        iter[Symbol.iterator] = function() {
            return this;
        };
    }
    iter.next = function(value) {
        if (waiting) {
            waiting = false;
            return value;
        }
        return pump("next", value);
    };
    if (typeof inner.throw === "function") {
        iter.throw = function(value) {
            if (waiting) {
                waiting = false;
                throw value;
            }
            return pump("throw", value);
        };
    }
    if (typeof inner.return === "function") {
        iter.return = function(value) {
            return pump("return", value);
        };
    }
    return iter;
}
function _async_iterator$1(iterable) {
    var method, async, sync, retry = 2;
    for("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;){
        if (async && null != (method = iterable[async])) return method.call(iterable);
        if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator$1(method.call(iterable));
        async = "@@asyncIterator", sync = "@@iterator";
    }
    throw new TypeError("Object is not async iterable");
}
function AsyncFromSyncIterator$1(s) {
    function AsyncFromSyncIteratorContinuation(r) {
        if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object."));
        var done = r.done;
        return Promise.resolve(r.value).then(function(value) {
            return {
                value: value,
                done: done
            };
        });
    }
    return AsyncFromSyncIterator$1 = function(s) {
        this.s = s, this.n = s.next;
    }, AsyncFromSyncIterator$1.prototype = {
        s: null,
        n: null,
        next: function() {
            return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments));
        },
        return: function(value) {
            var ret = this.s.return;
            return void 0 === ret ? Promise.resolve({
                value: value,
                done: !0
            }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments));
        },
        throw: function(value) {
            var thr = this.s.return;
            return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments));
        }
    }, new AsyncFromSyncIterator$1(s);
}
function _await_async_generator(value) {
    return new _await_value(value);
}
function _await_value(value) {
    this.wrapped = value;
}
function _wrap_async_generator(fn) {
    return function() {
        return new _async_generator(fn.apply(this, arguments));
    };
}
/**
 * Recursively traverses a directory and yields all the paths to the files in it.
 * @param fs The filesystem to use.
 * @param dirPath The path to the directory to traverse.
 */ function walk(fs, dirPath) {
    return _walk.apply(this, arguments);
}
function _walk() {
    _walk = _wrap_async_generator(function*(fs, dirPath) {
        const entries = yield _await_async_generator(fs.readdir(dirPath));
        for (const entry of entries){
            const fullPath = `${dirPath}/${entry}`;
            const stats = yield _await_async_generator(fs.stat(fullPath));
            if (stats.isDirectory()) {
                yield* _async_generator_delegate(_async_iterator$1(walk(fs, fullPath)), _await_async_generator);
            } else {
                yield fullPath;
            }
        }
    });
    return _walk.apply(this, arguments);
}

function _async_iterator(iterable) {
    var method, async, sync, retry = 2;
    for("undefined" != typeof Symbol && (async = Symbol.asyncIterator, sync = Symbol.iterator); retry--;){
        if (async && null != (method = iterable[async])) return method.call(iterable);
        if (sync && null != (method = iterable[sync])) return new AsyncFromSyncIterator(method.call(iterable));
        async = "@@asyncIterator", sync = "@@iterator";
    }
    throw new TypeError("Object is not async iterable");
}
function AsyncFromSyncIterator(s) {
    function AsyncFromSyncIteratorContinuation(r) {
        if (Object(r) !== r) return Promise.reject(new TypeError(r + " is not an object."));
        var done = r.done;
        return Promise.resolve(r.value).then(function(value) {
            return {
                value: value,
                done: done
            };
        });
    }
    return AsyncFromSyncIterator = function(s) {
        this.s = s, this.n = s.next;
    }, AsyncFromSyncIterator.prototype = {
        s: null,
        n: null,
        next: function() {
            return AsyncFromSyncIteratorContinuation(this.n.apply(this.s, arguments));
        },
        return: function(value) {
            var ret = this.s.return;
            return void 0 === ret ? Promise.resolve({
                value: value,
                done: !0
            }) : AsyncFromSyncIteratorContinuation(ret.apply(this.s, arguments));
        },
        throw: function(value) {
            var thr = this.s.return;
            return void 0 === thr ? Promise.reject(value) : AsyncFromSyncIteratorContinuation(thr.apply(this.s, arguments));
        }
    }, new AsyncFromSyncIterator(s);
}
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
var ReaderStatus;
(function(ReaderStatus) {
    ReaderStatus[ReaderStatus["STARTED"] = 0] = "STARTED";
    ReaderStatus[ReaderStatus["COMPLETE"] = 1] = "COMPLETE";
    ReaderStatus[ReaderStatus["ERROR"] = 2] = "ERROR";
})(ReaderStatus || (ReaderStatus = {}));
/**
 * Read a .txt file
 */ class TextFileReader {
    loadData(file, fs = defaultFS) {
        return _async_to_generator(function*() {
            const dataBuffer = yield fs.readFile(file);
            return [
                new Document({
                    text: dataBuffer,
                    id_: file
                })
            ];
        })();
    }
}

const FILE_EXT_TO_READER = {
    txt: new TextFileReader(),
    pdf:   new PDFReader(), //Pdf.loadData(),
    csv: new PapaCSVReader(),
    md: new MarkdownReader(),
    docx: new DocxReader(),
    htm: new HTMLReader(),
    html: new HTMLReader(),
    jpg: new ImageReader(),
    jpeg: new ImageReader(),
    png: new ImageReader(),
    gif: new ImageReader()
};
/**
 * Read all of the documents in a directory.
 * By default, supports the list of file types
 * in the FILE_EXT_TO_READER map.
 */ class SimpleDirectoryReader {
    loadData(params) {
        var _this = this;
        return _async_to_generator(function*() {
            if (typeof params === "string") {
                params = {
                    directoryPath: params
                };
            }
            const { directoryPath, fs = defaultFS, defaultReader = new TextFileReader(), fileExtToReader = FILE_EXT_TO_READER } = params;
            // Observer can decide to skip the directory
            if (!_this.doObserverCheck("directory", directoryPath, 0)) {
                return [];
            }
            let docs = [];
            {
                var _iteratorAbruptCompletion = false, _didIteratorError = false, _iteratorError;
                try {
                    for(var _iterator = _async_iterator(walk(fs, directoryPath)), _step; _iteratorAbruptCompletion = !(_step = yield _iterator.next()).done; _iteratorAbruptCompletion = false){
                        let _value = _step.value;
                        const filePath = _value;
                        try {
                            const fileExt = ___default.default.last(filePath.split(".")) || "";
                            // Observer can decide to skip each file
                            if (!_this.doObserverCheck("file", filePath, 0)) {
                                continue;
                            }
                            let reader = null;
                            if (fileExt in fileExtToReader) {
                                reader = fileExtToReader[fileExt];
                            } else if (!___default.default.isNil(defaultReader)) {
                                reader = defaultReader;
                            } else {
                                const msg = `No reader for file extension of ${filePath}`;
                                console.warn(msg);
                                // In an error condition, observer's false cancels the whole process.
                                if (!_this.doObserverCheck("file", filePath, 2, msg)) {
                                    return [];
                                }
                                continue;
                            }
                            const fileDocs = yield reader.loadData(filePath, fs);
                            // Observer can still cancel addition of the resulting docs from this file
                            if (_this.doObserverCheck("file", filePath, 1)) {
                                docs.push(...fileDocs);
                            }
                        } catch (e) {
                            const msg = `Error reading file ${filePath}: ${e}`;
                            console.error(msg);
                            // In an error condition, observer's false cancels the whole process.
                            if (!_this.doObserverCheck("file", filePath, 2, msg)) {
                                return [];
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (_iteratorAbruptCompletion && _iterator.return != null) {
                            yield _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            }
            // After successful import of all files, directory completion
            // is only a notification for observer, cannot be cancelled.
            _this.doObserverCheck("directory", directoryPath, 1);
            return docs;
        })();
    }
    doObserverCheck(category, name, status, message) {
        if (this.observer) {
            return this.observer(category, name, status, message);
        }
        return true;
    }
    constructor(observer){
        this.observer = observer;
    }
}

// exports.FILE_EXT_TO_READER = FILE_EXT_TO_READER;
// exports.SimpleDirectoryReader = SimpleDirectoryReader;
// exports.TextFileReader = TextFileReader;
// Replace or adjust the exports as needed for your module system
export { FILE_EXT_TO_READER, SimpleDirectoryReader, TextFileReader };