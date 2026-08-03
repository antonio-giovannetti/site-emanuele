import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {ProcessStep, Servizio, Site, Titolare, Webinar} from "./dto/main";
import {of} from "rxjs";
import {SiteService} from "./service/siteservice";
import {Title} from "@angular/platform-browser";
import {CHeader} from "./comp/header/c";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // title = 'Studio Psicoterapeuta';
  auds: string[] = [];
  servizi: Servizio[] = [];
  site?: Site;
  private readonly sectionIds = ['hero', 'about', 'webinar', 'services', 'contact'];

  constructor(private siteService: SiteService, private titleService: Title, private cdr: ChangeDetectorRef) {
      this.site = siteService.site;
      this.servizi = siteService.servizi;
    this.auds = [
      'assets/audio/fatbunny-relax-491785.mp3',
    'assets/audio/paulyudin-ambient-relax-113444.mp3','assets/audio/synclabmusic-free-music-relax-425870.mp3',
    'assets/audio/chrispixer-just-relax-214589.mp3',
    'assets/audio/giorgiovitte-relax-relax-music-503805.mp3',
    'assets/audio/royaltyuserecords-flute-hop-relax-344988.mp3',
    'assets/audio/coma-media-milk-shake-116330.mp3',
    'assets/audio/oleg-mazur-time-for-relax-itx27s-time-to-take-a-break-and-relax-299791.mp3',
    'assets/audio/sigmamusicart-relaxing-relax-background-music-537728.mp3'    ];
    if (this.site?.titolare) {
      this.titleService.setTitle(this.site.titolare.name);
    }
  }

  @ViewChild(CHeader) headerComponent?: CHeader;


  ngOnInit(): void {

    this.updateActiveSectionFromScroll();
  }


  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      this.headerComponent?.setParams(sectionId, false);
      // this.activeSection = sectionId;
      // this.isMenuOpen = false;
    }
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.updateActiveSectionFromScroll();
  }

  private updateActiveSectionFromScroll() {
    const scrollOffset = 120;
    let current: string | undefined;
    for (let i = this.sectionIds.length - 1; i >= 0; i--) {
      const sectionId = this.sectionIds[i];
      const section = document.getElementById(sectionId);
      if (section && section.getBoundingClientRect().top <= scrollOffset) {
        current = sectionId;
        break;
      }
    }
    this.headerComponent?.setParams(current ?? this.sectionIds[0], false);
    // this.activeSection = current ?? this.sectionIds[0];
  }


  protected readonly of = of;
}
