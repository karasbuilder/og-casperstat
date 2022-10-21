export type FileType = 'png' | 'jpeg';
export type Theme = 'light' | 'dark';
export type ContentType = 'default'|'content'|'detail';

export interface ParsedRequest {
    fileType: FileType;
    cardName: string;
    content: string;
   contentType:string,
    nameDetail:string,
    footerURL: string;
    theme: Theme;
    md: boolean;
    images: string[];
}
export interface IRenderContent {
    cardName?: string
    images: string[]
    content:string
    nameDetail:string
   contentType:string
    md: boolean
  
}

export interface IRenderWithTitle{
    images: string[] 
    cardName: string
    content:string
    md: boolean, 
   
}
export interface IRenderWithContentDetail {
    cardName:string
    nameDetail:string
    images:string[]
    content:string
    md:boolean
}