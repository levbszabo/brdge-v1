// Browser detection utilities
export const getBrowserInfo = () => {
    const ua = navigator.userAgent.toLowerCase();
    const vendor = navigator.vendor?.toLowerCase() || '';

    return {
        isSafari: /^((?!chrome|android).)*safari/i.test(ua),
        isChrome: /chrome/.test(ua) && /google inc/.test(vendor),
        isFirefox: /firefox/.test(ua),
        isEdge: /edg/.test(ua),
        isMobile: /mobile|iphone|ipad|ipod|android/.test(ua),
        isIOS: /iphone|ipad|ipod/.test(ua),
        isMacOS: /macintosh|mac os x/.test(ua)
    };
};

export const isSafari = () => getBrowserInfo().isSafari;
export const isMobileSafari = () => getBrowserInfo().isSafari && getBrowserInfo().isMobile;
export const isIOS = () => getBrowserInfo().isIOS; 