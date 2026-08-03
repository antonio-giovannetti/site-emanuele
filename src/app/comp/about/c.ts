import {ChangeDetectionStrategy, Component, OnInit} from "@angular/core";
import {SiteService} from "../../service/siteservice";
import {Contatto, Titolare} from "../../dto/main";
import {FormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'c-about',
    templateUrl: './c.html',
    standalone: true,
    imports: [
        RouterLink
    ],
    styleUrls: ['./c.scss']
})
export class CAbout implements OnInit {

    titolare: Titolare;

    constructor(private siteService: SiteService) {
        this.titolare = siteService.titolare;
    }

    ngOnInit(): any {

    }


}