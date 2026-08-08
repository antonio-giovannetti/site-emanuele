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
        this.scrollToSectionRoute(sectionId)
    }
    private scrollToSectionFragment(sectionId: string) {
        this.router.navigate([], {fragment: sectionId, replaceUrl: true}).then((navigated) => {
            if (!navigated) {
                return;
            }
        });
    }


    private scrollToSectionRoute(sectionId: string) {
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
    set site(s: Site) {
        this._site = s;
    }

    get site(): Site | undefined {
        return this._site;
    }

    isWebinarExpired(w: Webinar) {
        return new Date(w.utcDate) < new Date();
    }

    navigateToWebinar(w: Webinar) {
        void this.router.navigate(['webinar', w.title+w.utcDate]);
    }

}



export const webinarResolver: ResolveFn<Webinar> = (route, state) => {
    const siteService = inject(SiteService);
    const wTitle = route.paramMap.get('id');
    return siteService.site!.webinars.filter(w => w.title+w.utcDate === wTitle)[0];
};