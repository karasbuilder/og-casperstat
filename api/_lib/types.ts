export type FileType = 'png' | 'jpeg';
export type Theme = 'light' | 'dark';
export type ContentType = 'default'|'content'|'detail';

export interface ParsedRequest {
    fileType: FileType;
    cardName: string;
    title:string;
    content: string;
   contentType:string,
    nameDetail:string,
    footerURL: string;
    theme: Theme;
    md: boolean;
    images: string[];
}
export interface IRenderContent {
    title?: string
    images: string[]
    content:string
    nameDetail:string
   contentType:string
    md: boolean
  
}

export interface IRenderWithTitle{
    images: string[] 
    title: string
    content:string
    md: boolean, 
   
}
export interface IRenderWithContentDetail {
    title:string
    nameDetail:string
    images:string[]
    content:string
    md:boolean
}