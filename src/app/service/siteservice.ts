import {inject, Injectable} from "@angular/core";
import {Location} from "@angular/common";
import {Contatto, Media, ProcessStep, Servizio, Site, Titolare, Webinar} from "../dto/main";
import {Observable, Subject, Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ResolveFn, Router} from "@angular/router";

@Injectable({
    providedIn: 'root',
})
export class SiteService {

    private _site?: Site;
    private $scrollSub: Subject<string> = new Subject<string>();
    public constructor(private http: HttpClient, private router: Router, private location: Location) {
    }

    onScroll(cb: (sectionId: string) => void): Subscription {
        return this.$scrollSub.subscribe(cb);
    }

    public sectionToRoutePath(sectionId: string): string {
        switch (sectionId) {
            case 'about':
            case 'webinar':
            case 'contact':
                return sectionId;
            case 'services':
                return 'services';
            case 'hero':
            default:
                return 'hero';
        }
    }

    public routePathToSection(routePath: string): string | undefined {
        const normalized = routePath.split('?')[0].split('#')[0].replace(/^\/+/, '');
        if (normalized === '' || normalized === 'hero') {
            return 'hero';
        }
        if (normalized === 'about' || normalized === 'webinar' || normalized === 'contact') {
            return normalized;
        }
        if (normalized === 'service' || normalized === 'services' || normalized === 'section') {
            return 'services';
        }
        return undefined;
    }

    private scrollSection(sectionId: string) {
        const element = sectionId === 'hero' ? document.body : document.getElementById(sectionId);
        if (!element) {
            return;
        }

        element.scrollIntoView({behavior: 'smooth'});
        this.$scrollSub.next(sectionId);
    }

    public scrollToSectionOnly(sectionId: string) {
        this.scrollSection(sectionId);
    }

    scrollToSection(sectionId: string) {
        const routePath = this.sectionToRoutePath(sectionId);

        const currentPath = this.router.url.split('?')[0];
        const targetPath = '/' + routePath;
        if (currentPath !== targetPath) {
            void this.router.navigate([routePath], {replaceUrl: true}).then((navigated) => {
                if (!navigated) {
                    return;
                }
                setTimeout(() => this.scrollSection(sectionId));
            });
            return;
        }

        this.scrollSection(sectionId);
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

    set site(s: Site) {
        this._site = s;
    }

    get site(): Site | undefined {
        return this._site;
    }
}



export const webinarResolver: ResolveFn<Webinar> = (route, state) => {
    const siteService = inject(SiteService);
    const wTitle = route.paramMap.get('id');
    return siteService.site!.webinars.filter(w => w.title === wTitle)[0];
};