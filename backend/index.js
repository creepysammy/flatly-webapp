const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');
const pool = require('./db/pool');

const app = express();
const PORT = process.env.PORT || 3000;

// Parser JSON per leggere il body delle richieste
app.use(express.json());

// CORS attivo SOLO in sviluppo per Live Server (porta 5500)
if (process.env.NODE_ENV !== 'production') {
  app.use(
    cors({
      origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
    })
  );
}

// Serve i file statici del front-end
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// Rotta di verifica stato server + database
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connesso' });
  } catch (err) {
    console.error('Errore connessione DB:', err.message);
    res.status(500).json({ status: 'errore', database: 'non connesso' });
  }
});

app.listen(PORT, () => {
  console.log(`Server Flatly avviato su http://localhost:${PORT}`);
});