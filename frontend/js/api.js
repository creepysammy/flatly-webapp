// js/api.js - Gestione centralizzata delle chiamate al Back-End
import { auth } from "./firebase-config.js";

// Indirizzo del server: in locale con Live Server punta a localhost:3000, online usa lo stesso dominio
const BASE_URL = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost"
  ? "http://localhost:3000"
  : "";

/**
 * Funzione principale per chiamare le API del Back-End.
 * Allega automaticamente il token Firebase e gestisce gli errori di rete.
 */
export async function apiFetch(endpoint, options = {}) {
  const user = auth.currentUser;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  // Se l'utente è loggato su Firebase, prende il token e lo mette nell'header Authorization
  if (user) {
    const token = await user.getIdToken();
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Timeout di 10 secondi per evitare attese infinite se il server gratuito si sta svegliando
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    // Prova a leggere la risposta JSON del server (se presente)
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.errore || data.message || `Errore del server (${response.status})`);
    }

    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error("Il server sta impiegando troppo tempo a rispondere. Riprova tra qualche secondo.");
    }
    if (err.message === "Failed to fetch") {
      throw new Error("Server non raggiungibile. Controlla la connessione o verifica che il Back-End sia avviato.");
    }
    throw err;
  }
}

/**
 * Utility per disabilitare un bottone durante il caricamento (Regola d'Oro UX)
 */
export function setLoading(buttonElement, isLoading, loadingText = "Un attimo...") {
  if (!buttonElement) return;
  if (isLoading) {
    buttonElement.dataset.originalText = buttonElement.textContent;
    buttonElement.textContent = loadingText;
    buttonElement.disabled = true;
  } else {
    buttonElement.textContent = buttonElement.dataset.originalText || "Invia";
    buttonElement.disabled = false;
  }
}