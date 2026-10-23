// Serves the seed scripts so the app page can import them: node seed/serve.cjs
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 5055;
const ROOT = __dirname;

http
  .createServer((req, res) => {
    const file = path.join(ROOT, path.basename(new URL(req.url, "http://x").pathname));
    if (!file.endsWith(".js") || !fs.existsSync(file)) {
      res.writeHead(404);
      res.end();
      return;
    }
    res.writeHead(200, {
      "Content-Type": "text/javascript; charset=utf-8",
      "Access-Control-Allow-Origin": "http://localhost:3000",
      "Cache-Control": "no-store",
    });
    fs.createReadStream(file).pipe(res);
  })
  .listen(PORT, "127.0.0.1", () => console.log(`seed scripts on http://127.0.0.1:${PORT}`));
