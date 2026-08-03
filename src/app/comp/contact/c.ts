import {ChangeDetectionStrategy, Component, OnInit} from "@angular/core";
import {SiteService} from "../../service/siteservice";
import {Contatto} from "../../dto/main";
import {FormsModule} from "@angular/forms";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'c-contact',
    templateUrl: './c.html',
    standalone: true,
    imports: [
        FormsModule
    ],
    styleUrls: ['./c.scss']
})
export class CContact implements OnInit {

    contatto: Contatto;

    constructor(private siteService: SiteService) {
        this.contatto = siteService.contact;
    }

    ngOnInit(): any {

    }

    onSubmit() {
        const form = document.querySelector('.contact-form') as HTMLFormElement;
        if (form) {
            const formData = new FormData(form);

            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                message: formData.get('message'),
                submissionDate: new Date().toISOString(),
                source: 'contact_form'
            };

            console.log('Richiesta di contatto:', data);

            alert(`Grazie ${formData.get('name')}!\n\nHo ricevuto la tua richiesta.\n\nTi contatterò entro 24 ore al numero:\n${formData.get('phone') || formData.get('email')}\n\nA presto!`);

            form.reset();
        }
    }

}