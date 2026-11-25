const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');
const pool = require('./db/pool');
const verificaToken = require('./middleware/verificaToken');

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

// POST /api/utenti - Salva profilo e consenso privacy dopo registrazione Firebase
app.post('/api/utenti', verificaToken, async (req, res) => {
  const { nome, cognome, consenso_privacy } = req.body;
  const { uid, email } = req.user;

  if (!nome || !cognome || !consenso_privacy) {
    return res.status(400).json({
      errore: 'Nome, cognome e consenso alla privacy sono obbligatori.',
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO utenti (firebase_uid, nome, cognome, email, consenso_privacy_il)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (firebase_uid) DO UPDATE
       SET nome = EXCLUDED.nome, cognome = EXCLUDED.cognome
       RETURNING firebase_uid, nome, cognome, email, consenso_privacy_il`,
      [uid, nome.trim(), cognome.trim(), email]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Errore salvataggio utente:', err.message);
    res.status(500).json({ errore: 'Errore interno durante il salvataggio del profilo.' });
  }
});

// GET /api/me - Restituisce il profilo e indica se l'utente ha già una casa
app.get('/api/me', verificaToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT firebase_uid, nome, cognome, email, consenso_privacy_il FROM utenti WHERE firebase_uid = $1',
      [req.user.uid]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ errore: 'Profilo utente non trovato.' });
    }

    // Nella Settimana 2 qui controlleremo la tabella membri_appartamento
    res.json({
      ...result.rows[0],
      ha_casa: false,
    });
  } catch (err) {
    console.error('Errore lettura profilo:', err.message);
    res.status(500).json({ errore: 'Errore interno del server.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server Flatly avviato su http://localhost:${PORT}`);
});