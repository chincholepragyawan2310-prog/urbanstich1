const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

// Enable CORS to allow API calls to backend
app.use(cors());

// Serve static files from the current directory (frontend folder)
const frontendPath = __dirname;
const indexPath = path.join(frontendPath, 'index.html');

console.log('Frontend path:', frontendPath);
console.log('Index.html path:', indexPath);

// Serve index.html for root route
app.get('/', (req, res) => {
  console.log('Root route requested');
  res.sendFile(indexPath);
});

// Serve static files (CSS, JS, etc.)
app.use(express.static(frontendPath));

// Catch-all for SPA routing - Express 5.x compatible
app.use((req, res, next) => {
  // Skip if it's a static file request (has extension)
  if (req.path.includes('.')) {
    return next();
  }
  // Serve index.html for all other routes
  console.log('Catch-all route:', req.path);
  res.sendFile(indexPath);
});

app.listen(port, () => {
  console.log('========================================');
  console.log('  Frontend Server Running');
  console.log('========================================');
  console.log(`  Frontend: http://localhost:${port}`);
  console.log(`  Backend API: http://localhost:4000/api`);
  console.log('========================================');
  console.log('\nOpen http://localhost:3000 in your browser\n');
});

