import {
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithPhoneNumber,
    RecaptchaVerifier,
    signOut
} from 'firebase/auth'
import { auth } from './config'

// ── Google Sign-In ──────────────────────────────────────────────
const googleProvider = new GoogleAuthProvider()
googleProvider.addScope('email')
googleProvider.addScope('profile')

export async function signInWithGoogle() {
    const result = await signInWithPopup(auth, googleProvider)
    return {
        user: result.user,
        provider: 'google'
    }
}

// ── Email / Password Sign-In ────────────────────────────────────
export async function signInWithEmail(email, password) {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return {
        user: result.user,
        provider: 'email'
    }
}

// ── Email / Password Registration ───────────────────────────────
export async function registerWithEmail(email, password, displayName) {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    // Update user profile with display name
    if (displayName) {
        await updateProfile(result.user, {
            displayName,
            photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`
        })
    }
    return {
        user: result.user,
        provider: 'email'
    }
}

// ── Phone Sign-In ───────────────────────────────────────────────
export function setupRecaptcha(elementId) {
    const verifier = new RecaptchaVerifier(auth, elementId, {
        size: 'invisible',
        callback: () => {
            // reCAPTCHA solved — allow phone sign-in
        }
    })
    return verifier
}

export async function sendPhoneOTP(phoneNumber, recaptchaVerifier) {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
    return confirmationResult
}

export async function verifyPhoneOTP(confirmationResult, otp) {
    const result = await confirmationResult.confirm(otp)
    return {
        user: result.user,
        provider: 'phone'
    }
}

// ── Sign Out ────────────────────────────────────────────────────
export async function firebaseSignOut() {
    await signOut(auth)
}

// ── Helper: extract user info ───────────────────────────────────
export function extractUserInfo(firebaseUser, provider = 'email') {
    return {
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email || null,
        fullName: firebaseUser.displayName || null,
        avatarUrl: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
        phone: firebaseUser.phoneNumber || null,
        authProvider: provider
    }
}
