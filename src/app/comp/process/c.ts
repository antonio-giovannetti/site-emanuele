import {ChangeDetectionStrategy, Component, Input, OnInit} from "@angular/core";
import {SiteService} from "../../service/siteservice";
import {Contatto, ProcessStep, Titolare} from "../../dto/main";
import {FormsModule} from "@angular/forms";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'c-process',
    templateUrl: './c.html',
    standalone: true,
    styleUrls: ['./c.scss']
})
export class CProcess implements OnInit {

    @Input()
    processSteps: ProcessStep[] = [];

    constructor(private siteService: SiteService) {
        this.processSteps = siteService.site?.process!;
    }

    ngOnInit(): any {

    }


}