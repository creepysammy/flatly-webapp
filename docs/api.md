# Documentazione API – Flatly

Tutte le rotte protette richiedono l'header HTTP:
`Authorization: Bearer <FIREBASE_ID_TOKEN>`

---

## 1. Verifica stato server
Controlla che il server Express e il database PostgreSQL siano attivi.

- **Metodo e URL:** `GET /api/health`
- **Autenticazione:** No
- **Risposta `200 OK`:**
```json
{
  "status": "ok",
  "database": "connesso"
}
```
- **Errori possibili:**
  - `500 Internal Server Error`: il database non è raggiungibile.

---

## 2. Registrazione / salvataggio profilo utente
Salva nome, cognome, email e data/ora del consenso alla privacy subito dopo la registrazione su Firebase.

- **Metodo e URL:** `POST /api/utenti`
- **Autenticazione:** Sì (Token Firebase)
- **Dati in ingresso (Body JSON):**
```json
{
  "nome": "Mario",
  "cognome": "Rossi",
  "consenso_privacy": true
}
```
- **Risposta `201 Created`:**
```json
{
  "firebase_uid": "abc123xyz",
  "nome": "Mario",
  "cognome": "Rossi",
  "email": "mario.rossi@example.com",
  "consenso_privacy_il": "2026-11-25T12:00:00.000Z"
}
```
- **Errori possibili:**
  - `400 Bad Request`: mancano nome, cognome o consenso alla privacy.
  - `401 Unauthorized`: token mancante, scaduto o non valido.
  - `500 Internal Server Error`: errore interno del server.

---

## 3. Profilo utente corrente
Restituisce i dati dell'utente autenticato e indica se appartiene già a una casa.

- **Metodo e URL:** `GET /api/me`
- **Autenticazione:** Sì (Token Firebase)
- **Risposta `200 OK`:**
```json
{
  "firebase_uid": "abc123xyz",
  "nome": "Mario",
  "cognome": "Rossi",
  "email": "mario.rossi@example.com",
  "consenso_privacy_il": "2026-11-25T12:00:00.000Z",
  "ha_casa": false
}
```
- **Errori possibili:**
  - `401 Unauthorized`: token mancante, scaduto o non valido.
  - `404 Not Found`: profilo non ancora salvato in PostgreSQL.
  - `500 Internal Server Error`: errore interno del server.