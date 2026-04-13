import axios from 'axios';
import API_BASE_URL from "../config/api";

// Utility to convert Base64 string to Uint8Array for the VAPID key
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export const subscribeToPushNotifications = async () => {
    // 1. Check if Service Workers and Push are supported
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Push messaging is not supported.');
        return;
    }

    try {
        // 2. Request Notification Permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
            console.warn('Notification permission not granted.');
            return;
        }

        // 3. Register the service worker
        const register = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker Registered.');

        // Wait until service worker is ready
        await navigator.serviceWorker.ready;

        // 4. Get the public VAPID key from the backend
        const { data: vapidPublicKey } = await axios.get(`${API_BASE_URL}/api/notifications/vapidPublicKey`);
        const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

        // 5. Subscribe to PushManager
        const subscription = await register.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey
        });

        // 6. Send the subscription object to the backend
        const token = localStorage.getItem('token');
        if (token) {
            await axios.post(`${API_BASE_URL}/api/notifications/subscribe`, subscription, {
                headers: {
                    'x-auth-token': token
                }
            });
            console.log('Push subscription successfully sent to backend.');
        } else {
            console.warn('User not logged in, cannot save push subscription.');
        }

    } catch (error) {
        console.error('Error subscribing to push notifications:', error);
    }
};
