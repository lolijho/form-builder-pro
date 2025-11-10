# Duplicazione Form - Documentazione

## Panoramica

La funzionalità di duplicazione form permette di creare copie complete di form esistenti con un solo click. Tutti i campi, stili, logica condizionale, e impostazioni vengono preservati, permettendo di creare rapidamente varianti o versioni stagionali di form consolidati.

## Come Duplicare un Form

### Dalla Dashboard

1. **Accedi alla dashboard** dei tuoi form
2. **Trova il form** che vuoi duplicare
3. **Click sul pulsante con icona "Copia"** nella card del form
4. Il nuovo form viene creato automaticamente con il titolo "[Nome Originale] (Copia)"
5. Ricevi una notifica di conferma "Form duplicato con successo"
6. Il nuovo form appare immediatamente nella lista

### Risultato della Duplicazione

Il form duplicato include:
- ✅ **Tutti i campi** con le loro configurazioni
- ✅ **Stili personalizzati** (colori, font, layout)
- ✅ **Logica condizionale** completa
- ✅ **Impostazioni email** (notifiche attive/disattive)
- ✅ **Descrizione** del form

Il form duplicato NON include:
- ❌ **Submission esistenti** (parte da zero)
- ❌ **Stato pubblicato** (inizia come bozza)
- ❌ **Data di creazione originale** (usa la data corrente)

## Casi d'Uso

### 1. Creare Varianti di Form

**Scenario**: Hai un form di contatto e vuoi creare versioni per diversi dipartimenti

**Workflow**:
1. Duplica il form originale
2. Modifica il titolo (es: "Contatto Vendite", "Contatto Supporto")
3. Aggiungi/rimuovi campi specifici
4. Pubblica la variante

**Vantaggio**: Mantieni la struttura base e gli stili, risparmiando tempo

### 2. Form Stagionali o Eventi

**Scenario**: Hai un form per eventi che usi ogni anno

**Workflow**:
1. Duplica il form dell'anno precedente
2. Aggiorna date e informazioni specifiche
3. Mantieni la struttura e il design collaudati
4. Pubblica per il nuovo evento

**Vantaggio**: Non devi ricreare tutto da zero ogni volta

### 3. Testing e Sperimentazione

**Scenario**: Vuoi testare modifiche senza toccare il form in produzione

**Workflow**:
1. Duplica il form pubblicato
2. Sperimenta con nuovi campi o stili sulla copia
3. Testa la nuova versione
4. Se soddisfatto, sostituisci il form originale

**Vantaggio**: Sicurezza di avere sempre una copia di backup

### 4. Template Personalizzati

**Scenario**: Crei spesso form simili per clienti diversi

**Workflow**:
1. Crea un form "template" con la struttura ideale
2. Duplicalo per ogni nuovo cliente
3. Personalizza solo i dettagli specifici
4. Mantieni coerenza tra i progetti

**Vantaggio**: Standardizzazione e velocità

### 5. Versioni Multilingua

**Scenario**: Vuoi offrire lo stesso form in più lingue

**Workflow**:
1. Duplica il form originale
2. Traduci titolo, descrizione e label dei campi
3. Mantieni la stessa struttura e logica
4. Pubblica le versioni in diverse lingue

**Vantaggio**: Struttura identica, solo contenuto tradotto

### 6. A/B Testing

**Scenario**: Vuoi testare quale versione del form converte meglio

**Workflow**:
1. Duplica il form originale
2. Modifica un elemento (es: colori, ordine campi, testo)
3. Pubblica entrambe le versioni
4. Confronta le statistiche di submission

**Vantaggio**: Test controllati con variabili isolate

## Cosa Viene Duplicato

### Informazioni Base

**Titolo**
- Formato: `[Titolo Originale] (Copia)`
- Esempio: "Form di Contatto" → "Form di Contatto (Copia)"
- Modificabile immediatamente dopo la duplicazione

**Descrizione**
- Copiata identicamente dall'originale
- Modificabile nell'editor

### Campi del Form

**Tutti i campi** vengono duplicati con:
- Tipo di campo (text, email, number, etc.)
- Label e placeholder
- Validazione (required, pattern)
- Opzioni (per select, radio, checkbox)
- Ordine dei campi

**Logica condizionale** completa:
- Tutte le regole di visibilità
- Operatori e valori di confronto
- Logica AND tra condizioni multiple

### Stili e Design

**Colori**
- Background color
- Text color
- Primary color

**Tipografia**
- Font family
- Dimensioni testo

**Layout**
- Spacing tra elementi
- Border radius
- Label position
- Button style

### Impostazioni

**Notifiche Email**
- Stato attivo/disattivo viene preservato
- Se il form originale ha notifiche attive, anche la copia le avrà

**Stato Pubblicazione**
- La copia inizia sempre come **bozza** (non pubblicata)
- Devi pubblicarla manualmente quando pronta

## Modificare un Form Duplicato

Dopo la duplicazione:

1. **Trova il nuovo form** nella dashboard (sarà in cima alla lista)
2. **Click su "Modifica"** per aprire l'editor
3. **Modifica il titolo** per rimuovere "(Copia)" e dare un nome significativo
4. **Personalizza** campi, stili o impostazioni secondo necessità
5. **Salva** le modifiche
6. **Pubblica** quando pronto

## Best Practices

### Naming Convention

**Dopo la duplicazione, rinomina subito:**
- ❌ "Form di Contatto (Copia)"
- ✅ "Form di Contatto - Vendite"
- ✅ "Form di Contatto 2025"
- ✅ "Form di Contatto - Test A"

**Usa prefissi per organizzare:**
- `[DRAFT]` per bozze in lavorazione
- `[TEST]` per versioni di test
- `[2025]` per versioni annuali
- `[IT]`, `[EN]` per versioni multilingua

### Gestione Copie Multiple

**Evita accumulo di copie:**
- Elimina copie di test non più necessarie
- Mantieni solo versioni attive o template
- Usa descrizioni chiare per distinguere le versioni

**Organizza per scopo:**
- Template: "Template - [Tipo]"
- Produzione: "[Nome Cliente] - [Scopo]"
- Test: "TEST - [Cosa stai testando]"
- Archivio: "ARCHIVE - [Nome]"

### Workflow Consigliato

**Per modifiche importanti:**
1. Duplica il form in produzione
2. Lavora sulla copia
3. Testa accuratamente
4. Pubblica la nuova versione
5. Spubblica la vecchia versione
6. Elimina la vecchia dopo conferma

**Per varianti permanenti:**
1. Duplica il form base
2. Personalizza per il caso d'uso specifico
3. Mantieni entrambe le versioni pubblicate
4. Usa nomi chiari per distinguerle

## Limitazioni

### Limitazioni Tecniche

1. **No duplicazione batch**: Puoi duplicare solo un form alla volta
2. **No selezione campi**: Viene duplicato tutto, non puoi scegliere cosa copiare
3. **No merge**: Non puoi unire campi da form diversi
4. **No history**: Non c'è cronologia delle duplicazioni

### Cosa NON Viene Duplicato

**Submission**
- Le risposte del form originale non vengono copiate
- La copia parte con zero submission
- Motivo: Privacy e separazione dei dati

**Statistiche**
- Views, conversion rate, etc. partono da zero
- Ogni form ha le proprie metriche indipendenti

**URL Pubblico**
- Ogni form ha un URL unico
- La copia avrà un nuovo ID e quindi un nuovo URL

**Stato Pubblicato**
- Anche se l'originale è pubblicato, la copia è sempre bozza
- Motivo: Sicurezza, evita pubblicazioni accidentali

## Troubleshooting

### Il pulsante "Duplica" non funziona

**Possibili cause:**
- Problema di connessione temporaneo
- Form in fase di elaborazione

**Soluzioni:**
- Ricarica la pagina
- Attendi qualche secondo e riprova
- Verifica la connessione internet

### Non trovo il form duplicato

**Possibili cause:**
- La duplicazione è ancora in corso
- Il form è in fondo alla lista

**Soluzioni:**
- Ricarica la dashboard
- Cerca il form con "(Copia)" nel titolo
- Ordina per data di creazione (più recenti prima)

### Il form duplicato è incompleto

**Verifica:**
- Tutti i campi sono presenti?
- Gli stili sono applicati?
- La logica condizionale funziona?

**Se manca qualcosa:**
- Controlla il form originale per confermare che aveva quei dati
- Prova a duplicare nuovamente
- Contatta il supporto se il problema persiste

### Errore durante la duplicazione

**Messaggio**: "Errore: Form not found"
- Il form originale potrebbe essere stato eliminato
- Ricarica la dashboard e riprova

**Messaggio**: "Errore: Access denied"
- Non hai i permessi per duplicare quel form
- Verifica di essere il proprietario

## Performance

### Velocità di Duplicazione

**Form semplici** (1-5 campi)
- Duplicazione istantanea (< 1 secondo)

**Form medi** (6-15 campi)
- Duplicazione rapida (1-2 secondi)

**Form complessi** (16+ campi con logica condizionale)
- Duplicazione veloce (2-3 secondi)

### Limiti di Scala

**Non ci sono limiti** al numero di:
- Form che puoi duplicare
- Volte che puoi duplicare lo stesso form
- Campi nel form duplicato

## Sicurezza e Privacy

### Permessi

**Solo il proprietario** può duplicare un form:
- Non puoi duplicare form di altri utenti
- Anche se hai accesso in lettura

**Ownership**
- Il form duplicato appartiene a te
- Hai pieno controllo sulla copia

### Dati Sensibili

**Submission non vengono copiate**:
- Protezione della privacy degli utenti
- Conformità GDPR
- Separazione dei dati

**Configurazioni sicure**:
- Le notifiche email vanno sempre al proprietario
- Non c'è rischio di inviare dati al proprietario originale

## Integrazione con Altre Funzionalità

### Temi Predefiniti

Dopo la duplicazione:
- Puoi applicare un nuovo tema alla copia
- Gli stili del form originale vengono preservati
- Applica temi per creare varianti visive rapidamente

### Logica Condizionale

La logica condizionale viene duplicata completamente:
- Tutte le regole vengono copiate
- I riferimenti ai campi vengono mantenuti
- Funziona immediatamente senza configurazione

### Notifiche Email

Le impostazioni email vengono duplicate:
- Se l'originale ha notifiche attive, anche la copia
- Puoi modificare questa impostazione dopo la duplicazione
- Le notifiche vanno sempre al proprietario del form

### Embed e Integrazione

Ogni form duplicato ha:
- Nuovo URL pubblico
- Nuovo codice embed
- Nuovo iframe code
- Devi aggiornare le integrazioni esistenti

## Roadmap Future

### Funzionalità Pianificate

1. **Duplicazione batch**: Duplica più form contemporaneamente
2. **Duplicazione selettiva**: Scegli quali campi copiare
3. **Duplicazione cross-user**: Condividi template tra utenti
4. **Template marketplace**: Libreria di template pubblici duplicabili
5. **Merge forms**: Unisci campi da form diversi
6. **Duplicazione programmata**: Crea copie automatiche periodiche
7. **Version control**: Cronologia delle versioni con rollback
8. **Duplicazione con submission**: Opzione per copiare anche i dati (con consenso)

## FAQ

### Posso duplicare un form pubblicato?

Sì, puoi duplicare qualsiasi form, pubblicato o bozza. La copia sarà sempre una bozza.

### Quante volte posso duplicare lo stesso form?

Illimitate. Puoi creare quante copie vuoi.

### Posso duplicare un form di un altro utente?

No, puoi duplicare solo i tuoi form.

### Le submission vengono copiate?

No, la copia parte con zero submission per motivi di privacy.

### Posso modificare il form dopo la duplicazione?

Sì, la copia è completamente indipendente e modificabile.

### Il form duplicato ha lo stesso URL?

No, ogni form ha un URL unico. Dovrai aggiornare gli embed.

### Posso annullare una duplicazione?

Sì, elimina semplicemente il form duplicato dalla dashboard.

### La duplicazione costa crediti?

No, la duplicazione è gratuita e illimitata.

### Posso duplicare form con logica condizionale complessa?

Sì, tutta la logica condizionale viene preservata perfettamente.

### Il form duplicato eredita le statistiche?

No, le statistiche partono da zero per ogni form.

## Supporto

Per problemi con la duplicazione:
1. Verifica di essere il proprietario del form
2. Ricarica la dashboard
3. Prova a duplicare nuovamente
4. Contatta il supporto se il problema persiste

---

**Nota**: La duplicazione è uno strumento potente per velocizzare il tuo lavoro. Usala strategicamente per creare template, varianti e backup dei tuoi form più importanti.
