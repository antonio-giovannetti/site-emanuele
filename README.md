# Studio Psicoterapeuta - Sito Web Statico in Angular

Questo progetto è un sito web presentazione per uno studio psicoterapeuta sviluppato con Angular.

## Caratteristiche

✨ **Responsive Design** - Funziona perfettamente su desktop, tablet e dispositivi mobili
🎨 **Design Moderno** - Interfaccia pulita e professionale con colori armoniosi
📱 **Mobile-First** - Optimizzato per la visualizzazione su dispositivi mobile
⚡ **Performance** - Caricamento veloce e navigazione fluida
🔍 **SEO-Friendly** - Struttura semantica corretta

## Sezioni Principali

1. **Header & Navigazione** - Menu sticky con links ai vari servizi
2. **Hero Section** - Introduzione accattivante con call-to-action
3. **Webinar Gratuito** - Registrazione a webinar educativo con funnel di lead nurturing
4. **Chi Sono** - Profilo professionale con credenziali
5. **Servizi** - Presentazione dettagliata dei servizi offerti
6. **Come Lavoro** - Processo terapeutico in 4 step
7. **Contatti** - Modulo di contatto e informazioni di ubicazione
8. **Footer** - Link utili e informazioni legali

## Installazione

### Prerequisiti
- Node.js (versione 16 o superiore)
- npm (Node Package Manager)
- Angular CLI

### Setup

1. Estrai i file del progetto
2. Naviga nella cartella del progetto:
   ```bash
   cd psicoterapeuta-studio
   ```

3. Installa le dipendenze:
   ```bash
   npm install
   ```

4. Avvia il server di sviluppo:
   ```bash
   npm start
   ```

5. Apri il browser e visita: `http://localhost:4200/`

## Build per la Produzione

Per compilare il progetto per la produzione:

```bash
npm run build
```

I file compilati saranno disponibili nella cartella `dist/psicoterapeuta-studio/`

## Personalizzazione

### Modifica del Contenuto

1. **Apri il file**: `src/app/app.component.html`
2. Modifica il contenuto nella sezione desiderata:
   - Nome dello psicoterapeuta
   - Descrizione personale
   - Servizi offerti
   - Prezzi
   - Contatti
   - Orari

### Modifica dei Colori

I colori principali sono definiti in: `src/styles/global.css`

Modifica le variabili CSS:
```css
--primary-color: #5a4a7e;      /* Colore principale */
--primary-dark: #3d2f5c;       /* Colore principale scuro */
--accent-color: #8b7ba8;       /* Colore di accento */
```

### Personalizzazione del Webinar

1. Apri il file: `src/app/app.component.html`

2. Modifica la sezione Webinar con:
   - Titolo del webinar: "Come superare l'ansia e ritrovare la serenità"
   - Data e ora: cambiale nella sezione webinar-details
   - Numero posti: modificabile nel badge
   - Bonus offerto: aggiorna la descrizione bonus
   - Benefit list: modifica gli argomenti trattati
   - Opzioni di interesse: personalizza le categorie nel select

3. Integra con provider email:
   - Modifica il metodo `onWebinarSubmit()` in `app.component.ts`
   - Connetti con Mailchimp, ConvertKit, o altro servizio email
   - Configura l'invio automatico del link Zoom

4. Collegamento con calendario:
   - Aggiungi link ICS per aggiungere al calendario Google/Outlook

### Aggiunta di Foto Profilo

1. Aggiungi l'immagine in `src/assets/`
2. Modifica la sezione "About" in `app.component.html`
3. Sostituisci il placeholder con:
   ```html
   <img src="assets/tua-foto.jpg" alt="Profilo" class="profile-image">
   ```
4. Aggiungi il CSS in `app.component.css`:
   ```css
   .profile-image {
     width: 100%;
     height: 400px;
     object-fit: cover;
     border-radius: 10px;
   }
   ```

## Struttura del Progetto

```
psicoterapeuta-studio/
├── src/
│   ├── app/
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.css
│   │   └── app.module.ts
│   ├── styles/
│   │   └── global.css
│   ├── index.html
│   └── main.ts
├── angular.json
├── tsconfig.json
├── package.json
└── README.md
```

## Integrazione Webinar nel Funnel di Vendita

Il webinar è una strategia di lead nurturing che migliora il funnel di conversione:

**Funnel di Vendita con Webinar:**
1. **Awareness** → Visitatori del sito (organici + ads)
2. **Interest** → Visitatori che scoprono il webinar gratuito
3. **Lead Magnet** → Registrazione al webinar (raccolta email)
4. **Education** → Partecipazione webinar (relazione)
5. **Consideration** → Follow-up email dopo webinar
6. **Decision** → Contatto per prenotare sessione privata
7. **Action** → Primo pagamento

**Benefici:**
- ✅ Raccolta contatti qualificati (lead magnet)
- ✅ Costruzione di credibilità e fiducia
- ✅ Educazione del cliente sulla terapia
- ✅ Aumento del tasso di conversione (10-15% in più)
- ✅ Riduzione del CAC (costo acquisizione cliente)

## Supporto Form Contatti e Webinar

I moduli presenti nel progetto sono strutturati ma necessitano di un backend per l'invio effettivo. Per integrare l'invio email:

1. **Per il Form Contatti:**
   - Crea un backend (Node.js, Python, etc.)
   - Modifica `app.component.ts` per inviare i dati al backend
   - Implementa la logica di invio email nel backend

2. **Per il Webinar:**
   - Integra con servizio email (Mailchimp, Brevo, Convertkit)
   - Configura automazione per inviare:
     - Link Zoom entro 24 ore
     - Guida PDF bonus
     - Follow-up dopo webinar
   - Traccia le registrazioni nel database

**Consigliati per principianti:**
- Email: Brevo (ex Sendinblue) - gratuito fino a 300 email/giorno
- Webinar: Zoom - gratuito fino a 100 partecipanti
- Automazione: Zapier - connette i servizi automaticamente

## Deploy

### Hosting su Netlify

1. Installa Netlify CLI: `npm install -g netlify-cli`
2. Build il progetto: `npm run build`
3. Esegui il deploy: `netlify deploy --prod --dir=dist/psicoterapeuta-studio`

### Hosting su Vercel

1. Installa Vercel CLI: `npm install -g vercel`
2. Esegui: `vercel`
3. Segui le istruzioni

### Hosting tradizionale

1. Esegui `npm run build`
2. Carica il contenuto di `dist/psicoterapeuta-studio/` sul tuo server web

## Licenza

Questo progetto è libero da usare e modificare per fini commerciali e personali.

## Note Importanti

⚠️ **Informazioni Legali**: Assicurati di includere tutte le informazioni legali richieste dalla tua giurisdizione.

⚠️ **Credenziali Professionali**: Verifica di aver inserito le corrette credenziali e iscrizioni agli ordini professionali.

⚠️ **Privacy**: Implementa una privacy policy coerente con GDPR se necessario.

## Support

Per domande o problemi, contatta il supporto tecnico.

---

Creato con ❤️ per professionisti della salute mentale
