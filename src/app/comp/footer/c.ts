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
    year: number;
    si?: Site;
    titolare: Titolare;
    constructor(private siteService: SiteService, private cdr: ChangeDetectorRef) {
        this.si = siteService.site;
        this.titolare = this.si?.titolare!;
        this.cdr.markForCheck();
        this.year = new Date().getFullYear();
    }

}