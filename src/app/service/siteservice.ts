import {Injectable} from "@angular/core";
import {Contatto, Image, ProcessStep, Servizio, Site, Titolare, Webinar} from "../dto/main";
import {Observable, Subject, Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
    providedIn: 'root',
})
export class SiteService {

    private _site?: Site;
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

    set site(s: Site) {
        this._site = s;
    }

    get site(): Site | undefined {
        return this._site;
    }
}