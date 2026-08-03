import {ChangeDetectionStrategy, Component, Input, OnInit} from "@angular/core";
import {Webinar} from "../../dto/main";
import {DatePipe} from "@angular/common";
import {Observable} from "rxjs";

@Component({
    selector: 'c-webinar',
    templateUrl: './c.html',
    styleUrls: ['./c.scss'],
    imports: [
        DatePipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class CWebinar implements OnInit {

    @Input()
    webinar$!: Observable<Webinar>;

    w?: Webinar;

    ngOnInit() {
        this.webinar$.subscribe(webinar => {
            this.w = webinar;
        });
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