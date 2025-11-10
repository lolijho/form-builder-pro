# Notifiche Email - Documentazione

## Panoramica

Il sistema di notifiche email invia automaticamente un'email al proprietario del form ogni volta che viene ricevuta una nuova submission. Questa funzionalità permette di rimanere sempre aggiornato sulle risposte ricevute senza dover controllare manualmente la dashboard.

## Come Funziona

### Attivazione/Disattivazione

Le notifiche email possono essere attivate o disattivate per ogni singolo form:

1. **Accedi all'editor del form** dalla dashboard
2. **Trova il toggle "Notifiche Email"** nella barra superiore (accanto a "Pubblicato")
3. **Attiva o disattiva** il toggle secondo le tue preferenze
4. Le modifiche vengono salvate automaticamente

### Comportamento Predefinito

- **Nuovi form**: Le notifiche email sono **attivate per default**
- **Form esistenti**: Mantengono la loro impostazione corrente

## Contenuto della Notifica

Quando viene ricevuta una nuova submission, riceverai un'email contenente:

### Oggetto
```
Nuova submission: [Titolo del Form]
```

### Corpo del Messaggio
```
Hai ricevuto una nuova risposta al form "[Titolo del Form]".

**Campo 1:** Valore risposta 1

**Campo 2:** Valore risposta 2

**Campo 3:** Valore risposta 3

---

Visualizza tutte le risposte nella dashboard.
```

### Dettagli Inclusi

- **Titolo del form**: Per identificare rapidamente quale form ha ricevuto la submission
- **Tutti i campi compilati**: Ogni campo visibile con la relativa risposta
- **Formattazione markdown**: I nomi dei campi sono in grassetto per maggiore leggibilità
- **Valori multipli**: Per checkbox e campi multi-valore, i valori sono separati da virgole

### Campi Esclusi

- Campi vuoti o non compilati
- Campi nascosti dalla logica condizionale al momento dell'invio
- Campi che non erano visibili durante la compilazione

## Casi d'Uso

### 1. Form di Contatto
Ricevi immediatamente un'email quando un cliente ti contatta, permettendoti di rispondere rapidamente.

### 2. Sondaggi
Monitora in tempo reale le risposte ai tuoi sondaggi senza dover accedere alla dashboard.

### 3. Registrazioni Eventi
Ricevi conferma immediata quando qualcuno si registra al tuo evento.

### 4. Lead Generation
Ottieni notifiche istantanee quando un potenziale cliente compila il form, permettendoti di contattarlo rapidamente.

### 5. Feedback Clienti
Rimani aggiornato sui feedback dei clienti per poter intervenire tempestivamente.

## Gestione delle Notifiche

### Quando Attivare

✅ **Attiva le notifiche per:**
- Form di contatto urgenti
- Form con poche submission attese
- Form dove la tempestività di risposta è importante
- Form di lead generation
- Form di supporto clienti

### Quando Disattivare

❌ **Disattiva le notifiche per:**
- Form con alto volume di submission
- Sondaggi con centinaia di risposte attese
- Form di test o demo
- Form dove le risposte non richiedono azione immediata
- Form stagionali non più attivi

### Gestione Volume

Se ricevi troppe notifiche:
1. Disattiva le notifiche per i form meno prioritari
2. Controlla periodicamente la dashboard per i form senza notifiche
3. Considera di creare form separati per diverse priorità

## Affidabilità

### Garanzie

- ✅ Le submission vengono **sempre salvate** nel database, anche se l'invio dell'email fallisce
- ✅ Il fallimento dell'invio email **non blocca** la submission dell'utente
- ✅ Gli errori di notifica vengono **loggati** per il debug
- ✅ Il sistema riprova automaticamente in caso di errori temporanei

### Cosa Succede in Caso di Errore

Se l'invio dell'email fallisce:
1. La submission viene comunque salvata correttamente
2. L'utente riceve conferma di invio riuscito
3. L'errore viene registrato nei log del server
4. Puoi comunque visualizzare la submission nella dashboard

## Configurazione Tecnica

### Database

Il campo `emailNotifications` nella tabella `forms`:
- **Tipo**: INTEGER
- **Valori**: 0 (disattivato) o 1 (attivato)
- **Default**: 1 (attivato)

### API

#### Creazione Form
```typescript
// Le notifiche sono attivate per default
await createForm({
  title: "Nuovo Form",
  emailNotifications: 1, // Attivato
  // ... altri campi
});
```

#### Aggiornamento Notifiche
```typescript
// Cambia lo stato delle notifiche
await updateForm({
  id: formId,
  emailNotifications: 0, // Disattivato
});
```

### Flusso di Invio

1. **Utente invia form** → API `public.submit`
2. **Verifica form pubblicato** → Controllo `published === 1`
3. **Salva submission** → Database insert
4. **Controlla notifiche** → Verifica `emailNotifications === 1`
5. **Formatta dati** → Crea messaggio email
6. **Invia notifica** → Chiama `notifyOwner()`
7. **Gestisce errori** → Log errori senza bloccare submission

## Sistema di Notifiche Manus

Le notifiche email utilizzano il sistema integrato di Manus:

### Funzione `notifyOwner`

```typescript
import { notifyOwner } from "./_core/notification";

await notifyOwner({
  title: "Titolo della notifica",
  content: "Contenuto della notifica (supporta markdown)",
});
```

### Caratteristiche

- ✅ **Nessuna configurazione richiesta**: Credenziali gestite automaticamente
- ✅ **Affidabile**: Sistema gestito dalla piattaforma Manus
- ✅ **Markdown support**: Formattazione ricca del contenuto
- ✅ **Destinatario automatico**: Inviato al proprietario del progetto
- ✅ **Rate limiting**: Protezione contro spam

## Privacy e Sicurezza

### Dati Inclusi

- ✅ Solo i dati del form compilato
- ✅ Titolo del form
- ✅ Timestamp implicito (dalla ricezione email)

### Dati NON Inclusi

- ❌ Indirizzo IP del mittente
- ❌ User agent del browser
- ❌ Dati personali non inseriti nel form
- ❌ Cookie o tracking information

### Conformità GDPR

- Le notifiche contengono solo dati forniti volontariamente dall'utente
- L'email viene inviata al proprietario del form (data controller)
- Nessun dato viene condiviso con terze parti
- Gli utenti sono informati dell'invio tramite la privacy policy del form

## Troubleshooting

### Non Ricevo Notifiche

**Verifica:**
1. ✅ Il toggle "Notifiche Email" è attivato nell'editor
2. ✅ Il form è pubblicato (`published === 1`)
3. ✅ Hai effettivamente ricevuto una submission (controlla la dashboard)
4. ✅ Controlla la cartella spam della tua email
5. ✅ Verifica che l'email del proprietario sia configurata correttamente

**Soluzioni:**
- Disattiva e riattiva il toggle delle notifiche
- Verifica i log del server per errori
- Prova a inviare una submission di test

### Ricevo Troppe Notifiche

**Soluzioni:**
1. Disattiva le notifiche per i form meno prioritari
2. Crea filtri email per organizzare le notifiche
3. Considera di implementare un digest giornaliero (feature futura)

### Le Notifiche Sono Incomplete

**Possibili Cause:**
- Campi nascosti dalla logica condizionale non vengono inclusi
- Campi vuoti vengono omessi per brevità
- Lunghezza massima del messaggio raggiunta (raro)

**Soluzioni:**
- Verifica i dati completi nella dashboard
- Controlla la logica condizionale del form
- Esporta i dati in CSV per analisi dettagliata

## Limitazioni Attuali

### Limitazioni Tecniche

1. **Destinatario fisso**: Le notifiche vanno solo al proprietario del form
2. **Template fisso**: Il formato dell'email non è personalizzabile
3. **Nessun digest**: Ogni submission genera una email separata
4. **Lingua fissa**: Il messaggio è in italiano

### Limitazioni Funzionali

1. **No CC/BCC**: Non è possibile inviare copie ad altri destinatari
2. **No personalizzazione**: Template email non modificabile
3. **No filtri**: Tutte le submission generano notifiche (se attivate)
4. **No scheduling**: Le notifiche sono immediate, non programmabili

## Estensioni Future Possibili

### Funzionalità Avanzate

1. **Email personalizzate**: Template email configurabili per ogni form
2. **Destinatari multipli**: CC/BCC per team o dipartimenti
3. **Digest giornaliero**: Riepilogo giornaliero invece di email immediate
4. **Filtri condizionali**: Invia notifiche solo se certe condizioni sono soddisfatte
5. **Integrazione webhook**: Notifiche a sistemi esterni (Slack, Discord, etc.)
6. **Notifiche SMS**: Opzione per ricevere SMS oltre alle email
7. **Priorità**: Notifiche urgenti vs normali
8. **Auto-responder**: Email automatica di conferma all'utente

### Miglioramenti UX

1. **Preview email**: Anteprima del messaggio nell'editor
2. **Test notifica**: Pulsante per inviare email di test
3. **Statistiche**: Quante notifiche inviate, tasso di apertura
4. **Gestione centralizzata**: Pannello per gestire notifiche di tutti i form

## Best Practices

### Configurazione Ottimale

1. **Attiva per form critici**: Contatti, lead, supporto
2. **Disattiva per alto volume**: Sondaggi, newsletter signup
3. **Testa sempre**: Invia submission di test dopo configurazione
4. **Monitora regolarmente**: Controlla che le notifiche arrivino

### Gestione Email

1. **Crea filtri**: Organizza le notifiche in cartelle separate
2. **Usa regole**: Automatizza azioni su notifiche specifiche
3. **Backup dashboard**: Non fare affidamento solo sulle email
4. **Archivia**: Mantieni storico delle notifiche importanti

### Performance

1. **Non abusare**: Troppi form con notifiche possono sovraccaricare la inbox
2. **Disattiva quando non necessario**: Form stagionali o inattivi
3. **Monitora volume**: Se ricevi >50 email/giorno, considera alternative
4. **Usa dashboard**: Per analisi aggregate preferisci la dashboard

## Supporto

Per problemi con le notifiche email:
1. Verifica questa documentazione
2. Controlla i log del server
3. Testa con submission di prova
4. Contatta il supporto Manus se il problema persiste

---

**Nota**: Le notifiche email sono una funzionalità di supporto. I dati completi e definitivi sono sempre disponibili nella dashboard, anche se le notifiche falliscono.
