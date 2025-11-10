# Funzionalità Avanzate - Form Builder Pro

Questo documento descrive le tre funzionalità avanzate implementate nel Form Builder Pro: validazione regex personalizzata, dashboard analytics, e integrazione webhook.

---

## 1. Validazione Avanzata con Regex

La validazione avanzata permette di definire regole personalizzate per i campi del form, garantendo che i dati inseriti rispettino formati specifici.

### Caratteristiche

- **15 pattern predefiniti** pronti all'uso:
  - Codice Fiscale italiano
  - Partita IVA
  - Telefono italiano (con o senza +39)
  - CAP (Codice Avviamento Postale)
  - Email
  - URL
  - IBAN italiano
  - Carta di credito
  - Data (GG/MM/AAAA)
  - Ora (HH:MM)
  - Username
  - Password forte
  - Solo lettere, solo numeri, alfanumerico

- **Pattern regex personalizzati**: Crea le tue espressioni regolari
- **Messaggi di errore personalizzati**: Definisci messaggi specifici per ogni validazione
- **Vincoli di lunghezza**: Imposta lunghezza minima e massima per campi di testo
- **Vincoli numerici**: Imposta valori minimi e massimi per campi numerici
- **Validazione client-side**: Feedback immediato durante la compilazione

### Come Usarlo

1. Nell'editor del form, seleziona un campo (text, email, number o textarea)
2. Apri il pannello proprietà sulla destra
3. Scorri fino alla sezione "Validazione Avanzata"
4. **Opzione A - Pattern Predefinito**:
   - Seleziona un pattern dal menu a tendina
   - Clicca "Applica" per applicarlo
5. **Opzione B - Pattern Personalizzato**:
   - Inserisci la tua espressione regolare nel campo "Pattern Regex Personalizzato"
   - Definisci un messaggio di errore personalizzato
6. Aggiungi vincoli di lunghezza o valore se necessario
7. Salva le modifiche

### Esempi di Utilizzo

**Esempio 1: Validare un Codice Fiscale**
```
Pattern: ^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$
Messaggio: Inserisci un codice fiscale valido (es: RSSMRA80A01H501U)
```

**Esempio 2: Validare un Numero di Telefono**
```
Pattern: ^(\+39)?\s?[0-9]{9,10}$
Messaggio: Inserisci un numero di telefono valido (es: 3331234567)
```

**Esempio 3: Validare un Indirizzo Email Aziendale**
```
Pattern: ^[a-zA-Z0-9._%+-]+@tuaazienda\.com$
Messaggio: Utilizza solo email aziendali (@tuaazienda.com)
```

### Vantaggi

- ✅ Riduce errori di compilazione
- ✅ Migliora la qualità dei dati raccolti
- ✅ Feedback immediato all'utente
- ✅ Risparmio di tempo nella verifica manuale
- ✅ Compatibile con logica condizionale

---

## 2. Dashboard Analytics

La dashboard analytics fornisce statistiche dettagliate e visualizzazioni grafiche per monitorare le performance dei tuoi form.

### Metriche Disponibili

#### KPI Principali
- **Visualizzazioni**: Numero totale di volte che il form è stato visualizzato
- **Form Iniziati**: Utenti che hanno iniziato a compilare il form
- **Submission**: Form completati e inviati
- **Tasso di Conversione**: Percentuale di submission rispetto alle visualizzazioni

#### Metriche Avanzate
- **Tasso di Completamento**: Percentuale di form completati rispetto agli iniziati
- **Tasso di Abbandono**: Percentuale di utenti che hanno abbandonato il form
- **Engagement Rate**: Percentuale di utenti che iniziano a compilare dopo la visualizzazione

### Visualizzazioni Grafiche

1. **Andamento nel Tempo** (Line Chart)
   - Visualizzazioni e submission giornaliere
   - Filtri temporali: 7, 30, 90 giorni o tutto il periodo
   - Identifica trend e picchi di attività

2. **Funnel di Conversione** (Bar Chart)
   - Visualizza il percorso dall'arrivo alla submission
   - Identifica punti di abbandono
   - Ottimizza il form in base ai dati

### Come Accedere

1. Dalla dashboard, clicca sul pulsante "Analytics" accanto a un form
2. Oppure, dalla pagina di modifica form, clicca su "Analytics" nel menu

### Funzionalità Future

- ⏳ Export PDF dei report (in sviluppo)
- ⏳ Tempo medio di compilazione
- ⏳ Breakdown per device (desktop/mobile/tablet)
- ⏳ Analisi per singolo campo (abbandoni per campo)
- ⏳ Heatmap delle interazioni

### Vantaggi

- 📊 Comprendi il comportamento degli utenti
- 🎯 Ottimizza i form per aumentare le conversioni
- 📈 Monitora le performance nel tempo
- 💡 Prendi decisioni basate sui dati
- 🔍 Identifica problemi e colli di bottiglia

---

## 3. Integrazione Webhook

L'integrazione webhook permette di inviare automaticamente i dati delle submission a servizi esterni, abilitando automazioni avanzate e integrazioni con altri sistemi.

### Caratteristiche

- **Invio automatico**: I dati vengono inviati immediatamente dopo ogni submission
- **Formato JSON**: Dati strutturati e facili da processare
- **Gestione errori**: Gli errori webhook non bloccano la submission
- **Sicurezza**: Supporto per endpoint HTTPS
- **Flessibilità**: Integrazione con qualsiasi servizio che accetta webhook

### Payload Webhook

Quando viene inviata una submission, il webhook riceve un payload JSON con la seguente struttura:

```json
{
  "formId": 123,
  "formTitle": "Contattaci",
  "data": {
    "nome": "Mario Rossi",
    "email": "mario.rossi@example.com",
    "messaggio": "Vorrei maggiori informazioni..."
  },
  "submittedAt": "2025-01-10T14:30:00.000Z",
  "userAgent": "Mozilla/5.0..."
}
```

### Come Configurare

1. Nell'editor del form, trova il campo "Webhook URL" nella barra superiore
2. Inserisci l'URL del tuo endpoint webhook (deve iniziare con `https://`)
3. Salva il form
4. Ogni nuova submission invierà automaticamente i dati all'URL configurato

### Servizi Compatibili

Il webhook può essere integrato con qualsiasi servizio che accetta richieste HTTP POST. Alcuni esempi:

- **Zapier**: Crea automazioni complesse senza codice
- **Make (Integromat)**: Workflow automation avanzata
- **n8n**: Automazione open-source self-hosted
- **Sistemi CRM**: Salesforce, HubSpot, Pipedrive
- **Slack**: Notifiche in tempo reale sul tuo canale
- **Discord**: Notifiche per community
- **Google Sheets**: Salva automaticamente in un foglio
- **Webhook.site**: Testing e debugging webhook
- **Server personalizzato**: Il tuo backend API

### Esempi di Integrazione

#### Esempio 1: Zapier
1. Crea un nuovo Zap su Zapier
2. Seleziona "Webhooks by Zapier" come trigger
3. Scegli "Catch Hook"
4. Copia l'URL webhook fornito
5. Incollalo nel campo "Webhook URL" del form
6. Configura le azioni successive (es: invia email, salva in Google Sheets, crea task in Trello)

#### Esempio 2: Slack
1. Crea un Incoming Webhook su Slack
2. Seleziona il canale dove ricevere le notifiche
3. Copia l'URL webhook
4. Incollalo nel campo "Webhook URL" del form
5. Ogni submission invierà una notifica al canale Slack

#### Esempio 3: Server Personalizzato (Node.js)
```javascript
const express = require('express');
const app = express();

app.post('/webhook/form-submission', express.json(), (req, res) => {
  const { formId, formTitle, data, submittedAt } = req.body;
  
  console.log(`Nuova submission per ${formTitle}:`, data);
  
  // Processa i dati (salva nel database, invia email, ecc.)
  // ...
  
  res.status(200).json({ success: true });
});

app.listen(3000);
```

### Gestione Errori

- Se il webhook fallisce (timeout, errore 500, ecc.), la submission viene comunque salvata
- Gli errori webhook vengono loggati ma non bloccano l'utente
- Non c'è retry automatico (implementazione futura)

### Best Practices

1. **Usa HTTPS**: Per sicurezza, usa sempre endpoint HTTPS
2. **Valida i dati**: Sul tuo server, valida sempre i dati ricevuti
3. **Rispondi velocemente**: Il webhook attende max 30 secondi
4. **Logga gli errori**: Monitora gli errori per identificare problemi
5. **Testa prima**: Usa servizi come webhook.site per testare il payload

### Vantaggi

- 🔗 Integrazione automatica con altri sistemi
- ⚡ Automazioni in tempo reale
- 🛠️ Flessibilità totale
- 📦 Nessun codice richiesto (con Zapier/Make)
- 🔄 Sincronizzazione dati automatica

---

## Combinazione delle Funzionalità

Le tre funzionalità possono essere combinate per creare esperienze potenti:

**Scenario 1: Form di Registrazione Evento**
- Validazione regex per email aziendale e telefono
- Analytics per monitorare le iscrizioni
- Webhook per sincronizzare con il CRM e inviare email di conferma

**Scenario 2: Form di Supporto Clienti**
- Validazione per codice ordine e email
- Analytics per identificare picchi di richieste
- Webhook per creare ticket automaticamente nel sistema di ticketing

**Scenario 3: Form di Lead Generation**
- Validazione per partita IVA e telefono aziendale
- Analytics per calcolare ROI delle campagne
- Webhook per aggiungere lead a Salesforce/HubSpot

---

## Supporto e Documentazione

Per domande o problemi, consulta:
- README_PROGETTO.md per informazioni generali
- LOGICA_CONDIZIONALE.md per la logica condizionale
- NOTIFICHE_EMAIL.md per le notifiche email
- TEMI_PREDEFINITI.md per i temi predefiniti
- DUPLICAZIONE_FORM.md per la duplicazione form

---

**Form Builder Pro** - Crea form professionali con funzionalità enterprise-level
