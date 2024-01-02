import { initializeApp } from 'firebase/app';
import { getToken, getMessaging, isSupported } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: 'AIzaSyCb3sWDKxKO6eX73UUTFXR6GzD-0plGwkU',
    authDomain: 'mytest-8b33b.firebaseapp.com',
    projectId: 'mytest-8b33b',
    storageBucket: 'mytest-8b33b.appspot.com',
    messagingSenderId: '237608953386',
    appId: '1:237608953386:web:fb48036cc61dc66f810553',
};

const UrlFirebaseConfig = new URLSearchParams(
    {
        apiKey: 'AIzaSyCb3sWDKxKO6eX73UUTFXR6GzD-0plGwkU',
        authDomain: 'mytest-8b33b.firebaseapp.com',
        projectId: 'mytest-8b33b',
        storageBucket: 'mytest-8b33b.appspot.com',
        messagingSenderId: '237608953386',
        appId: '1:237608953386:web:fb48036cc61dc66f810553',
    }.toString()
);

// const swUrl = `${process.env.REACT_APP_POZ_URL}/firebase-messaging-sw.js?${UrlFirebaseConfig}`;

export const firebaseApp = initializeApp(firebaseConfig);

export const messaging = (async () => {
    try {
        const isSupportedBrowser = await isSupported();
        if (isSupportedBrowser) {
            return getMessaging(firebaseApp);
        }
        console.log('Firebase is not supported in this browser');
        return null;
    } catch (err) {
        console.log(err);
        return null;
    }
})();

export const getOrRegisterServiceWorker = () => {
    if (
        'serviceWorker' in navigator &&
        typeof window.navigator.serviceWorker !== 'undefined'
    ) {
        return window.navigator.serviceWorker
            .getRegistration('/firebase-push-notification-scope')
            .then((serviceWorker) => {
                if (serviceWorker) return serviceWorker;
                return window.navigator.serviceWorker.register(
                    '/firebase-messaging-sw.js',
                    {
                        scope: '/firebase-push-notification-scope',
                    }
                );
            });
    }
    throw new Error('The browser doesn`t support service worker.');
};

export const getFirebaseToken = async () => {
    try {
        const messagingResolve = await messaging;
        if (messagingResolve) {
            return getOrRegisterServiceWorker().then(
                (serviceWorkerRegistration) => {
                    return Promise.resolve(
                        getToken(messagingResolve, {
                            vapidKey: process.env.REACT_APP_FB_VAPID_KEY,
                            serviceWorkerRegistration,
                        })
                    );
                }
            );
        }
    } catch (error) {
        console.log('An error occurred while retrieving token. ', error);
    }
};
