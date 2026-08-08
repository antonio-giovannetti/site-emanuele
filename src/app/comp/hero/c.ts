import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component, ElementRef,
    EventEmitter,
    OnInit,
    Output,
    ViewChild
} from "@angular/core";
import {DatePipe} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Aforisma, Site, Titolare, Webinar} from "../../dto/main";
import {SiteService} from "../../service/siteservice";
import {Title} from "@angular/platform-browser";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'c-hero',
    templateUrl: './c.html',
    standalone: true,
    imports: [
        DatePipe
    ],
    styleUrls: ['./c.scss']
})
export class CHero implements OnInit {
    site?: Site;
    autoplay: boolean;
    af?: Aforisma;
    nextWebinar?: Webinar;

    @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
    constructor(private siteService: SiteService, private cdr: ChangeDetectorRef) {
        this.site = siteService.site;
        this.autoplay = this.site?.settings.autoPlayVideo ?? false;
    }

    scrollToSection(sectionId: string)  {
        this.siteService.scrollToSection(sectionId);
    }

    navigateToWebinar() {
        if (this.nextWebinar) {
            this.siteService.navigateToWebinar(this.nextWebinar);
        }
    }

    ngOnInit(): any {
        if (this.site?.aforismi) {
            const aforismi = this.site?.aforismi?.aforismi;
            if (!aforismi) {return;}
            if (this.site?.aforismi.show === "random") {
                if (aforismi && aforismi.length > 0) {
                    const randomIndex = Math.floor(Math.random() * aforismi.length);
                    this.af = aforismi[randomIndex];
                }
            } else {
                this.af = aforismi[this.site?.aforismi.show as number];
            }
        }

        const ws: Webinar[] | undefined= this.site?.webinars?.filter((webinar) => {
            return !this.siteService.isWebinarExpired(webinar);
        });
        if (!!ws && ws.length>0) {
            this.nextWebinar = ws[0];
        }
    }

    ngAfterViewInit() {
        if (this.autoplay) this.videoPlayer.nativeElement.play();
    }
}