import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit} from "@angular/core";
import {SiteService} from "../../service/siteservice";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'c-video',
    template: '<video #videoPlayer class="video-background" [autoplay]="autoplay" muted loop>' +
        '<source [src]="\'assets/video/\' + src" [type]="type"></video>',
    standalone: true
})
export class CVideo implements OnInit {
    autoplay: boolean = false
    type: string = 'video/webm'
    @Input() src?: string;
    constructor(private siteService: SiteService, private cdr: ChangeDetectorRef) {
        this.autoplay = siteService.site?.settings.autoPlayVideo ?? false;
    }

    ngOnInit(): void {
        this.src?.endsWith('.mp4') ? this.type = 'video/mp4' : this.type = 'video/webm';
        this.cdr.markForCheck();
    }



}