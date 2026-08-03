import {ChangeDetectionStrategy, Component, OnInit} from "@angular/core";
import {SiteService} from "../../service/siteservice";
import {Contatto, Titolare} from "../../dto/main";
import {FormsModule} from "@angular/forms";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'c-logo',
    templateUrl: './c.html',
    standalone: true,
    styleUrls: ['./c.scss']
})
export class CLogo implements OnInit {

    ngOnInit(): any {

    }
}