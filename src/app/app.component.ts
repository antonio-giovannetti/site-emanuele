import {ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {ProcessStep, Servizio, Site, Titolare, Webinar} from "./dto/main";
import {of} from "rxjs";
import {SiteService} from "./service/siteservice";
import {Title} from "@angular/platform-browser";
import {CHeader} from "./comp/header/c";
import {NavigationEnd, Router} from "@angular/router";
import {Location} from "@angular/common";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // title = 'Studio Psicoterapeuta';
  auds: string[] = [];
  site?: Site;
  private readonly sectionIds = ['hero', 'about', 'webinar', 'services', 'contact'];
  private lastUrlSection?: string;
  private lastSyncedRoutePath?: string;
  private isSyncingSectionFromRoute = false;

  constructor(private siteService: SiteService, private titleService: Title, private cdr: ChangeDetectorRef, private router: Router, private location: Location) {
      this.site = siteService.site;
      this.auds = [
      'fatbunny-relax-491785.mp3',
    'paulyudin-ambient-relax-113444.mp3','synclabmusic-free-music-relax-425870.mp3',
    'chrispixer-just-relax-214589.mp3',
    'giorgiovitte-relax-relax-music-503805.mp3',
    'royaltyuserecords-flute-hop-relax-344988.mp3',
    'coma-media-milk-shake-116330.mp3',
    'oleg-mazur-time-for-relax-itx27s-time-to-take-a-break-and-relax-299791.mp3',
    'sigmamusicart-relaxing-relax-background-music-537728.mp3'    ];
    //  = ["cm4.mp3","cp2.mp3","fb5.mp3","gg6.mp3",
    //   "om1.mp3",
    //   "py7.mp3",
    //   "ru8.mp3",
    //   "sl9.mp3",
    //   "sm3.mp3",
    // ];


    if (this.site?.titolare) {
      this.titleService.setTitle(this.site.titolare.name);
    }
  }

  @ViewChild(CHeader) headerComponent?: CHeader;


  ngOnInit(): void {
    this.lastSyncedRoutePath = this.router.url.split('?')[0];
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const routePath = event.urlAfterRedirects.split('?')[0];
        if (routePath === this.lastSyncedRoutePath) {
          return;
        }
        this.lastSyncedRoutePath = routePath;
        this.syncSectionFromRoute();
      }
    });
    // this.updateActiveSectionFromScroll();
  }


  @HostListener('window:scroll')
  onWindowScroll() {
    // this.updateActiveSectionFromScroll();
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
    const activeSection = current ?? this.sectionIds[0];
    this.headerComponent?.setParams(activeSection, false);
    if (current==undefined) {return;}
    if (this.isSyncingSectionFromRoute) {return;}

    const currentPath = this.router.url.split('?')[0];
    console.log(`currentPath: ${currentPath}`);
    if (!this.siteService.routePathToSection(currentPath)) {
      return;
    }

    if (activeSection !== this.lastUrlSection) {
      this.lastUrlSection = activeSection;
      const routePath = this.siteService.sectionToRoutePath(activeSection);
      const currentQueryParams = this.router.parseUrl(this.router.url).queryParams;
      const urlTree = this.router.createUrlTree([routePath], {
        queryParams: currentQueryParams,
      });
      const nextUrl = this.router.serializeUrl(urlTree);
      console.log(`nextUrl: ${nextUrl}`);
      if (this.location.path(true) !== nextUrl) {
        this.location.replaceState(nextUrl);
      }
    }
    // this.activeSection = current ?? this.sectionIds[0];
  }

  private syncSectionFromRoute() {
    const currentPath = this.router.url.split('?')[0];
    const sectionId = this.siteService.routePathToSection(currentPath);
    if (!sectionId) {
      return;
    }

    this.isSyncingSectionFromRoute = true;
    this.lastUrlSection = sectionId;
    setTimeout(() => {
      this.siteService.scrollToSectionOnly(sectionId);
      setTimeout(() => {
        this.isSyncingSectionFromRoute = false;
      }, 350);
    });
  }

}
