/**
 * server.js — Minimal static file server for Render Web Service
 * Serves the portfolio with correct MIME types and gzip compression.
 * Dagam Chandramohan Portfolio
 */

const http = require('http');
const fs   = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = process.env.PORT || 10000;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
  '.pdf':  'application/pdf',
  '.txt':  'text/plain; charset=utf-8',
  '.xml':  'application/xml; charset=utf-8',
  '.woff2':'font/woff2',
  '.woff': 'font/woff',
};

const CACHE = {
  '.html': 'no-cache',
  '.css':  'public, max-age=31536000, immutable',
  '.js':   'public, max-age=31536000, immutable',
  '.jpg':  'public, max-age=31536000, immutable',
  '.jpeg': 'public, max-age=31536000, immutable',
  '.webp': 'public, max-age=31536000, immutable',
  '.png':  'public, max-age=31536000, immutable',
  '.svg':  'public, max-age=31536000, immutable',
  '.pdf':  'public, max-age=2592000',
  '.woff2':'public, max-age=31536000, immutable',
};

// Blocked paths (security)
const BLOCKED = ['.git', 'php/config.php', '.env', 'sql/'];

function resolveFile(urlPath) {
  // Strip query string
  const cleanPath = urlPath.split('?')[0];
  let filePath = path.join(ROOT, cleanPath);

  // Block sensitive paths
  const rel = path.relative(ROOT, filePath).replace(/\\/g, '/');
  if (BLOCKED.some(b => rel.startsWith(b))) return null;

  // Default to index.html
  if (cleanPath === '/' || cleanPath === '') {
    filePath = path.join(ROOT, 'index.html');
  }

  // If no extension, try .html
  if (!path.extname(filePath)) {
    const withHtml = filePath + '.html';
    if (fs.existsSync(withHtml)) return withHtml;
  }

  return filePath;
}

const server = http.createServer((req, res) => {
  const filePath = resolveFile(req.url);

  // Security block
  if (!filePath) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    return res.end('403 Forbidden');
  }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      // 404 — serve custom 404.html
      const notFoundPath = path.join(ROOT, '404.html');
      fs.readFile(notFoundPath, (e, data) => {
        res.writeHead(404, {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache',
        });
        res.end(e ? '<h1>404 Not Found</h1>' : data);
      });
      return;
    }

    const ext  = path.extname(filePath).toLowerCase();
    const mime = MIME_TYPES[ext] || 'application/octet-stream';
    const cache= CACHE[ext]      || 'public, max-age=86400';

    const headers = {
      'Content-Type':           mime,
      'Cache-Control':          cache,
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options':        'SAMEORIGIN',
      'Referrer-Policy':        'strict-origin-when-cross-origin',
    };

    const acceptEncoding = req.headers['accept-encoding'] || '';

    // Gzip for text-based files
    const gzipTypes = ['.html', '.css', '.js', '.json', '.svg', '.xml', '.txt'];
    if (gzipTypes.includes(ext) && acceptEncoding.includes('gzip')) {
      headers['Content-Encoding'] = 'gzip';
      headers['Vary'] = 'Accept-Encoding';
      res.writeHead(200, headers);
      fs.createReadStream(filePath).pipe(zlib.createGzip()).pipe(res);
    } else {
      headers['Content-Length'] = stat.size;
      res.writeHead(200, headers);
      fs.createReadStream(filePath).pipe(res);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Portfolio server running on port ${PORT}`);
  console.log(`Open: http://localhost:${PORT}`);
});
