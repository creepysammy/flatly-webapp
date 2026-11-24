// js/auth.js — Registrazione e Login (Settimana 1, RF1.1)

import { auth } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// ---------- Utility ----------

// Traduce i codici errore di Firebase in messaggi leggibili
function messaggioErrore(codice) {
  const messaggi = {
    "auth/email-already-in-use": "Esiste già un account con questa email.",
    "auth/invalid-email": "L'email inserita non è valida.",
    "auth/weak-password": "La password deve avere almeno 6 caratteri.",
    "auth/invalid-credential": "Email o password errata.",
    "auth/user-not-found": "Email o password errata.",
    "auth/wrong-password": "Email o password errata.",
    "auth/too-many-requests": "Troppi tentativi. Riprova tra qualche minuto.",
    "auth/network-request-failed": "Errore di rete. Controlla la connessione.",
  };
  return messaggi[codice] || "Si è verificato un errore. Riprova.";
}

// Mostra l'errore nell'elemento con id="errore" (se non esiste usa alert)
function mostraErrore(testo) {
  const box = document.getElementById("errore");
  if (box) {
    box.textContent = testo;
    box.style.display = "block";
  } else {
    alert(testo);
  }
}

// ---------- REGISTRAZIONE (register.html) ----------

const formRegistrazione = document.getElementById("form-registrazione");

if (formRegistrazione) {
  formRegistrazione.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const cognome = document.getElementById("cognome").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const password2 = document.getElementById("password2").value;

    if (!nome || !cognome) {
      mostraErrore("Inserisci nome e cognome.");
      return;
    }
    if (password !== password2) {
      mostraErrore("Le password non coincidono.");
      return;
    }

    try {
      const credenziali = await createUserWithEmailAndPassword(auth, email, password);
      // Salviamo nome e cognome nel profilo utente
      await updateProfile(credenziali.user, {
        displayName: `${nome} ${cognome}`,
      });
      window.location.href = "setup-casa.html";
    } catch (error) {
      console.error(error);
      mostraErrore(messaggioErrore(error.code));
    }
  });
}

// ---------- LOGIN (index.html) ----------

const formLogin = document.getElementById("form-login");

if (formLogin) {
  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "setup-casa.html";
    } catch (error) {
      console.error(error);
      mostraErrore(messaggioErrore(error.code));
    }
  });
}