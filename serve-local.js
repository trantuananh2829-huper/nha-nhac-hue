// Static file server cho bản local của trang nhã nhạc.
// Dùng: node serve-local.js [thư-mục-gốc]   (mặc định: thư mục chứa file này)
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(process.argv[2] || __dirname);
const envPort = Number(process.env.PORT);
const port = Number.isInteger(envPort) && envPort > 0 ? envPort : 3001;
const host = '127.0.0.1';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.mp3': 'audio/mpeg'
};

http.createServer((req, res) => {
  let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  if (urlPath.endsWith('/')) urlPath += 'index.html';

  const filePath = path.join(root, path.normalize(urlPath));
  if (!filePath.startsWith(root)) {
    res.writeHead(403).end('forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('not found');
      return;
    }
    res.writeHead(200, {
      'content-type': TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'cache-control': 'no-store'
    });
    res.end(data);
  });
}).listen(port, host, () => {
  console.log(`serving ${root} -> http://${host}:${port}`);
});
