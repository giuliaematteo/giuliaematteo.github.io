# 💍 Sito Matrimonio Giulia & Matteo — Guida rapida

Sito statico (HTML/CSS/JS), zero dipendenze, completamente responsive (mobile + desktop).
**Costo totale: 0 €.**

---

## 📁 Contenuto della cartella

```
sito/
├── index.html      ← pagina principale
├── style.css       ← grafica e responsive
├── script.js       ← countdown, galleria lightbox, form, menu mobile
├── README.md       ← questo file (guida)
└── images/
    ├── foto-01.jpg … foto-30.jpg   ← le 30 foto della coppia
```

---

## ✏️ 1. Personalizza i contenuti (PRIMA di pubblicare)

Apri **`index.html`** con un editor di testo (anche Blocco note va bene, meglio VS Code) e modifica:

### a) Coordinate bancarie (IBAN)
Cerca `IT00 X000 0000 0000 0000 0000 000` e sostituisci con l'IBAN vero.
Sostituisci anche `Nome della banca`.

### b) Eventuali ritocchi al testo
- Storia della coppia (sezione `id="storia"`)
- Orari del programma (sezione `id="programma"`)
- Indirizzi delle location (se servono dettagli più precisi)

### c) Rimuovi la nota "Sostituite i dati..."
In fondo alla sezione regalo c'è una nota tra parentesi che ricorda di sostituire l'IBAN: una volta inserito quello vero, **cancella quella riga** (il `<p class="gift-note">…</p>`).

> ✅ Cognomi (Adami / La Cognata), data e orari sono già configurati.

---

## 📬 2. Attiva il form RSVP con Formspree (gratis)

Il form di conferma usa **Formspree**: gratuito fino a 50 invii al mese (più che sufficiente per un matrimonio).

1. Vai su **https://formspree.io** e crea un account gratuito (basta un'email).
2. Clicca **"New Form"**, dagli un nome (es. "RSVP Matrimonio").
3. Inserisci come email destinataria quella su cui vuoi ricevere le conferme.
4. Copia il **form ID** che Formspree ti dà (qualcosa tipo `xayzabcd`).
5. Apri `index.html`, cerca questa riga:
   ```html
   action="https://formspree.io/f/YOUR_FORM_ID"
   ```
   e sostituisci `YOUR_FORM_ID` con l'ID copiato.

Fatto! Ogni RSVP arriverà via email + sarà visibile nella dashboard Formspree.

---

## 🚀 3. Pubblicazione su GitHub Pages (gratis, dominio incluso)

### A) Crea l'account GitHub (se non ce l'hai)
1. Vai su **https://github.com** → "Sign up".
2. Scegli uno **username** elegante (es. `giuliaematteo`): diventerà parte dell'URL del sito.

### B) Crea il repository
1. In alto a destra clicca **+ → New repository**.
2. **Nome del repo**: per avere un URL pulito, chiamalo esattamente come il tuo username seguito da `.github.io`.
   Es. se il tuo username è `giuliaematteo`, il repo si chiamerà `giuliaematteo.github.io`.
   In questo modo il sito sarà a **`https://giuliaematteo.github.io`** (senza sottocartelle).
3. Spunta **"Public"**.
4. Clicca **"Create repository"**.

### C) Carica i file
Nella pagina del repo appena creato:
1. Clicca **"uploading an existing file"** (in alto, nel testo).
2. Trascina dentro **tutto il contenuto della cartella `sito/`**:
   - `index.html`
   - `style.css`
   - `script.js`
   - la cartella `images/` (con tutte le foto)
3. Scorri in basso e clicca **"Commit changes"**.

### D) Attiva GitHub Pages
1. Sempre nel repo, vai su **"Settings"** (in alto a destra).
2. Nel menu di sinistra clicca **"Pages"**.
3. Sotto "Build and deployment" → **Source** scegli **"Deploy from a branch"**.
4. Imposta **Branch: `main`** e cartella **`/ (root)`**, poi **Save**.
5. Aspetta 1-2 minuti: in cima alla pagina apparirà il link del sito (`https://tuousername.github.io`).

**Il sito è online!** Da questo momento ogni modifica caricata su GitHub si aggiornerà automaticamente.

---

## 🌐 4. (Opzionale) Dominio personalizzato

Se vuoi un indirizzo più carino tipo **`giuliaematteo.it`** (~10 €/anno):

1. Compra il dominio su un registrar a basso costo (es. **Namecheap**, **Porkbun**, **Aruba**, **OVH**).
2. Sul registrar, configura i record DNS verso GitHub Pages:
   - **A record** → punta a:
     - `185.199.108.153`
     - `185.199.109.153`
     - `185.199.110.153`
     - `185.199.111.153`
   - **CNAME** record per `www` → `tuousername.github.io`
3. Su GitHub: Settings → Pages → Custom domain → inserisci `giuliaematteo.it`.
4. Spunta **"Enforce HTTPS"** (gratuito).

---

## 🛠️ 5. Aggiornare il sito dopo la pubblicazione

Per modificare testi, foto o orari:
1. Sul repo GitHub, clicca sul file che vuoi cambiare.
2. Clicca l'icona della **matita** (Edit), modifica, poi **Commit changes**.
3. Il sito si aggiorna in 1-2 minuti.

Per aggiungere foto, vai nella cartella `images/` del repo, **Add file → Upload files** e carica le nuove immagini. Poi modifica `index.html` per aggiungere il riferimento (basta copiare e adattare una delle righe `<a href="images/foto-XX.jpg" class="gallery-item">...`).

---

## 📱 6. Anteprima in locale (prima di pubblicare)

Puoi vedere il sito **subito** sul tuo computer:

**Modo facile**: doppio click su `index.html` → si apre nel browser.

**Modo migliore** (se vuoi che il form funzioni davvero):
```bash
cd sito
python3 -m http.server 8000
```
Poi apri **http://localhost:8000** nel browser.

---

## ❓ FAQ rapide

**Le foto sono pesanti?** No: tutte e 30 pesano insieme ~4,5 MB, ottime per il web.

**Il sito funziona da telefono?** Sì, è completamente responsive (menu hamburger, galleria a 2 colonne, ecc.).

**Posso cambiare i colori?** Sì: apri `style.css`, in cima trovi un blocco `:root { --col-terracotta: ...; }`. Cambia quei valori HEX per cambiare la palette ovunque.

**Posso togliere il countdown?** Sì: cancella il blocco `<div class="countdown">…</div>` da `index.html`.

**Come funziona il "Save the date"?** Il pulsante apre un piccolo popup con due opzioni: "Google Calendar" (apre direttamente nell'app/web) e "Apple/Outlook (.ics)" (scarica un file `.ics` che gli ospiti possono aprire sul proprio dispositivo per aggiungere l'evento al calendario nativo). Il file è generato al volo dal JS — niente da configurare.

**E se servono modifiche più complesse?** Riapri questa conversazione e chiedi pure!

---

Buon matrimonio! 🎉
