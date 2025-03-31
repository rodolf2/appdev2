const http = require("http");

const server = http.createServer((req, res) => {
  if (req.url === "/greet") {
    res.writeHead(200, { "content-type": "plain/text" });
    res.end("Hello, welcome to Node.js!");
  } else {
    res.writeHead(404, { "content-type": "plain/text" });
    res.end("Page not found!");
  }
});

const port = 3000;
const hostname = "localhost";
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
