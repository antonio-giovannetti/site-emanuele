import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {Site, Titolare} from "../../dto/main";
import {SiteService} from "../../service/siteservice";
import {Title} from "@angular/platform-browser";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'c-hero',
    templateUrl: './c.html',
    standalone: true,
    styleUrls: ['./c.scss']
})
export class CHero implements OnInit {
    site?: Site;
    titolare: Titolare;

    constructor(private siteService: SiteService, private cdr: ChangeDetectorRef) {
        siteService.siteInfo().subscribe({next: (data) => {
            this.site = data;
            this.cdr.markForCheck();
        }});
        this.titolare = siteService.titolare;
    }

    scrollToSection(sectionId: string)  {
        console.log(`scrollToSection: ${sectionId}`);
        this.siteService.scrollToSection(sectionId);
    }

    ngOnInit(): any {
    }
}