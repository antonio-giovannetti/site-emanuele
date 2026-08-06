import {ChangeDetectionStrategy, Component} from "@angular/core";
import {SiteService} from "../../service/siteservice";
import {Media} from "../../dto/main";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'c-cert',
    templateUrl: './c.html',
    styleUrls: ['./c.scss'],
    standalone: true
})
export class CCert {

    certs: Media[];
    selectedCert: Media | null = null;

    constructor(private siteService: SiteService) {
        this.certs = siteService.site?.titolare.certs || [];
    }
    openCert(cert: Media): void {
        this.selectedCert = cert;
    }

    closeCert(): void {
        this.selectedCert = null;
    }

}