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
}

export interface ProcessStep {
    title: string;
    description: string;
}


export interface Site {

    title: string;
    subtitle: string;
    titolare?: Titolare;

    servizi?: Servizio[];
    webinar?: Webinar[];
    process?: ProcessStep[];
    cert?: Image[];

}


