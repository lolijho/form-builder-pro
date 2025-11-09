# Form Builder Pro

Un'applicazione web completa per creare form personalizzabili con editor drag and drop, integrabile in qualsiasi sito tramite iframe o script embed.

## 🚀 Funzionalità Principali

### Editor Drag & Drop
- **Interfaccia intuitiva**: Crea form complessi senza scrivere codice
- **9 tipi di campo**: text, email, number, textarea, select, checkbox, radio, date, file
- **Riordino facile**: Trascina e rilascia i campi per riorganizzarli
- **Pannello proprietà**: Configura ogni campo con validazioni e opzioni personalizzate

### Personalizzazione Grafica Completa
- **Color picker**: Scegli colori personalizzati per sfondo, testo e elementi primari
- **Font personalizzati**: Seleziona tra diversi font per il tuo form
- **Layout flessibile**: Controlla spaziatura, bordi e posizione delle etichette
- **Stili pulsanti**: Scegli tra solid, outline e ghost

### Sistema di Embed
- **URL diretto**: Ogni form ha un URL pubblico dedicato
- **iFrame**: Codice pronto per l'integrazione tramite iframe
- **Script Embed**: JavaScript snippet per integrazione dinamica
- **Responsive**: I form si adattano automaticamente a qualsiasi dispositivo

### Gestione Risposte
- **Visualizzazione completa**: Vedi tutte le submission ricevute
- **Export CSV**: Esporta i dati in formato CSV per analisi
- **Gestione dati**: Elimina submission non necessarie
- **Timestamp**: Ogni submission include data e ora di invio

## 📋 Struttura del Progetto

```
form-builder/
├── client/                  # Frontend React
│   ├── src/
│   │   ├── components/     # Componenti riutilizzabili
│   │   │   ├── DraggableField.tsx
│   │   │   ├── FieldRenderer.tsx
│   │   │   ├── FieldTypeSelector.tsx
│   │   │   ├── FieldPropertiesPanel.tsx
│   │   │   ├── FormEditor.tsx
│   │   │   ├── FormPreview.tsx
│   │   │   ├── StyleCustomizer.tsx
│   │   │   └── EmbedCodeGenerator.tsx
│   │   ├── pages/          # Pagine dell'applicazione
│   │   │   ├── Home.tsx           # Landing page
│   │   │   ├── Dashboard.tsx      # Lista form
│   │   │   ├── Editor.tsx         # Editor form
│   │   │   ├── Submissions.tsx    # Visualizza risposte
│   │   │   └── PublicForm.tsx     # Form pubblico
│   │   └── App.tsx         # Router principale
├── server/                  # Backend Express + tRPC
│   ├── routers.ts          # API endpoints
│   └── db.ts               # Query database
├── drizzle/                # Schema database
│   └── schema.ts           # Tabelle forms e submissions
└── shared/                 # Tipi condivisi
    └── formTypes.ts        # TypeScript types
```

## 🗄️ Schema Database

### Tabella `forms`
- `id`: ID univoco del form
- `userId`: ID dell'utente proprietario
- `title`: Titolo del form
- `description`: Descrizione opzionale
- `fields`: JSON con definizione campi
- `styles`: JSON con personalizzazione stili
- `published`: Stato pubblicazione (0=bozza, 1=pubblicato)
- `createdAt`, `updatedAt`: Timestamp

### Tabella `submissions`
- `id`: ID univoco della submission
- `formId`: Riferimento al form
- `data`: JSON con dati inviati
- `ipAddress`: IP del mittente
- `userAgent`: Browser del mittente
- `submittedAt`: Timestamp invio

## 🔧 API tRPC

### Forms
- `forms.list`: Lista tutti i form dell'utente
- `forms.getById`: Ottieni un form specifico
- `forms.create`: Crea nuovo form
- `forms.update`: Aggiorna form esistente
- `forms.delete`: Elimina form e relative submission
- `forms.publish`: Pubblica/non pubblica form

### Submissions
- `submissions.list`: Lista submission di un form
- `submissions.getById`: Ottieni submission specifica
- `submissions.delete`: Elimina submission

### Public API
- `public.getForm`: Ottieni form pubblico (solo se pubblicato)
- `public.submit`: Invia dati al form (no autenticazione)

## 🎨 Tipi di Campo Supportati

1. **Text**: Campo testo semplice
2. **Email**: Campo email con validazione
3. **Number**: Campo numerico
4. **Textarea**: Area di testo multiriga
5. **Select**: Menu a tendina
6. **Checkbox**: Caselle di selezione multipla
7. **Radio**: Selezione singola
8. **Date**: Selettore data
9. **File**: Upload file

## 🔐 Autenticazione

L'applicazione utilizza Manus OAuth per l'autenticazione:
- Login automatico tramite OAuth
- Sessioni persistenti
- Ogni form è associato all'utente che lo crea
- Solo il proprietario può modificare/eliminare i propri form

## 🌐 Integrazione nei Siti Web

### Metodo 1: iFrame
```html
<iframe 
  src="https://your-domain.com/form/123" 
  width="100%" 
  height="600" 
  frameborder="0">
</iframe>
```

### Metodo 2: Script Embed
```html
<div id="form-builder-123"></div>
<script>
  (function() {
    var iframe = document.createElement('iframe');
    iframe.src = 'https://your-domain.com/form/123';
    iframe.width = '100%';
    iframe.height = '600px';
    iframe.frameBorder = '0';
    document.getElementById('form-builder-123').appendChild(iframe);
  })();
</script>
```

## 📦 Dipendenze Principali

- **Frontend**: React 19, Tailwind CSS 4, shadcn/ui
- **Backend**: Express, tRPC 11, Drizzle ORM
- **Drag & Drop**: @dnd-kit/core, @dnd-kit/sortable
- **Color Picker**: react-colorful
- **Database**: MySQL/TiDB

## 🚀 Comandi Disponibili

```bash
# Sviluppo
pnpm dev

# Build produzione
pnpm build

# Aggiorna schema database
pnpm db:push

# Type checking
pnpm tsc --noEmit
```

## 📝 Note Tecniche

- I campi del form sono serializzati in JSON nel database
- Gli stili sono memorizzati come JSON per massima flessibilità
- Le submission sono completamente anonime (solo IP e user agent)
- I form non pubblicati non sono accessibili pubblicamente
- L'export CSV gestisce correttamente caratteri speciali e virgolette

## 🎯 Casi d'Uso

1. **Form di contatto**: Aggiungi form di contatto personalizzati al tuo sito
2. **Sondaggi**: Crea sondaggi con domande multiple choice
3. **Registrazioni**: Form di registrazione eventi con campi personalizzati
4. **Feedback**: Raccogli feedback dai clienti
5. **Lead generation**: Form per acquisire contatti commerciali

## 🔒 Sicurezza

- Autenticazione OAuth per accesso dashboard
- Validazione input lato server
- Protezione CSRF tramite tRPC
- Solo il proprietario può accedere ai propri form
- Le API pubbliche sono limitate a lettura e submit

## 📈 Possibili Estensioni Future

- Validazione campi avanzata (regex personalizzate)
- Logica condizionale (mostra/nascondi campi)
- Notifiche email su nuove submission
- Webhook per integrazioni esterne
- Anti-spam (honeypot, captcha)
- Temi predefiniti
- Statistiche avanzate (views, conversion rate)
- Multi-pagina form
- Salvataggio bozze lato client
