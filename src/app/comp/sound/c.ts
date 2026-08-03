import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnInit,
    ViewChild
} from "@angular/core";
import {SiteService} from "../../service/siteservice";
import {Contatto, Titolare} from "../../dto/main";
import {FormsModule} from "@angular/forms";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'c-audio',
    templateUrl: './c.html',
    styleUrls: ['./c.scss'],
    standalone: true
})
export class CAudio implements OnInit {
    play: boolean = false
    index: number = 0;
    _aud?: string;
    userHasInteracted = false;
    @Input() aud?: string[];
    constructor(private siteService: SiteService, private cdr: ChangeDetectorRef) {
        this.detectUserInteraction();
        this.play = siteService.site?.settings.autoPlayAudio ?? false;
    }

    private detectUserInteraction(): void {
        ['click', 'touchstart', 'keydown'].forEach(event => {
            document.addEventListener(event, () => {
                if (!this.userHasInteracted) {
                    // this.playSound()
                }
                this.userHasInteracted = true;
            }, { once: true });
        });
    }


    @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

    ngOnInit(): any {
        if (this.aud && this.aud.length > 0) {
            this.index = Math.floor(Math.random() * this.aud.length);
            this._aud = this.aud[this.index];
        }
    }

    next() {
        if (this.aud && this.aud.length > 0) {
            this.index = (this.index + 1) % this.aud.length;
            this._aud = this.aud[this.index];
            this.audioPlayer.nativeElement.load();
            this.playSound();
        }
    }

    playSound() {
        this.audioPlayer.nativeElement.play();
        this.play = true;
    }

    pauseSound() {
        this.audioPlayer.nativeElement.pause();
        this.play = false;
    }

    ngAfterViewInit() {
        if (!this.userHasInteracted) {
            // this.play = false;
        }
        if (this.play) {
            this.playSound();
        }
        this.cdr.markForCheck();
    }


}