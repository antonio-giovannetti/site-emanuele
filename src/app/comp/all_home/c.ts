import {ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output} from "@angular/core";
import {SiteService} from "../../service/siteservice";
import {Contatto, Titolare, Webinar} from "../../dto/main";
import {FormsModule} from "@angular/forms";
import {CHero} from "../hero/c";
import {CWebinar} from "../webinar/c";
import {CAbout} from "../about/c";
import {CServizio} from "../servizi/c";
import {CProcess} from "../process/c";
import {CContact} from "../contact/c";
import {of} from "rxjs";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'c-all-home',
    templateUrl: './c.html',
    standalone: true,
    imports: [
        CHero,
        CWebinar,
        CAbout,
        CServizio,
        CProcess,
        CContact
    ]
})
export class CAllHome implements OnInit {

    titolare: Titolare;
    webinars: Webinar[];

    constructor(private siteService: SiteService) {
        this.webinars = siteService.webinars;

        this.titolare = siteService.titolare;
    }

    @Output()
    scroll: EventEmitter<string> = new EventEmitter();

    scrollToSection(sectionId: string)  {
        this.scroll.emit(sectionId);
    }

    ngOnInit(): any {

    }

    protected readonly of = of;

}