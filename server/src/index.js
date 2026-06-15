require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Security headers — must come before routes
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow client to fetch images/assets
  contentSecurityPolicy: false, // API-only server; CSP lives on the client (Vite)
}));

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '50kb' }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Mewcha server running on port ${PORT}`));
