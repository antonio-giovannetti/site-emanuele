import {CommonModule, isPlatformBrowser} from "@angular/common";
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID} from "@angular/core";

@Component({
    selector: 'c-cookie-consent',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './c.html',
    styleUrls: ['./c.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CCookieConsent implements OnInit {
    visible = false;
    private readonly consentKey = 'cookie-consent-status';

    constructor(
        @Inject(PLATFORM_ID) private platformId: object,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        const status = localStorage.getItem(this.consentKey);
        this.visible = status !== 'accepted' && status !== 'rejected';
        this.cdr.markForCheck();
    }

    accept(): void {
        this.setStatus('accepted');
    }

    reject(): void {
        this.setStatus('rejected');
    }

    private setStatus(status: 'accepted' | 'rejected'): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        localStorage.setItem(this.consentKey, status);
        this.visible = false;
        this.cdr.markForCheck();
    }
}
