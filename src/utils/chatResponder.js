/**
 * Utility for generating simulated chat responses.
 */

// Simple mock user list to simulate responses from different team members
const MOCK_AVATARS = [
    { name: 'Priya', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya1' },
    { name: 'Rahul', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul2' },
    { name: 'Ananya', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya3' },
    { name: 'Vikram', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram4' },
    { name: 'Deepa', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Deepa5' },
];

// Contextual responses based on the chat group
const CONTEXT_RESPONSES = {
    'general': [
        "That's great!",
        "Awesome progress team 🚀",
        "Keep it up everyone!",
        "Agreed! Definitely need more coffee today ☕",
        "Nice! Anyone joining the virtual stretch session at 3?",
    ],
    'it-team': [
        "Has anyone checked the latest deployment?",
        "My steps are low today... stuck debugging 🐛",
        "I need a walking pad for my standing desk.",
        "That's a clever solution!",
        "I'll look into it after my lunch walk.",
    ],
    'step-warriors': [
        "Is there a new challenge starting next week?",
        "I just hit my 10k goal! 🎉",
        "My legs are sore but it's worth it!",
        "Let's crush Team Mumbai this week!!",
        "What's everyone's favorite running shoe right now?",
    ],
    'chess-club': [
        "Anyone up for a blitz game?",
        "That was a tough endgame!",
        "I blundered my queen again 🤦‍♂️",
        "Good game! Let's rematch later.",
        "Checkmate in 3, can anyone spot it?",
    ],
    'walking-buddies': [
        "Are we meeting at the park today?",
        "The weather is perfect for a walk right now ☀️",
        "I brought some healthy snacks for the group!",
        "Who wants to join my evening route?",
        "Let's try to increase our pace today.",
    ]
};

// Generic fallback responses
const GENERIC_RESPONSES = [
    "Oh really?",
    "Haha, good one! 😄",
    "I completely agree.",
    "Sounds like a plan!",
    "Interesting point.",
];

/**
 * Generates a simulated response based on the group context.
 * @param {string} groupId - The ID of the active chat group.
 * @param {string} [triggerMessage] - The message that triggered the response (for future advanced NLP context).
 * @returns {object} { text, user, avatar }
 */
export const generateResponse = (groupId, triggerMessage = '') => {
    // 1. Pick a random user
    const randomUser = MOCK_AVATARS[Math.floor(Math.random() * MOCK_AVATARS.length)];

    // 2. Determine response pool based on group context
    let responsePool = CONTEXT_RESPONSES[groupId];

    // Fallback if group ID is not found
    if (!responsePool || responsePool.length === 0) {
        responsePool = GENERIC_RESPONSES;
    }

    // 3. Pick a random response from the pool
    const randomText = responsePool[Math.floor(Math.random() * responsePool.length)];

    return {
        text: randomText,
        user: randomUser.name,
        avatar: randomUser.avatar
    };
};
