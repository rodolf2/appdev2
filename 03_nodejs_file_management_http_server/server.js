const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const EventEmitter = require("events");

class FileEventEmitter extends EventEmitter {}
const fileEvents = new FileEventEmitter();

fileEvents.on("fileAction", (message) => {
  console.log(message);
});

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;
  const filename = query.filename;
  const content = query.content || "no content";
  const filePath = filename ? path.join(__dirname, filename) : null;

  if (!filename && pathname !== "/") {
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end("Filename is required!");
    return;
  }

  if (pathname === "/create") {
    fs.writeFile(filePath, content, (err) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error creating file");
      } else {
        fileEvents.emit("fileAction", "File created: " + filename);
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("File " + filename + " created successfully");
      }
    });
  } else if (pathname === "/read") {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("File not found");
      } else {
        fileEvents.emit("fileAction", "File read: " + filename);
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end(filename + " says: " + data);
      }
    });
  } else if (pathname === "/update") {
    fs.appendFile(filePath, "\n" + content, (err) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Error updating file");
      } else {
        fileEvents.emit("fileAction", "File updated: " + filename);
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("File " + filename + " updated successfully");
      }
    });
  } else if (pathname === "/delete") {
    fs.unlink(filePath, (err) => {
      if (err) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("File not found");
      } else {
        fileEvents.emit("fileAction", "File deleted: " + filename);
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("File " + filename + " deleted successfully");
      }
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Route not found");
  }
});

const port = 3000;
server.listen(port, () => {
  console.log("Server running at http://localhost:" + port + "/");
});
