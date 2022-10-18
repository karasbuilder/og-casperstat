export type FileType = 'png' | 'jpeg';
export type Theme = 'light' | 'dark';

export interface ParsedRequest {
    fileType: FileType;
    cardName: string;
    content: string;
    typeContent:string,
    footerURL: string;
    theme: Theme;
    md: boolean;
    images: string[];
}
export interface IRenderContent {
    cardName?: string
    images: string[]
    content:string
    typeContent:string
    md: boolean
  
}

export interface IRenderWithTitle{
    images: string[] 
    cardName: string
    content:string
    md: boolean, 
   
}
export interface IRenderWithValidator {
    cardName:string
    images:string[]
    content:string
    md:boolean
}