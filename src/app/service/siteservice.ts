import {Injectable} from "@angular/core";
import {Contatto, Image, ProcessStep, Servizio, Site, Titolare, Webinar} from "../dto/main";
import {Observable, Subject, Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: 'root',
})
export class SiteService {

    private $scrollSub: Subject<string> = new Subject<string>();
    public constructor(private http: HttpClient) {
    }

    onScroll(cb: (sectionId: string) => void): Subscription {
        return this.$scrollSub.subscribe(cb);
    }

    scrollToSection(sectionId: string) {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            this.$scrollSub.next(sectionId);
            // this.headerComponent?.setParams(sectionId, false);
            // this.activeSection = sectionId;
            // this.isMenuOpen = false;
        }
    }

    get contact(): Contatto {
        return {
            indirizzo1: "Via Morrone 62 ",
            indirizzo2: "03030 Pescosolido (FR)",
            indirizzo3: "Italia",
            tel: "",
            cell: "+393773993700 ",
            email: "studiodipsicologiaceci@gmail.com",
            pec: "emanuelececi79@pec.it",
            orari: ["Lun-Ven 9:00-18:00"]
        };
    }

    get titolare(): Titolare {

        return {
            name: "Dr. Emanuele Ceci",
            image: 'assets/1-975x1024.jpeg',
            spec: ['Mindfulness', 'Ansia e disturbi d\'ansia', 'Depressione e disturbi dell\'umore', 'Terapia di coppia', 'Gestione dello stress e burnout', 'Trauma e PTSD'],
            formazione: ['Psicoterapeuta Cognitivo-comportamentale ed intervento psicosociale',
                'Psicologo',
                'CPS Infermiere presso la Asl di Frosinone (Dipartimento di salute mentale e delle dipendenze)'],
            description: "Psicoterapeuta Cognitivo-comportamentale",
            ordine: "Ordine degli psicologi del Lazio nella sezione A dell'Albo dal 25/01/2021 con il n. 26142"
        };
    }

    get processSteps(): ProcessStep[] {
        return [
            {
                title: "Primo colloquio",
                description: "Un incontro conoscitivo senza impegno per esplorare le tue esigenze e valutare la compatibilità."
            },
            {
                title: "Valutazione",
                description: "Approfondimento della situazione attraverso colloqui mirati per definire gli obiettivi terapeutici."
            },
            {
                title: "Percorso terapeutico",
                description: "Lavoro strutturato insieme per raggiungere i tuoi obiettivi con tecniche evidence-based."
            },
            {
                title: "Consolidamento",
                description: "Consolidamento dei risultati e sviluppo di strategie autonome per il mantenimento del benessere."
            }
        ];
    }

    get servizi(): Servizio[] {
        return [{
            icon: 'fa-solid fa-person',
            title: "Terapia individuale",
            description: "Sessioni personalizzate per affrontare ansia, depressione, stress e difficoltà emotive con tecniche scientificamente provate.",
            cost: 80
        }, {
            icon: 'fa-solid fa-people-arrows',
            title: "Terapia di coppia",
            description: "Supporto professionale per migliorare la comunicazione, risolvere conflitti e rafforzare la relazione di coppia.",
            cost: 100
        }, {
            icon: 'fa-solid fa-question',
            title: "Consulenza psicologica",
            description: "Brevi percorsi consulenziali per questioni specifiche e presa di decisioni consapevole.",
            cost: 80
        }, {
            icon: 'fa-solid fa-code-branch',
            title: "Valutazione psicologica",
            description: "Valutazioni cliniche approfondite per comprendere il profilo psicologico e definire il percorso terapeutico.",
            cost: 100
        }, {
            icon: 'fa-solid fa-users',
            title: "Interventi familiari",
            description: "Sessioni con genitori, figli e familiari per affrontare dinamiche familiari complesse.",
            cost: 90
        }, {
            icon: 'fa-solid fa-video',
            title: "Sedute telematiche",
            description: "Sessioni disponibili tramite videoconsulenza per maggiore comodità e accessibilità.",
            cost: 70
        }]
    }

    get webinars(): Webinar[] {
        return [{
            title: 'Come superare l\'ansia e ritrovare la serenità',
            description: `Un webinar esclusivo con il ${this.titolare.name} per apprendere tecniche pratiche e evidence-based per gestire l\'ansia nel quotidiano.`,
            utcDate: new Date("2026-07-28T16:00:00Z"),
            people: 100,
            extra: "Riceverai una guida PDF \"5 tecniche anti-ansia\"",
            args: [
                'Tecniche di respirazione basate su evidence',
                'Come identificare i trigger dell\'ansia',
                'Strategie CBT per gestire pensieri negativi',
                'Esercizi pratici da fare a casa',
                'Quando cercare aiuto professionale'
            ]
        }]
    }

    get certs(): Image[] {

        return [{
            src: 'assets/images/cert/mbsr.jpg',
            caption: 'Percorso personale di riduzione dello Stress basato sulla Mindfulness MBSR , gruppo Sperling APL Milano',
            date: new Date("2024-01-01")
        }, {
            src: 'assets/images/cert/mindufullness-768x438.jpg',
            caption: 'Iscrizione al registro Nazionale Mindfulness N.° 3115',
            date: new Date("2024-02-01")
        }, {
            src: 'assets/images/cert/Federmindufullness-684x1024.jpg',
            caption: 'Iscrizione presso la Federmindufullness',
            date: new Date("2024-02-01")
        }, {
            src: 'assets/images/cert/becoming_presence-768x539.jpg',
            caption: 'Residenziale di Mindfulness a cura del gruppo Sperling APL Milano , presso la casa Don – Ispra.',
            date: new Date("2024-02-01")
        }, {
            src: 'assets/images/cert/diploma-3-1024x713.jpg',
            caption: 'Diploma di Specializzazione quadriennale in Psicoterapia Cognitivo-Comportamentale ed Intervento Psicosociale',
            date: new Date("2024-02-01")
        }, {
            src: 'assets/images/cert/3-681x1024.jpeg',
            caption: 'Iscrizione alla federmindfulness , Mindfulness Basic Training.',
            date: new Date("2024-02-01")
        }, {
            src: 'assets/images/cert/4.jpeg',
            caption: 'Corso di formazione Spazio Iris, relatore Prof. Fabrizio Didonna.',
            date: new Date("2024-02-01")
        }, {
            src: 'assets/images/cert/5-768x535.jpeg',
            caption: 'Corso MBSR Theacher, Gruppo Sperling APL Milano',
            date: new Date("2024-02-01")
        }]
    }

    siteInfo(): Observable<Site> {
        return this.http.get<Site>('assets/site.json');
    }
}