import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from "@angular/core";
import {SiteService} from "../../service/siteservice";
import {Site, Titolare} from "../../dto/main";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'c-footer',
    templateUrl: './c.html',
    styleUrls: ['./c.scss'],
    standalone: true
})
export class CFooter {
    si?: Site;
    titolare: Titolare;
    constructor(private siteService: SiteService, private cdr: ChangeDetectorRef) {
        siteService.siteInfo().subscribe({next: (data) => {
            this.si = data;
            this.cdr.markForCheck();
        }});
        this.titolare = siteService.titolare;

    }

}