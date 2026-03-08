import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCDUejvJlTq3TsHDGlc-gJdaFC_GCRrv7A',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'foxhound-6ef2f.firebaseapp.com',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'foxhound-6ef2f',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'foxhound-6ef2f.firebasestorage.app',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '182964814370',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:182964814370:web:c3704f36345063222c407b',
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-L8XGS76C5V'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

// Initialize Analytics only in browser (avoid SSR issues)
let analytics = null
if (typeof window !== 'undefined') {
    try {
        analytics = getAnalytics(app)
    } catch (e) {
        console.warn('Analytics not available:', e.message)
    }
}

export { app, auth, analytics }
