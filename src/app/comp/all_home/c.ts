import {ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output} from "@angular/core";
import {SiteService} from "../../service/siteservice";
import {Contatto, Titolare, Webinar} from "../../dto/main";
import {FormsModule} from "@angular/forms";
import {CHero} from "../hero/c";
import {CWebinarSummary} from "../webinar/c-summary";
import {CAbout} from "../about/c";
import {CServizio} from "../servizi/c";
import {CProcess} from "../process/c";
import {CContact} from "../contact/c";
import {of} from "rxjs";
import {SeoService} from "../../service/seo.service";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'c-all-home',
    templateUrl: './c.html',
    standalone: true,
    imports: [
        CHero,
        CWebinarSummary,
        CAbout,
        CServizio,
        CProcess,
        CContact
    ]
})
export class CAllHome implements OnInit {

    webinars: Webinar[];

    constructor(private siteService: SiteService, private seoService: SeoService) {
        this.webinars = siteService.site?.webinars!;

    }

    ngOnInit(): any {
        // this.seoService.s
    }

}