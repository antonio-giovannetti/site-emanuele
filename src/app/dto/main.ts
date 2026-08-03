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
    image: string;
    description: string;
    email?: string;
    ordine: string;
    formazione: string[]
    spec: string[]
}


export interface Servizio {
    icon?: string;
    title?: string;
    description?: string;
    cost?: number;
}

export interface Image {
    src?: string;
    caption: string;
    date?: Date;
}



export interface Webinar {
    title: string;
    description: string;
    utcDate: Date
    people: number
    extra: string
    args: string[]
    price: number
}

export interface ProcessStep {
    title: string;
    description: string;
}

export interface Settings {
    autoPlayAudio: boolean;
    autoPlayVideo: boolean;
}

export interface Site {

    settings: Settings;

    title: string;
    subtitle: string;
    titolare: Titolare;
    contatto: Contatto;
    servizi?: Servizio[];
    webinars: Webinar[];
    process: ProcessStep[];
    cert?: Image[];

}


