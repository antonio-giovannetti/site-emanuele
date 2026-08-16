// ============================================================================
// ANGULAR SEO SERVICE FOR HASH-BASED ROUTING
// Copy this file into your Angular project: src/app/services/seo.service.ts
// ============================================================================

import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

/**
 * Service to manage SEO for each route in an Angular SPA
 * Works with hash-based routing (#/page)
 *
 * Usage in your components:
 *
 * constructor(private seoService: SeoService) {}
 *
 * ngOnInit() {
 *   this.seoService.setPageMeta(
 *     'Page Title | Brand',
 *     'Meta description here',
 *     'keyword1, keyword2',
 *     'https://site.com/image.jpg'
 *   );
 * }
 */

export interface SeoMetadata {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
    author?: string;
    robots?: string;
    canonical?: string;
    locale?: string;
    twitterHandle?: string;
}

@Injectable({
    providedIn: 'root'
})
export class SeoService {
    private readonly siteUrl = 'https://psicoterapeutaceci.eu';
    private readonly siteName = 'Dr. Ceci - Psicoterapeuta';
    private readonly defaultImage = 'https://psicoterapeutaceci.eu/assets/og-image.jpg';
    private readonly twitterHandle = '@Dottoressa_Ceci'; // Update with your Twitter handle

    constructor(
        private titleService: Title,
        private metaService: Meta,
        private router: Router
    ) {
        this.initializeRouteListener();
    }

    /**
     * Optional: Listen to route changes and reset meta tags
     * This helps ensure meta tags are fresh on each navigation
     */
    private initializeRouteListener(): void {
        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd)
            )
            .subscribe(() => {
                // Reset scroll position on route change
                window.scrollTo(0, 0);
            });
    }

    /**
     * MAIN METHOD: Set all SEO metadata for a page
     * Call this in ngOnInit() of each component
     *
     * Example:
     * this.seoService.setPageMeta(
     *   'Chi Sono | Dr.ssa Ceci Psicoterapeuta',
     *   'Scopri la mia formazione e specializzazioni in psicoterapia',
     *   'psicoterapeuta roma, terapia roma',
     *   'assets/ceci-profile.jpg'
     * );
     */
    public setPageMeta(
        title: string,
        description: string,
        keywords?: string,
        image?: string,
        author?: string,
        locale: string = 'it_IT'
    ): void {
        // Set browser title
        this.titleService.setTitle(title);

        // Remove existing meta tags to avoid duplicates
        this.removeMetaTag('description');
        this.removeMetaTag('keywords');
        this.removeMetaTag('og:title');
        this.removeMetaTag('og:description');
        this.removeMetaTag('og:image');
        this.removeMetaTag('twitter:title');
        this.removeMetaTag('twitter:description');
        this.removeMetaTag('twitter:image');

        // Set basic meta tags
        this.metaService.updateTag({
            name: 'description',
            content: description
        });

        if (keywords) {
            this.metaService.updateTag({
                name: 'keywords',
                content: keywords
            });
        }

        if (author) {
            this.metaService.updateTag({
                name: 'author',
                content: author
            });
        }

        // Set robots meta tag (default: allow indexing)
        this.metaService.updateTag({
            name: 'robots',
            content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
        });

        // Open Graph tags (for social sharing)
        this.metaService.updateTag({
            property: 'og:title',
            content: title
        });

        this.metaService.updateTag({
            property: 'og:description',
            content: description
        });

        this.metaService.updateTag({
            property: 'og:type',
            content: 'website'
        });

        this.metaService.updateTag({
            property: 'og:locale',
            content: locale
        });

        this.metaService.updateTag({
            property: 'og:site_name',
            content: this.siteName
        });

        // Set image (use provided image or default)
        const ogImage = image || this.defaultImage;
        this.metaService.updateTag({
            property: 'og:image',
            content: ogImage
        });

        this.metaService.updateTag({
            property: 'og:image:width',
            content: '1200'
        });

        this.metaService.updateTag({
            property: 'og:image:height',
            content: '630'
        });

        // Twitter Card tags
        this.metaService.updateTag({
            name: 'twitter:card',
            content: 'summary_large_image'
        });

        this.metaService.updateTag({
            name: 'twitter:title',
            content: title
        });

        this.metaService.updateTag({
            name: 'twitter:description',
            content: description
        });

        this.metaService.updateTag({
            name: 'twitter:image',
            content: ogImage
        });

        if (this.twitterHandle) {
            this.metaService.updateTag({
                name: 'twitter:creator',
                content: this.twitterHandle
            });
        }

        // Add structured data (JSON-LD)
        this.addStructuredData();
    }

    /**
     * Set meta tags for a service/article page
     * Includes additional business/article-specific metadata
     */
    public setServicePageMeta(
        title: string,
        description: string,
        serviceType: string,
        price?: string,
        duration?: string,
        image?: string,
        keywords?: string
    ): void {
        this.setPageMeta(title, description, keywords, image);

        // Add service-specific Open Graph
        this.metaService.updateTag({
            property: 'og:type',
            content: 'business.business'
        });

        if (price) {
            this.metaService.updateTag({
                property: 'product:price:amount',
                content: price
            });

            this.metaService.updateTag({
                property: 'product:price:currency',
                content: 'EUR'
            });
        }
    }

    /**
     * Set meta tags for a blog post/article
     */
    public setArticlePageMeta(
        title: string,
        description: string,
        publishDate: string,
        modifiedDate?: string,
        author: string = 'Dr.ssa Ceci',
        category?: string,
        keywords?: string,
        image?: string
    ): void {
        this.setPageMeta(title, description, keywords, image, author);

        // Article-specific Open Graph
        this.metaService.updateTag({
            property: 'og:type',
            content: 'article'
        });

        this.metaService.updateTag({
            property: 'article:published_time',
            content: publishDate
        });

        if (modifiedDate) {
            this.metaService.updateTag({
                property: 'article:modified_time',
                content: modifiedDate
            });
        }

        this.metaService.updateTag({
            property: 'article:author',
            content: author
        });

        if (category) {
            this.metaService.updateTag({
                property: 'article:section',
                content: category
            });
        }
    }

    /**
     * Add JSON-LD structured data for search engines
     * This tells Google what type of organization this is
     */
    private addStructuredData(): void {
        const structuredData = {
            '@context': 'https://schema.org',
            '@type': 'HealthAndMedicalBusiness',
            'name': this.siteName,
            'url': this.siteUrl,
            'telephone': '+39-XXXXX-XXXXX', // Update with your phone
            'email': 'ceci@psicoterapeutaceci.eu', // Update with your email
            'address': {
                '@type': 'PostalAddress',
                'streetAddress': 'Via XXXXX, XXX',
                'addressLocality': 'Roma',
                'addressRegion': 'Lazio',
                'postalCode': '00100',
                'addressCountry': 'IT'
            },
            'image': this.defaultImage,
            'areaServed': ['Roma', 'Lazio', 'Online'],
            'availableLanguage': ['it', 'en'],
            'medicalSpecialty': 'Psychotherapy',
            'knowsAbout': ['Anxiety', 'Depression', 'Trauma', 'Stress']
        };

        // Create or update script tag
        const scriptId = 'seo-structured-data';
        let scriptTag: HTMLScriptElement | null = document.getElementById(scriptId) as HTMLScriptElement | null;

        if (!scriptTag) {
            scriptTag = document.createElement('script');
            scriptTag.id = scriptId;
            scriptTag.type = 'application/ld+json';
            document.head.appendChild(scriptTag);
        }

        scriptTag.innerHTML = JSON.stringify(structuredData);
    }

    /**
     * Helper method: Remove a meta tag by name or property
     */
    private removeMetaTag(selector: string): void {
        const existingTag = document.querySelector(`meta[name="${selector}"], meta[property="${selector}"]`);
        if (existingTag) {
            existingTag.remove();
        }
    }

    /**
     * UTILITY: Get the current page title
     */
    public getPageTitle(): string {
        return this.titleService.getTitle();
    }

    /**
     * UTILITY: Set page as non-indexable (for private pages)
     */
    public setNoIndex(): void {
        this.metaService.updateTag({
            name: 'robots',
            content: 'noindex, nofollow'
        });
    }

    /**
     * UTILITY: Set canonical URL (for duplicate content issues)
     */
    public setCanonical(url: string): void {
        let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
        if (!link) {
            link = document.createElement('link');
            link.setAttribute('rel', 'canonical');
            document.head.appendChild(link);
        }
        link.setAttribute('href', url);
    }

    /**
     * UTILITY: Set language alternates (for multilingual sites)
     */
    public setLanguageAlternate(lang: string, url: string): void {
        let link: HTMLLinkElement | null = document.querySelector(`link[rel="alternate"][hreflang="${lang}"]`) as HTMLLinkElement | null;
        if (!link) {
            link = document.createElement('link');
            link.setAttribute('rel', 'alternate');
            link.setAttribute('hreflang', lang);
            document.head.appendChild(link);
        }
        link.setAttribute('href', url);
    }

    /**
     * Reset meta tags to default (for empty/loading states)
     */
    public resetToDefault(): void {
        this.setPageMeta(
            this.siteName,
            'Psicoterapeuta specializzata in ansia, depressione e trauma a Roma'
        );
    }
}