// Browser detection utilities
export const getBrowserInfo = () => {
    const ua = navigator.userAgent.toLowerCase();
    const vendor = navigator.vendor?.toLowerCase() || '';

    const isChrome = /chrome/.test(ua) && /google inc/.test(vendor);
    const isMobile = /mobile|iphone|ipad|ipod|android/.test(ua);

    return {
        isSafari: /^((?!chrome|android).)*safari/i.test(ua),
        isChrome: isChrome,
        isFirefox: /firefox/.test(ua),
        isEdge: /edg/.test(ua),
        isMobile: isMobile,
        isIOS: /iphone|ipad|ipod/.test(ua),
        isMacOS: /macintosh|mac os x/.test(ua),
        isAndroid: /android/.test(ua),
        isChromeMobile: isChrome && isMobile,
        // Detect any mobile browser that might have scroll issues
        isMobileWithScrollIssues: isMobile || /iphone|ipad|ipod|android/.test(ua)
    };
};

export const isSafari = () => getBrowserInfo().isSafari;
export const isMobileSafari = () => getBrowserInfo().isSafari && getBrowserInfo().isMobile;
export const isIOS = () => getBrowserInfo().isIOS;
export const isChromeMobile = () => getBrowserInfo().isChromeMobile;
export const isAndroid = () => getBrowserInfo().isAndroid;
export const isMobileWithScrollIssues = () => getBrowserInfo().isMobileWithScrollIssues; 