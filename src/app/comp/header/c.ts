import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output} from "@angular/core";
import {SiteService} from "../../service/siteservice";
import {Contatto, Titolare} from "../../dto/main";
import {FormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'c-header',
    templateUrl: './c.html',
    standalone: true,
    imports: [
        RouterLink
    ],
    styleUrls: ['./c.scss']
})
export class CHeader implements OnInit {

    @Output()
    scroll: EventEmitter<string> = new EventEmitter();

    isMenuOpen = false;
    activeSection = 'hero';

    titolare: Titolare;

    $sub: Subscription;
    constructor(private siteService: SiteService, private cdr: ChangeDetectorRef) {
        this.titolare = siteService.titolare;
        this.$sub = siteService.onScroll((evt) => {
            this.setParams(evt, false);
        });
    }

    scrollToSection(sectionId: string)  {
        this.scroll.emit(sectionId);
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
    }

    ngOnInit(): any {

    }

    ngOnDestroy(): void {
        this.$sub.unsubscribe();
    }

    setParams(activeSection: string, menuOpen: boolean) {
        this.isMenuOpen = menuOpen;
        this.activeSection = activeSection;
        this.cdr.markForCheck();
    }

    closeMenu() {
        this.setParams(this.activeSection, false);
    }





}