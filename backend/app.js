"use strict";

let http = require('http');
let url = require('url');
let fs = require('fs');

http.createServer(function (req, res) {
    // Send the HTTP header 
    // HTTP Status: 200 : OK
    // Content Type: text/plain
    res.writeHead(200, {'Content-Type': 'json'});
    // Send the response body as "Hello World"
    res.write('Hello World!!!\n');
    res.end();
}).listen(8801);

console.log('Server is running at https://127.0.0.1:8801/');

