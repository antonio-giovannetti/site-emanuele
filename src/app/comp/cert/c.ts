import {ChangeDetectionStrategy, Component} from "@angular/core";
import {SiteService} from "../../service/siteservice";
import {Image} from "../../dto/main";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'c-cert',
    templateUrl: './c.html',
    styleUrls: ['./c.scss'],
    standalone: true
})
export class CCert {

    certs: Image[];
    selectedCert: Image | null = null;

    constructor(private siteService: SiteService) {
        this.certs = siteService.certs;
    }
    openCert(cert: Image): void {
        this.selectedCert = cert;
    }

    closeCert(): void {
        this.selectedCert = null;
    }

}