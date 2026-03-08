/**
 * Safety filter utility for content moderation. 
 * Detects harassment, inappropriate language, and prohibited topics.
 */

// Basic list of keywords and patterns for demonstration. 
// In a real-world app, this would use a more sophisticated AI model or a larger database.
const RESTRICTED_PATTERNS = [
    // Harassment & Hate Speech
    /\bhate\b/i,
    /\babuse\b/i,
    /\bharass\b/i,
    /\bbully\b/i,
    /\battack\b/i,
    // Nudity & Inappropriate Content
    /\bnude\b/i,
    /\bnudity\b/i,
    /\bsex\b/i,
    /\bporn\b/i,
    /\berotic\b/i,
    /\badult\s+content\b/i,
    // Generic profanity (examples)
    /\bfuck\b/i,
    /\bshit\b/i,
];

/**
 * Checks if the given text contains any restricted patterns.
 * @param {string} text - The content to validate.
 * @returns {object} { isSafe: boolean, violatorPattern: string | null }
 */
export const checkContent = (text) => {
    if (!text) return { isSafe: true, violatorPattern: null };

    for (const pattern of RESTRICTED_PATTERNS) {
        if (pattern.test(text)) {
            return {
                isSafe: false,
                violatorPattern: pattern.toString()
            };
        }
    }

    return { isSafe: true, violatorPattern: null };
};
