// // Service Worker for handling Web Push Notifications
// self.addEventListener('push', function (event) {
//     if (event.data) {
//         const data = event.data.json();
//         const options = {
//             body: data.body,
//             icon: '/icon.png', // Add a general icon if desired
//             badge: '/favicon.ico',
//             vibrate: [100, 50, 100],
//             data: {
//                 dateOfArrival: Date.now(),
//                 primaryKey: '2'
//             }
//         };
//         event.waitUntil(
//             self.registration.showNotification(data.title, options)
//         );
//     }
// });

// self.addEventListener('notificationclick', function (event) {
//     console.log('[Service Worker] Notification click Received.');
//     event.notification.close();
//     event.waitUntil(
//         clients.openWindow('https://jobsculptor.vercel.app/tracker') // Open the tracker when clicked
//     );
// });
// Service Worker for handling Web Push Notifications

self.addEventListener('push', function (event) {
    if (event.data) {
        const data = event.data.json();

        const options = {
            body: data.body,
            icon: '/icon.png',
            badge: '/favicon.ico',
            vibrate: [100, 50, 100],
            data: {
                url: '/tracker'   // ✅ dynamic path
            }
        };

        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// =========================
// FIXED CLICK HANDLER
// =========================
self.addEventListener('notificationclick', function (event) {
    console.log('[Service Worker] Notification click Received.');

    event.notification.close();

    // ✅ Use dynamic origin (VERY IMPORTANT)
    const urlToOpen = new URL(
        event.notification.data.url || '/',
        self.location.origin
    ).href;

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(windowClients => {
                for (let client of windowClients) {
                    if (client.url === urlToOpen && 'focus' in client) {
                        return client.focus();
                    }
                }
                return clients.openWindow(urlToOpen);
            })
    );
});