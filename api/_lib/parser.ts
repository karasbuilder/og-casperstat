import { IncomingMessage } from 'http';
import { parse } from 'url';
import { ParsedRequest, Theme } from './types';

export function parseRequest(req: IncomingMessage) {
    console.log('HTTP ' + req.url);
    const { pathname, query } = parse(req.url || '/', true);
    const { footerURL, images, theme, md, content ,contentType,nameDetail} = (query || {});

    if (Array.isArray(theme)) {
        throw new Error('Expected a single theme');
    }
    
    const arr = (pathname || '/').slice(1).split('.');
    let extension = '';
    let cardName = '';
    if (arr.length === 0) {
        cardName = '';
    } else if (arr.length === 1) {
        cardName = arr[0];
    } else {
        extension = arr.pop() as string;
        cardName = arr.join('.');
    }

    let url = getString(footerURL);
   
    const parsedRequest: ParsedRequest = {
        fileType: extension === 'jpeg' ? extension : 'png',
        cardName: decodeURIComponent(cardName),
        content: getString(content),
        contentType:getString(contentType),
        footerURL: decodeURIComponent(url),
        nameDetail:getString(nameDetail),
        theme: theme === 'dark' ? 'dark' : 'light',
        md: md === '1' || md === 'true',
        images: getArray(images),
    };
    parsedRequest.images = getDefaultImages(parsedRequest.images, parsedRequest.theme);
    return parsedRequest;
}

function getArray(stringOrArray: string[] | string | undefined): string[] {
    if (typeof stringOrArray === 'undefined') {
        return [];
    } else if (Array.isArray(stringOrArray)) {
        return stringOrArray;
    } else {
        return [stringOrArray];
    }
}

function getString(stringOrArray: string[] | string | undefined) {
    if (stringOrArray && Array.isArray(stringOrArray)) {
        if (stringOrArray.length === 0) {
            return ''
        } else {
            return stringOrArray[0]
        }
    } else {
        return stringOrArray ?? ''
    }
}

function getDefaultImages(images: string[], theme: Theme): string[] {
    const defaultImage = theme === 'light'
        ? "https://casperstats.io/casperstats_logo.svg"
        : "https://casperstats.io/casperstats_logo_dark.svg";

    if (!images || !images[0]) {
        return [defaultImage];
    }

    return images;
}

