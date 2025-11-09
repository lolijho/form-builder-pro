# Logica Condizionale - Documentazione

## Panoramica

La logica condizionale permette di mostrare o nascondere campi del form in base alle risposte dell'utente. Questa funzionalità rende i form più intelligenti e dinamici, migliorando l'esperienza utente mostrando solo i campi rilevanti.

## Come Funziona

### Configurazione nell'Editor

1. **Accedi all'editor del form** e seleziona un campo
2. **Apri il pannello proprietà** cliccando sull'icona delle impostazioni
3. **Scorri fino alla sezione "Logica Condizionale"**
4. **Clicca su "Aggiungi Condizione"** per creare una nuova regola

### Struttura delle Regole

Ogni regola condizionale è composta da tre elementi:

1. **Campo**: Il campo da controllare (deve essere posizionato prima del campo corrente)
2. **Operatore**: Il tipo di confronto da effettuare
3. **Valore**: Il valore con cui confrontare (non necessario per alcuni operatori)

### Operatori Disponibili

| Operatore | Descrizione | Richiede Valore |
|-----------|-------------|-----------------|
| **è uguale a** | Il campo deve avere esattamente questo valore | ✅ Sì |
| **è diverso da** | Il campo deve avere un valore diverso | ✅ Sì |
| **contiene** | Il valore del campo deve contenere il testo specificato | ✅ Sì |
| **non contiene** | Il valore del campo non deve contenere il testo | ✅ Sì |
| **è vuoto** | Il campo deve essere vuoto o non compilato | ❌ No |
| **non è vuoto** | Il campo deve essere compilato | ❌ No |

### Logica AND

Quando aggiungi più condizioni allo stesso campo, **tutte le condizioni devono essere soddisfatte** per mostrare il campo (logica AND).

**Esempio:**
- Condizione 1: "Paese" è uguale a "Italia"
- Condizione 2: "Età" è maggiore di "18"

Il campo sarà visibile solo se l'utente ha selezionato "Italia" **E** ha inserito un'età maggiore di 18.

## Esempi Pratici

### Esempio 1: Form di Feedback con Follow-up

**Scenario:** Mostrare un campo di testo per commenti aggiuntivi solo se l'utente non è soddisfatto.

**Campi:**
1. Campo: "Quanto sei soddisfatto?" (select)
   - Opzioni: "Molto soddisfatto", "Soddisfatto", "Insoddisfatto"
2. Campo: "Cosa possiamo migliorare?" (textarea)
   - **Condizione:** "Quanto sei soddisfatto?" è uguale a "Insoddisfatto"

### Esempio 2: Form di Registrazione Evento

**Scenario:** Mostrare campi aggiuntivi solo per partecipanti che necessitano di alloggio.

**Campi:**
1. Campo: "Necessiti di alloggio?" (radio)
   - Opzioni: "Sì", "No"
2. Campo: "Tipo di camera" (select)
   - **Condizione:** "Necessiti di alloggio?" è uguale a "Sì"
3. Campo: "Note speciali" (textarea)
   - **Condizione:** "Necessiti di alloggio?" è uguale a "Sì"

### Esempio 3: Form di Contatto con Categorie

**Scenario:** Mostrare campi diversi in base al tipo di richiesta.

**Campi:**
1. Campo: "Tipo di richiesta" (select)
   - Opzioni: "Supporto tecnico", "Vendite", "Altro"
2. Campo: "Numero di licenza" (text)
   - **Condizione:** "Tipo di richiesta" è uguale a "Supporto tecnico"
3. Campo: "Budget previsto" (number)
   - **Condizione:** "Tipo di richiesta" è uguale a "Vendite"
4. Campo: "Descrivi la tua richiesta" (textarea)
   - **Condizione:** "Tipo di richiesta" è uguale a "Altro"

### Esempio 4: Condizioni Multiple (AND)

**Scenario:** Mostrare un campo solo se più condizioni sono soddisfatte.

**Campi:**
1. Campo: "Sei maggiorenne?" (radio)
   - Opzioni: "Sì", "No"
2. Campo: "Paese" (select)
   - Opzioni: "Italia", "Svizzera", "Francia", "Altro"
3. Campo: "Accetti i termini?" (checkbox)
4. Campo: "Firma digitale" (text)
   - **Condizione 1:** "Sei maggiorenne?" è uguale a "Sì"
   - **Condizione 2:** "Paese" è uguale a "Italia"
   - **Condizione 3:** "Accetti i termini?" non è vuoto

## Comportamento Tecnico

### Durante la Compilazione

- I campi nascosti **non sono visibili** all'utente
- Quando una condizione diventa vera, il campo **appare immediatamente**
- Quando una condizione diventa falsa, il campo **scompare immediatamente**
- I valori dei campi nascosti vengono **automaticamente cancellati**

### Durante l'Invio

- Solo i dati dei **campi visibili** vengono inviati
- I campi nascosti non vengono inclusi nella submission
- La validazione viene applicata solo ai campi visibili

### Nell'Anteprima

- L'anteprima nell'editor mostra il comportamento reale della logica condizionale
- Puoi testare le condizioni compilando il form nell'anteprima

## Limitazioni e Best Practices

### Limitazioni

1. **Ordine dei campi**: Puoi creare condizioni solo su campi che vengono **prima** del campo corrente
2. **Riferimenti circolari**: Non è possibile creare dipendenze circolari (A dipende da B, B dipende da A)
3. **Logica OR**: Attualmente supportata solo logica AND (tutte le condizioni devono essere vere)

### Best Practices

1. **Mantieni semplice**: Evita catene di dipendenze troppo complesse
2. **Testa sempre**: Usa l'anteprima per testare tutte le combinazioni possibili
3. **Comunica chiaramente**: Usa etichette chiare per i campi che controllano la visibilità
4. **Ordine logico**: Posiziona i campi di controllo prima dei campi condizionali
5. **Valori predefiniti**: Per campi select/radio, considera di impostare un'opzione predefinita

## Struttura Dati

### Nel Database

Le regole condizionali sono memorizzate come parte del campo nel JSON `fields`:

```json
{
  "id": "field-123",
  "type": "text",
  "label": "Commenti aggiuntivi",
  "conditionalRules": [
    {
      "fieldId": "field-456",
      "operator": "equals",
      "value": "Insoddisfatto"
    }
  ]
}
```

### Tipi TypeScript

```typescript
type ConditionOperator = 
  | "equals" 
  | "not_equals" 
  | "contains" 
  | "not_contains" 
  | "is_empty" 
  | "is_not_empty";

interface ConditionalRule {
  fieldId: string;
  operator: ConditionOperator;
  value?: any;
}

interface FormField {
  // ... altri campi
  conditionalRules?: ConditionalRule[];
}
```

## Algoritmo di Valutazione

Il sistema valuta le condizioni seguendo questi passaggi:

1. **Raccolta dati**: Ottiene i valori correnti di tutti i campi del form
2. **Iterazione campi**: Per ogni campo, controlla se ha regole condizionali
3. **Valutazione regole**: Valuta ogni regola usando l'operatore specificato
4. **Logica AND**: Il campo è visibile solo se TUTTE le regole sono soddisfatte
5. **Pulizia dati**: Rimuove i dati dei campi che diventano nascosti
6. **Aggiornamento UI**: Mostra/nasconde i campi in tempo reale

## Compatibilità

- ✅ Funziona con tutti i 9 tipi di campo supportati
- ✅ Compatibile con validazione campi
- ✅ Compatibile con campi obbligatori
- ✅ Funziona sia nell'anteprima che nel form pubblico
- ✅ Supporta form embedded (iframe e script)

## Risoluzione Problemi

### Il campo non appare quando dovrebbe

1. Verifica che tutte le condizioni siano soddisfatte
2. Controlla che il campo di riferimento abbia il valore corretto
3. Assicurati che l'operatore sia quello giusto
4. Verifica l'ordine dei campi (il campo di controllo deve venire prima)

### Il campo scompare inaspettatamente

1. Controlla se ci sono condizioni multiple (tutte devono essere vere)
2. Verifica che il valore del campo di controllo non sia cambiato
3. Controlla la console del browser per eventuali errori

### I dati non vengono salvati

1. I dati dei campi nascosti vengono automaticamente rimossi
2. Assicurati che il campo sia visibile al momento dell'invio
3. Verifica che non ci siano errori di validazione sui campi visibili

## Estensioni Future Possibili

- Logica OR (almeno una condizione deve essere vera)
- Operatori numerici (maggiore di, minore di)
- Operatori di data (prima di, dopo di)
- Azioni personalizzate (oltre a mostra/nascondi)
- Gruppi di condizioni con logica mista (AND/OR)
- Condizioni basate su calcoli o formule
