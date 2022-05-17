import { getAndroidDeepLink, getIOSDeepLink } from 'url-to-deep-link';

// from: https://stackoverflow.com/questions/21741841/detecting-ios-android-operating-system
const getMobileOperatingSystem = () => {
    // @ts-ignore
    const userAgent = window.navigator.userAgent || window.navigator.vendor || window.opera;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
        return 'Windows Phone';
    }

    if (/android/i.test(userAgent)) {
        return 'Android';
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    // @ts-ignore
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return 'iOS';
    }

    return 'unknown';
};

const onClick = (android: any, iOS: any, href: any, blank: any) => {
    try {
        if (getMobileOperatingSystem() === 'iOS') {
            document.location = iOS;
        } else if (getMobileOperatingSystem() === 'Android') {
            document.location = android;
        } else {
            fallback(href, blank);
        }
    } catch (err) {
        // Reload window to have correct document
        // @ts-ignore
        window.location.reload(true);

        fallback(href, blank);
    }
};

const fallback = (href: any, blank: any) => {
    // Open in same or different window the original URL
    if (blank) window.open(href, '_blank');
    else window.location = href;
};

export function openApp(href: any, event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.preventDefault();
    // Set deep links (prop => library => original url)
    const androidDeepLink = getAndroidDeepLink(href) || href;
    const iOSDeepLink = getIOSDeepLink(href) || href;

    onClick(androidDeepLink, iOSDeepLink, href, true);
}
