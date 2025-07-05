const express = require('express');
const path = require('path');
const app = express();
const PORT = 3001;

// Serve static files from the current directory
app.use(express.static(__dirname));

// Serve schema files
app.get('/typed/schemas.d.ts', (req, res) => {
    res.setHeader('Content-Type', 'application/typescript');
    res.sendFile(path.join(__dirname, 'dist', 'schemas.d.ts'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Schema server running' });
});

app.listen(PORT, () => {
    console.log(`Schema server running on http://localhost:${PORT}`);
    console.log(`Schema file available at: http://localhost:${PORT}/typed/schemas.d.ts`);
});

module.exports = app; 