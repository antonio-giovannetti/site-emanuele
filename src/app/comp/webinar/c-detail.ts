import {ChangeDetectionStrategy, Component, OnInit} from "@angular/core";
import {DatePipe} from "@angular/common";
import {ActivatedRoute, NavigationExtras, Route, Router} from "@angular/router";
import {Webinar} from "../../dto/main";
import {CVideo} from "../media/video";
import {Title} from "@angular/platform-browser";
import {SiteService} from "../../service/siteservice";

@Component({
    selector: 'c-webinar-detail',
    templateUrl: './c-detail.html',
    styleUrls: ['./c-detail.scss'],
    providers: [DatePipe],
    imports: [
        DatePipe,
        CVideo
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class CWebinarDetail implements OnInit {
    w!: Webinar;

    constructor(private activatedRoute: ActivatedRoute,
                private datePipe: DatePipe,
                private router: Router,
                private titleService: Title,
                private siteService: SiteService) {
    }

    ngOnInit() {
        this.w = this.activatedRoute.snapshot.data['webinar'];

        this.titleService.setTitle(`${this.siteService?.site?.titolare.name} - ${this.w.title}`);
    }

    requestInfo(w: Webinar): void {
        const formattedDate = this.datePipe.transform(w.utcDate, 'EEEE d MMMM yyyy', undefined, 'it-IT');
        const ne: NavigationExtras = {info: "no_scroll", queryParams: { subject: `${w.title} - ${formattedDate}`}}
        this.siteService.scrollToSection('contact', ne);
    }

    isWebinarExpired(w: Webinar) {
        return this.siteService.isWebinarExpired(w);
    }

    onWebinarSubmit(event: Event) {
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);

        const data = {
            name: formData.get('webinar-name'),
            email: formData.get('webinar-email'),
            phone: formData.get('webinar-phone'),
            interest: formData.get('webinar-interest'),
            privacy: formData.get('webinar-privacy'),
            newsletter: formData.get('webinar-newsletter'),
            registrationDate: new Date().toISOString(),
            source: 'webinar_registration'
        };

        console.log('Registrazione al webinar:', data);

        alert(`Grazie per la registrazione ${formData.get('webinar-name')}!\n\nIl link Zoom per accedere al webinar "Come superare l'ansia e ritrovare la serenità" sarà inviato a:\n${formData.get('webinar-email')}\n\nVedrai anche un'email con:\n- Guida PDF "5 tecniche anti-ansia"\n- Link per aggiungere l'evento al calendario\n- Domande frequenti\n\nA presto!`);

        form.reset();
    }
}
