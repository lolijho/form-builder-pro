# Guida Deploy - Form Builder Pro

Questa guida ti aiuterà a deployare Form Builder Pro su **Railway** (backend) e **Netlify** (frontend).

## Prerequisiti

- Account [Railway](https://railway.app)
- Account [Netlify](https://netlify.com)
- Repository GitHub con il codice (già creata: https://github.com/lolijho/form-builder-pro)

---

## Parte 1: Deploy Database su Railway

### 1.1 Crea un nuovo progetto Railway

1. Vai su [Railway](https://railway.app) e fai login
2. Clicca su "New Project"
3. Seleziona "Deploy MySQL"
4. Attendi che il database venga creato

### 1.2 Ottieni la stringa di connessione

1. Clicca sul servizio MySQL appena creato
2. Vai alla tab "Variables"
3. Copia il valore di `DATABASE_URL` (formato: `mysql://user:password@host:port/database`)
4. **Salva questa stringa**, ti servirà per il backend

---

## Parte 2: Deploy Backend su Railway

### 2.1 Aggiungi il servizio backend

1. Nel tuo progetto Railway, clicca su "New Service"
2. Seleziona "GitHub Repo"
3. Autorizza Railway ad accedere ai tuoi repository
4. Seleziona `lolijho/form-builder-pro`

### 2.2 Configura le variabili d'ambiente

Vai alla tab "Variables" del servizio backend e aggiungi:

**Obbligatorie:**
```
DATABASE_URL=<copia dal servizio MySQL>
JWT_SECRET=<genera con: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))">
NODE_ENV=production
PORT=3000
```

**Opzionali (se usi autenticazione Manus):**
```
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://api.manus.im
OWNER_OPEN_ID=your-owner-id
OWNER_NAME=Your Name
```

**Opzionali (per notifiche email):**
```
BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=your-api-key
```

### 2.3 Configura il build

Railway dovrebbe rilevare automaticamente la configurazione da `railway.json`. Il comando di build include:
- Build del client (`pnpm build:client`)
- Copia dei file statici in `dist/public`
- Build del server (`pnpm build:server`)

Se Railway non legge automaticamente il `railway.json`, configura manualmente:
- **Build Command:** `pnpm install && pnpm build:client && mkdir -p dist && cp -r client/dist dist/public && pnpm build:server`
- **Start Command:** `node dist/server.js`

### 2.4 Ottieni l'URL del backend

1. Vai alla tab "Settings" del servizio backend
2. Scorri fino a "Networking"
3. Clicca su "Generate Domain"
4. **Salva l'URL** (es: `https://your-app.up.railway.app`)

### 2.5 Esegui le migrazioni database

1. Vai alla tab "Deployments" del servizio backend
2. Clicca sui tre puntini dell'ultimo deployment → "View Logs"
3. Verifica che non ci siano errori
4. Apri una shell Railway:
   ```bash
   railway run pnpm db:push
   ```

---

## Parte 3: Deploy Frontend su Netlify

### 3.1 Connetti il repository

1. Vai su [Netlify](https://netlify.com) e fai login
2. Clicca su "Add new site" → "Import an existing project"
3. Seleziona "GitHub" e autorizza Netlify
4. Seleziona il repository `lolijho/form-builder-pro`

### 3.2 Configura il build

Netlify dovrebbe rilevare automaticamente la configurazione da `netlify.toml`. Verifica:

- **Build command:** `pnpm install && pnpm build:client`
- **Publish directory:** `client/dist`
- **Node version:** 22

### 3.3 Configura le variabili d'ambiente

Vai su "Site settings" → "Environment variables" e aggiungi:

**Obbligatorie:**
```
VITE_API_URL=<URL backend Railway, es: https://your-app.up.railway.app>
```

**Opzionali (se usi autenticazione Manus):**
```
VITE_APP_ID=your-app-id
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
VITE_APP_TITLE=Form Builder Pro
VITE_APP_LOGO=/logo.svg
```

**Opzionali (per servizi Manus frontend):**
```
VITE_FRONTEND_FORGE_API_KEY=your-frontend-key
VITE_FRONTEND_FORGE_API_URL=https://forge.manus.im
```

### 3.4 Deploy

1. Clicca su "Deploy site"
2. Attendi il completamento del build
3. **Salva l'URL** del sito (es: `https://your-app.netlify.app`)

---

## Parte 4: Configurazione CORS

### 4.1 Aggiorna le variabili Railway

Torna su Railway e aggiungi al backend:

```
FRONTEND_URL=<URL Netlify, es: https://your-app.netlify.app>
```

### 4.2 Aggiorna le variabili Netlify

Torna su Netlify e verifica che `VITE_API_URL` punti all'URL Railway corretto.

### 4.3 Rideploy

1. **Railway:** Il servizio si riavvierà automaticamente
2. **Netlify:** Vai su "Deploys" → "Trigger deploy" → "Deploy site"

---

## Parte 5: Verifica

### 5.1 Test backend

Visita: `https://your-app.up.railway.app/api/health`

Dovresti vedere una risposta JSON di successo.

### 5.2 Test frontend

1. Visita: `https://your-app.netlify.app`
2. Verifica che la landing page si carichi correttamente
3. Prova a creare un account e un form
4. Verifica che i dati vengano salvati nel database

---

## Troubleshooting

### Errore "Database connection failed"

- Verifica che `DATABASE_URL` sia corretto su Railway
- Controlla che il servizio MySQL sia in running
- Verifica i log del backend per dettagli

### Errore "CORS policy"

- Verifica che `FRONTEND_URL` su Railway corrisponda all'URL Netlify
- Verifica che `VITE_API_URL` su Netlify corrisponda all'URL Railway
- Rideploy entrambi i servizi dopo le modifiche

### Build fallito su Netlify

- Verifica che Node version sia 22
- Controlla i log di build per errori specifici
- Verifica che tutte le variabili `VITE_*` siano configurate

### Form non si salvano

- Verifica che le migrazioni database siano state eseguite
- Controlla i log Railway per errori SQL
- Verifica che `JWT_SECRET` sia configurato

---

## Comandi Utili

### Railway CLI

```bash
# Installare Railway CLI
npm install -g @railway/cli

# Login
railway login

# Collegare al progetto
railway link

# Vedere i log
railway logs

# Eseguire comandi
railway run pnpm db:push
```

### Netlify CLI

```bash
# Installare Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Collegare al sito
netlify link

# Deploy manuale
netlify deploy --prod
```

---

## Costi Stimati

- **Railway MySQL:** ~$5/mese
- **Railway Backend:** ~$5/mese (dipende dall'uso)
- **Netlify:** Gratuito (fino a 100GB bandwidth/mese)

**Totale stimato:** ~$10/mese

---

## Supporto

Per problemi o domande:
- Documentazione Railway: https://docs.railway.app
- Documentazione Netlify: https://docs.netlify.com
- Repository GitHub: https://github.com/lolijho/form-builder-pro

---

**Congratulazioni! 🎉** Il tuo Form Builder Pro è ora online e pronto per essere utilizzato!
