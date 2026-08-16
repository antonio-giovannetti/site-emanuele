export interface Contatto {
    indirizzo1: string;
    indirizzo2: string;
    indirizzo3: string;
    tel: string;
    cell: string;
    email?: string;
    pec?: string;
    orari?: string[];
}


export interface Titolare {
    contatto: Contatto;
    name: string;
    sub1: string;
    sub2?: string;
    image: string;
    description: string;
    email?: string;
    ordine: string;
    linkOrdine: string;
    formazione: string[]
    spec: string[]
    certs: Media[]
}


export interface Servizio {
    icon?: string;
    title?: string;
    description?: string;
    cost?: number;
}

export interface Media {
    src?: string;
    thumb?: string;
    caption: string;
    date?: Date;
    type: 'VIDEO' | 'IMAGE' |' AUDIO'
}

export interface Location {
    indirizzo1: string;
    indirizzo2: string;
    indirizzo3: string;
}


export interface Webinar {
    type: 'WEBINAR' | 'LIVE';
    location?: Location;
    title: string;
    description: string;
    media: Media[];
    utcDate: Date
    people: number
    extra: string
    info: string[]
    price: number
    form: boolean
}

export interface ProcessStep {
    title: string;
    description: string;
}

export interface Settings {
    autoPlayAudio: boolean;
    autoPlayVideo: boolean;
    showAforisma: 'random' | number;

}

export interface Aforisma {
    text: string;
    author: string;
}

export interface Social {
    name: string;
    icon: string;
    link: string;
}


export interface Site {

    settings: Settings;
    social: Social[];
    aforismi?: Aforisma[];
    title: string;
    subtitle: string;
    titolare: Titolare;
    contatto: Contatto;
    servizi?: Servizio[];
    webinars: Webinar[];
    process: ProcessStep[];
    cert?: Media[];

}


