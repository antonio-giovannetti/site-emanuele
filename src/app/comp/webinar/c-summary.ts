import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild} from "@angular/core";
import {DatePipe} from "@angular/common";
import {Router} from "@angular/router";
import {Webinar} from "../../dto/main";
import {SiteService} from "../../service/siteservice";

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
export class CWebinarSummary implements AfterViewInit, OnChanges {
    @Input()
    webinar?: Webinar[];

    @ViewChild('summaryCarousel')
    summaryCarousel?: ElementRef<HTMLDivElement>;

    private didInitialScroll = false;

    constructor(private router: Router, private siteService: SiteService) {
    }

    ngAfterViewInit() {
        this.scrollToRightIfReady();
    }

    ngOnChanges(_: SimpleChanges) {
        this.scrollToRightIfReady();
    }

    isWebinarExpired(w: Webinar) {
        return this.siteService.isWebinarExpired(w);
    }

    navigate(w: Webinar) {
        this.siteService.navigateToWebinar(w);
    }

    private scrollToRightIfReady() {
        if (this.didInitialScroll || !this.summaryCarousel || !this.webinar?.length) {
            return;
        }

        requestAnimationFrame(() => {
            const el = this.summaryCarousel?.nativeElement;
            if (!el) {
                return;
            }

            el.scrollLeft = el.scrollWidth;
            this.didInitialScroll = true;
        });
    }
}
