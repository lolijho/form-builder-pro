import { FormField, FormStyles, defaultFormStyles } from "./formTypes";

export interface FormTemplate {
  id: string;
  name: string;
  description: string;
  category: "business" | "event" | "feedback" | "marketing";
  fields: FormField[];
  styles: FormStyles;
}

export const formTemplates: FormTemplate[] = [
  {
    id: "contact",
    name: "Modulo Contatto",
    description: "Form di contatto classico per ricevere messaggi dai visitatori",
    category: "business",
    fields: [
      {
        id: "name",
        type: "text",
        label: "Nome",
        placeholder: "Il tuo nome",
        required: true,
      },
      {
        id: "surname",
        type: "text",
        label: "Cognome",
        placeholder: "Il tuo cognome",
        required: true,
      },
      {
        id: "email",
        type: "email",
        label: "Email",
        placeholder: "nome@esempio.com",
        required: true,
        validation: {
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
          message: "Inserisci un'email valida",
        },
      },
      {
        id: "phone",
        type: "text",
        label: "Telefono",
        placeholder: "+39 123 456 7890",
        required: false,
      },
      {
        id: "subject",
        type: "select",
        label: "Oggetto",
        required: true,
        options: ["Informazioni", "Supporto", "Collaborazione", "Altro"],
      },
      {
        id: "message",
        type: "textarea",
        label: "Messaggio",
        placeholder: "Scrivi il tuo messaggio qui...",
        required: true,
        validation: {
          minLength: 10,
          message: "Il messaggio deve contenere almeno 10 caratteri",
        },
      },
    ],
    styles: {
      ...defaultFormStyles,
      primaryColor: "#2563eb",
      borderRadius: 8,
    },
  },
  {
    id: "event-registration",
    name: "Registrazione Evento",
    description: "Form per registrare partecipanti a eventi, conferenze o workshop",
    category: "event",
    fields: [
      {
        id: "fullname",
        type: "text",
        label: "Nome Completo",
        placeholder: "Mario Rossi",
        required: true,
        step: 1,
      },
      {
        id: "email",
        type: "email",
        label: "Email",
        placeholder: "mario.rossi@esempio.com",
        required: true,
        step: 1,
      },
      {
        id: "company",
        type: "text",
        label: "Azienda",
        placeholder: "Nome azienda",
        required: false,
        step: 1,
      },
      {
        id: "role",
        type: "text",
        label: "Ruolo",
        placeholder: "Es: Marketing Manager",
        required: false,
        step: 1,
      },
      {
        id: "ticket_type",
        type: "radio",
        label: "Tipo di Biglietto",
        required: true,
        options: ["Standard", "VIP", "Studente"],
        step: 2,
      },
      {
        id: "dietary",
        type: "select",
        label: "Preferenze Alimentari",
        required: false,
        options: ["Nessuna", "Vegetariano", "Vegano", "Senza Glutine", "Altro"],
        step: 2,
      },
      {
        id: "tshirt",
        type: "select",
        label: "Taglia T-Shirt",
        required: false,
        options: ["XS", "S", "M", "L", "XL", "XXL"],
        step: 2,
      },
      {
        id: "notes",
        type: "textarea",
        label: "Note Aggiuntive",
        placeholder: "Eventuali richieste speciali...",
        required: false,
        step: 2,
      },
    ],
    styles: {
      ...defaultFormStyles,
      primaryColor: "#7c3aed",
      borderRadius: 12,
    },
  },
  {
    id: "survey",
    name: "Sondaggio Soddisfazione",
    description: "Raccogli feedback e opinioni dai tuoi clienti",
    category: "feedback",
    fields: [
      {
        id: "overall_rating",
        type: "radio",
        label: "Come valuteresti la tua esperienza complessiva?",
        required: true,
        options: ["Eccellente", "Buona", "Discreta", "Scarsa", "Pessima"],
      },
      {
        id: "recommend",
        type: "radio",
        label: "Consiglieresti il nostro servizio ad un amico?",
        required: true,
        options: ["Sì, assolutamente", "Probabilmente sì", "Non so", "Probabilmente no", "No"],
      },
      {
        id: "best_features",
        type: "checkbox",
        label: "Quali aspetti hai apprezzato di più?",
        required: false,
        options: [
          "Facilità d'uso",
          "Design",
          "Velocità",
          "Assistenza clienti",
          "Prezzo",
          "Funzionalità",
        ],
      },
      {
        id: "improvements",
        type: "textarea",
        label: "Cosa potremmo migliorare?",
        placeholder: "I tuoi suggerimenti sono preziosi...",
        required: false,
      },
      {
        id: "contact_email",
        type: "email",
        label: "Email (opzionale)",
        placeholder: "Se vuoi essere ricontattato",
        required: false,
      },
    ],
    styles: {
      ...defaultFormStyles,
      primaryColor: "#059669",
      borderRadius: 10,
    },
  },
  {
    id: "lead-generation",
    name: "Lead Generation",
    description: "Cattura lead qualificati per il tuo business",
    category: "marketing",
    fields: [
      {
        id: "company_name",
        type: "text",
        label: "Nome Azienda",
        placeholder: "Acme Inc.",
        required: true,
      },
      {
        id: "contact_name",
        type: "text",
        label: "Nome e Cognome",
        placeholder: "Mario Rossi",
        required: true,
      },
      {
        id: "email",
        type: "email",
        label: "Email Aziendale",
        placeholder: "mario@acme.com",
        required: true,
      },
      {
        id: "phone",
        type: "text",
        label: "Telefono",
        placeholder: "+39 123 456 7890",
        required: true,
      },
      {
        id: "company_size",
        type: "select",
        label: "Dimensione Azienda",
        required: true,
        options: ["1-10 dipendenti", "11-50 dipendenti", "51-200 dipendenti", "201-1000 dipendenti", "1000+ dipendenti"],
      },
      {
        id: "industry",
        type: "select",
        label: "Settore",
        required: true,
        options: ["Tecnologia", "Finanza", "Retail", "Sanità", "Manifatturiero", "Servizi", "Altro"],
      },
      {
        id: "budget",
        type: "select",
        label: "Budget Mensile",
        required: false,
        options: ["< €1.000", "€1.000 - €5.000", "€5.000 - €10.000", "€10.000 - €50.000", "> €50.000"],
      },
      {
        id: "needs",
        type: "textarea",
        label: "Descrivi le tue esigenze",
        placeholder: "Raccontaci di cosa hai bisogno...",
        required: true,
      },
      {
        id: "timeline",
        type: "radio",
        label: "Quando vorresti iniziare?",
        required: true,
        options: ["Subito", "Entro 1 mese", "Entro 3 mesi", "Oltre 3 mesi", "Solo informazioni"],
      },
    ],
    styles: {
      ...defaultFormStyles,
      primaryColor: "#dc2626",
      borderRadius: 8,
    },
  },
  {
    id: "feedback",
    name: "Feedback Prodotto",
    description: "Raccogli opinioni dettagliate sul tuo prodotto o servizio",
    category: "feedback",
    fields: [
      {
        id: "product",
        type: "select",
        label: "Quale prodotto hai utilizzato?",
        required: true,
        options: ["Prodotto A", "Prodotto B", "Prodotto C", "Servizio Premium", "Altro"],
      },
      {
        id: "usage_frequency",
        type: "radio",
        label: "Con che frequenza lo utilizzi?",
        required: true,
        options: ["Quotidianamente", "Settimanalmente", "Mensilmente", "Raramente"],
      },
      {
        id: "ease_of_use",
        type: "radio",
        label: "Quanto è facile da usare?",
        required: true,
        options: ["Molto facile", "Facile", "Nella media", "Difficile", "Molto difficile"],
      },
      {
        id: "features_used",
        type: "checkbox",
        label: "Quali funzionalità utilizzi di più?",
        required: false,
        options: [
          "Dashboard",
          "Report",
          "Integrazioni",
          "Mobile App",
          "API",
          "Supporto",
        ],
      },
      {
        id: "missing_features",
        type: "textarea",
        label: "Quali funzionalità vorresti vedere aggiunte?",
        placeholder: "Descrivi le funzionalità che ti mancano...",
        required: false,
      },
      {
        id: "bugs",
        type: "textarea",
        label: "Hai riscontrato problemi o bug?",
        placeholder: "Descrivi eventuali problemi tecnici...",
        required: false,
      },
      {
        id: "overall_satisfaction",
        type: "radio",
        label: "Quanto sei soddisfatto nel complesso?",
        required: true,
        options: ["Molto soddisfatto", "Soddisfatto", "Neutrale", "Insoddisfatto", "Molto insoddisfatto"],
      },
    ],
    styles: {
      ...defaultFormStyles,
      primaryColor: "#ea580c",
      borderRadius: 10,
    },
  },
];

export function getTemplateById(id: string): FormTemplate | undefined {
  return formTemplates.find((t) => t.id === id);
}

export function getTemplatesByCategory(category: FormTemplate["category"]): FormTemplate[] {
  return formTemplates.filter((t) => t.category === category);
}
