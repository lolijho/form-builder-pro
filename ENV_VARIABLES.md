# Variabili d'Ambiente

Questo documento elenca tutte le variabili d'ambiente necessarie per il deploy del progetto.

## Database (Obbligatorio)

```
DATABASE_URL=mysql://user:password@host:3306/database_name
```

**Railway MySQL:** Questa variabile viene configurata automaticamente quando aggiungi un servizio MySQL su Railway.

## JWT Secret (Obbligatorio)

```
JWT_SECRET=your-super-secret-jwt-key-change-this
```

Genera una stringa casuale sicura per firmare i token JWT. Puoi usare:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Configurazione Server (Obbligatorio per Railway)

```
NODE_ENV=production
PORT=3000
```

## CORS Configuration (Obbligatorio per deploy separato)

```
FRONTEND_URL=https://your-app.netlify.app
BACKEND_URL=https://your-app.up.railway.app
```

Sostituisci con gli URL effettivi dopo il deploy.

## Manus OAuth (Opzionale - solo se usi autenticazione Manus)

```
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
OWNER_OPEN_ID=owner-open-id
OWNER_NAME=Owner Name
```

## App Configuration (Opzionale)

```
VITE_APP_TITLE=Form Builder Pro
VITE_APP_LOGO=/logo.svg
```

## Manus Built-in APIs (Opzionale - solo se usi servizi Manus)

```
BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=your-forge-api-key
VITE_FRONTEND_FORGE_API_KEY=your-frontend-forge-api-key
VITE_FRONTEND_FORGE_API_URL=https://forge.manus.im
```

Questi sono necessari solo se usi le funzionalità di notifica email integrate.

## Analytics (Opzionale)

```
VITE_ANALYTICS_ENDPOINT=
VITE_ANALYTICS_WEBSITE_ID=
```

Per integrare analytics personalizzati.

---

## Note Importanti

- Le variabili che iniziano con `VITE_` sono esposte al frontend e devono essere configurate su **Netlify**
- Le altre variabili sono server-side e devono essere configurate su **Railway**
- **NON committare mai file .env** con valori reali nel repository
