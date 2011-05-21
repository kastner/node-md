#!/usr/bin/env node

var sys      = require("sys")
  , io       = require("socket.io")
  , exec     = require("child_process").exec
  , fs       = require("fs")
  , http     = require("http")
  , os       = require("os")

var httpPort = 5411;
var socket;
var output;

function parse () {
  console.log("parsing: " + process.argv[2]);
  exec('upskirt ' + process.argv[2], function (error, stdout, stderr) {
    output = stdout;
    if (socket) { socket.broadcast(stdout); }
  });
}

fs.watchFile(process.argv[2], function (curr, prev) {
  parse();
});

var server = http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  //res.end(fs.readFileSync("index.html").replace(/{{file}}/, process.argv[2]));
  res.end(fs.readFileSync("index.html"));
});

server.listen(httpPort);

socket = io.listen(server);

socket.on("connection", function (client) {
  console.log("sending " + output);
  client.send(output);
});

console.log("Server listening on http://" + os.hostname() + ":5411");
parse();
