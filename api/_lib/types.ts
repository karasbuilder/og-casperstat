export type FileType = 'png' | 'jpeg';
export type Theme = 'light' | 'dark';

export interface ParsedRequest {
    fileType: FileType;
    cardName: string;
    valueHeader: string;
    tvl: string;
    volumeChange: string;
    footerURL: string;
    theme: Theme;
    md: boolean;
    images: string[];
}
export interface IRenderContent {
    cardName?: string
    images: string[]
    valueHeader: string
    md: boolean
  
}

export interface IRenderWithPrice {
    images: string[] 
    cardName: string
    valueHeader: string
    md: boolean, 
   
}
export interface IRenderWithoutPrice {
    images: string[] 
    cardName: string
    md: boolean
}