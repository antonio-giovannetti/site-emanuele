import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {DatePipe} from "@angular/common";
import {Router} from "@angular/router";
import {Webinar} from "../../dto/main";

@Component({
    selector: 'c-webinar-summary',
    templateUrl: './c-summary.html',
    styleUrls: ['./c-summary.scss'],
    imports: [
        DatePipe
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class CWebinarSummary {
    @Input()
    webinar?: Webinar[];

    constructor(private router: Router) {
    }

    isExpired(w: Webinar) {
        return new Date(w.utcDate) < new Date();
    }

    navigate(w: Webinar) {
        void this.router.navigate(['webinar', w.title]);
    }
}
