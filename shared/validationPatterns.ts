/**
 * Predefined validation patterns for common use cases
 */

export interface ValidationPattern {
  name: string;
  pattern: string;
  message: string;
  description: string;
}

export const validationPatterns: ValidationPattern[] = [
  {
    name: "Codice Fiscale",
    pattern: "^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$",
    message: "Inserisci un codice fiscale valido (es: RSSMRA80A01H501U)",
    description: "Codice fiscale italiano (16 caratteri)",
  },
  {
    name: "Partita IVA",
    pattern: "^[0-9]{11}$",
    message: "Inserisci una partita IVA valida (11 cifre)",
    description: "Partita IVA italiana (11 cifre numeriche)",
  },
  {
    name: "Telefono Italiano",
    pattern: "^(\\+39)?\\s?[0-9]{9,10}$",
    message: "Inserisci un numero di telefono valido (es: 3331234567 o +393331234567)",
    description: "Numero di telefono italiano (con o senza +39)",
  },
  {
    name: "CAP",
    pattern: "^[0-9]{5}$",
    message: "Inserisci un CAP valido (5 cifre)",
    description: "Codice Avviamento Postale italiano (5 cifre)",
  },
  {
    name: "Email",
    pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
    message: "Inserisci un indirizzo email valido",
    description: "Indirizzo email standard",
  },
  {
    name: "URL",
    pattern: "^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$",
    message: "Inserisci un URL valido (es: https://esempio.com)",
    description: "URL completo con protocollo http/https",
  },
  {
    name: "Solo Lettere",
    pattern: "^[a-zA-ZÀ-ÿ\\s]+$",
    message: "Inserisci solo lettere e spazi",
    description: "Solo caratteri alfabetici e spazi (inclusi accenti)",
  },
  {
    name: "Solo Numeri",
    pattern: "^[0-9]+$",
    message: "Inserisci solo numeri",
    description: "Solo cifre numeriche",
  },
  {
    name: "Alfanumerico",
    pattern: "^[a-zA-Z0-9]+$",
    message: "Inserisci solo lettere e numeri (senza spazi o caratteri speciali)",
    description: "Solo caratteri alfanumerici",
  },
  {
    name: "IBAN Italiano",
    pattern: "^IT[0-9]{2}[A-Z][0-9]{10}[0-9A-Z]{12}$",
    message: "Inserisci un IBAN italiano valido (es: IT60X0542811101000000123456)",
    description: "IBAN italiano (27 caratteri)",
  },
  {
    name: "Carta di Credito",
    pattern: "^[0-9]{13,19}$",
    message: "Inserisci un numero di carta di credito valido (13-19 cifre)",
    description: "Numero di carta di credito (13-19 cifre)",
  },
  {
    name: "Data (GG/MM/AAAA)",
    pattern: "^(0[1-9]|[12][0-9]|3[01])\\/(0[1-9]|1[0-2])\\/[0-9]{4}$",
    message: "Inserisci una data nel formato GG/MM/AAAA (es: 25/12/2024)",
    description: "Data nel formato giorno/mese/anno",
  },
  {
    name: "Ora (HH:MM)",
    pattern: "^([01][0-9]|2[0-3]):[0-5][0-9]$",
    message: "Inserisci un'ora nel formato HH:MM (es: 14:30)",
    description: "Ora nel formato 24 ore",
  },
  {
    name: "Username",
    pattern: "^[a-zA-Z0-9_-]{3,20}$",
    message: "Inserisci un username valido (3-20 caratteri: lettere, numeri, _ e -)",
    description: "Username (lettere, numeri, underscore e trattino, 3-20 caratteri)",
  },
  {
    name: "Password Forte",
    pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
    message: "La password deve contenere almeno 8 caratteri, una maiuscola, una minuscola, un numero e un carattere speciale",
    description: "Password con almeno 8 caratteri, maiuscola, minuscola, numero e carattere speciale",
  },
];

/**
 * Get a validation pattern by name
 */
export function getPatternByName(name: string): ValidationPattern | undefined {
  return validationPatterns.find((p) => p.name === name);
}

/**
 * Validate a value against a regex pattern
 */
export function validatePattern(value: string, pattern: string): boolean {
  try {
    const regex = new RegExp(pattern);
    return regex.test(value);
  } catch (error) {
    console.error("Invalid regex pattern:", pattern, error);
    return true; // Don't block submission if pattern is invalid
  }
}
