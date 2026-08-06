import {ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef} from "@angular/core";
import {SiteService} from "../../service/siteservice";
import {Contatto} from "../../dto/main";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'c-contact',
    templateUrl: './c.html',
    standalone: true,
    imports: [
        FormsModule,
        CommonModule
    ],
    styleUrls: ['./c.scss']
})
export class CContact implements OnInit {

    contatto: Contatto;
    isSubmitting = false;
    message: { type: 'success' | 'error' | 'info'; text: string } | null = null;
    captchaError = false;

    constructor(
        private siteService: SiteService,
        private cdr: ChangeDetectorRef
    ) {
        this.contatto = siteService.site?.titolare?.contatto!;
    }

    ngOnInit(): any {
        this.refreshCaptcha();
    }

    refreshCaptcha() {
        const captchaImg = document.getElementById('captchaImage') as HTMLImageElement;
        const captchaInput = document.getElementById('captcha') as HTMLInputElement;
        
        if (captchaImg) {
            captchaImg.src = '/php/captcha-generator.php?t=' + Date.now();
        }
        if (captchaInput) {
            captchaInput.value = '';
        }
        this.captchaError = false;
        this.cdr.markForCheck();
    }

    async onSubmit() {
        const form = document.querySelector('.contact-form') as HTMLFormElement;
        if (!form) return;

        this.isSubmitting = true;
        this.message = null;
        this.cdr.markForCheck();

        const formData = new FormData(form);

        try {
            // Submit form with CAPTCHA verification to backend handler
            const response = await fetch('/php/form-handler.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                this.message = {
                    type: 'success',
                    text: result.message
                };
                form.reset();
                this.refreshCaptcha();

                setTimeout(() => {
                    this.message = null;
                    this.cdr.markForCheck();
                }, 5000);
            } else {
                // Handle different error types
                if (result.type === 'captcha') {
                    this.captchaError = true;
                    this.refreshCaptcha();
                }
                
                this.message = {
                    type: 'error',
                    text: result.message || 'Form submission failed'
                };
            }

        } catch (error) {
            console.error('Form submission error:', error);
            this.message = {
                type: 'error',
                text: 'Si è verificato un errore. Per favore, riprova più tardi.'
            };
        } finally {
            this.isSubmitting = false;
            this.cdr.markForCheck();
        }
    }

}