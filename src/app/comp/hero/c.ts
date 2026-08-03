import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component, ElementRef,
    EventEmitter,
    OnInit,
    Output,
    ViewChild
} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {Site, Titolare} from "../../dto/main";
import {SiteService} from "../../service/siteservice";
import {Title} from "@angular/platform-browser";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'c-hero',
    templateUrl: './c.html',
    standalone: true,
    styleUrls: ['./c.scss']
})
export class CHero implements OnInit {
    site?: Site;
    autoplay: boolean;

    @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
    constructor(private siteService: SiteService, private cdr: ChangeDetectorRef) {
        this.site = siteService.site;
        this.autoplay = this.site?.settings.autoPlayVideo ?? false;
    }

    scrollToSection(sectionId: string)  {
        this.siteService.scrollToSection(sectionId);
    }

    ngOnInit(): any {

    }

    ngAfterViewInit() {
        if (this.autoplay) this.videoPlayer.nativeElement.play();
    }
}