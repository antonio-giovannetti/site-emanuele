import {ChangeDetectionStrategy, Component, Input, OnInit} from "@angular/core";
import {DatePipe} from "@angular/common";
import {Servizio} from "../../dto/main";
import {SiteService} from "../../service/siteservice";

@Component({
    selector: 'c-servizio',
    templateUrl: './c.html',
    styleUrls: ['./c.scss'],
    imports: [
        DatePipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class CServizio implements OnInit {
    @Input() servizi?: Servizio[];

    constructor(private siteService: SiteService) {
        this.servizi = siteService.servizi;

    }
    ngOnInit() {
    }

}