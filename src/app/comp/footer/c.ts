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
    waLink: string;
    constructor(private siteService: SiteService, private cdr: ChangeDetectorRef) {
        this.si = siteService.site;
        this.titolare = this.si?.titolare!;
        // this.waLink = 'https://wa.me/' + encodeURIComponent(this.titolare.contatto.cell) + '?text=Ciao';
        this.waLink = 'https://wa.me/' + this.titolare.contatto.cell ;
        this.cdr.markForCheck();
        this.year = new Date().getFullYear();
    }

}