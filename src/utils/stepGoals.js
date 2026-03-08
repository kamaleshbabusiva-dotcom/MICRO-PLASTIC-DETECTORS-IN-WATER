// Step goal calculation engine
// Personalizes daily step targets based on age, profession, ability, and experience level

const AGE_MULTIPLIERS = {
    '18-25': 1.2,
    '26-35': 1.0,
    '36-45': 0.9,
    '46-55': 0.8,
    '56-65': 0.65,
    '65+': 0.5,
}

const PROFESSION_TARGETS = {
    'IT / Software': { base: 5000, label: 'Desk Job - IT', sitting: 8 },
    'Accounting / Finance': { base: 5000, label: 'Desk Job - Finance', sitting: 8 },
    'Marketing / Creative': { base: 6000, label: 'Semi-Active', sitting: 6 },
    'Sales (Office)': { base: 7000, label: 'Active Office', sitting: 5 },
    'Sales (Field)': { base: 12000, label: 'Field Work', sitting: 2 },
    'HR / Admin': { base: 5500, label: 'Desk Job - Admin', sitting: 7 },
    'Management': { base: 6000, label: 'Semi-Active', sitting: 6 },
    'Healthcare': { base: 10000, label: 'Active', sitting: 3 },
    'Education / Training': { base: 8000, label: 'Moderately Active', sitting: 4 },
    'Logistics / Warehouse': { base: 13000, label: 'Very Active', sitting: 1 },
    'Customer Support': { base: 4500, label: 'Sedentary', sitting: 8 },
    'Other': { base: 6000, label: 'General', sitting: 5 },
}

const LEVEL_MULTIPLIERS = {
    'Beginner': 0.7,
    'Intermediate': 1.0,
    'Advanced': 1.3,
}

const DISABILITY_ADJUSTMENTS = {
    'None': 1.0,
    'Mild mobility': 0.7,
    'Moderate mobility': 0.5,
    'Wheelchair user': 0.3,
    'Visual impairment': 0.8,
    'Chronic pain': 0.6,
    'Heart condition': 0.5,
    'Other': 0.7,
}

export const calculateStepGoal = (profile) => {
    const { age, profession, level, disability } = profile

    const ageRange = getAgeRange(age)
    const ageMult = AGE_MULTIPLIERS[ageRange] || 1.0
    const profData = PROFESSION_TARGETS[profession] || PROFESSION_TARGETS['Other']
    const levelMult = LEVEL_MULTIPLIERS[level] || 1.0
    const disabilityMult = DISABILITY_ADJUSTMENTS[disability] || 1.0

    const dailyGoal = Math.round(profData.base * ageMult * levelMult * disabilityMult)
    const weeklyGoal = dailyGoal * 7
    const monthlyGoal = dailyGoal * 30

    return {
        daily: dailyGoal,
        weekly: weeklyGoal,
        monthly: monthlyGoal,
        professionLabel: profData.label,
        sittingHours: profData.sitting,
        ageRange,
        level,
    }
}

const getAgeRange = (age) => {
    if (age <= 25) return '18-25'
    if (age <= 35) return '26-35'
    if (age <= 45) return '36-45'
    if (age <= 55) return '46-55'
    if (age <= 65) return '56-65'
    return '65+'
}

export const getZone = (rank) => {
    if (rank <= 10) return { name: 'Emerald', emoji: '💎', color: 'emerald', gradient: 'from-emerald-500 to-teal-500' }
    if (rank <= 20) return { name: 'Platinum', emoji: '💠', color: 'indigo', gradient: 'from-indigo-400 to-purple-500' }
    if (rank <= 50) return { name: 'Gold', emoji: '🥇', color: 'amber', gradient: 'from-amber-400 to-yellow-500' }
    if (rank <= 100) return { name: 'Silver', emoji: '🥈', color: 'gray', gradient: 'from-gray-400 to-slate-500' }
    return { name: 'Bronze', emoji: '🥉', color: 'orange', gradient: 'from-amber-700 to-orange-800' }
}

export const getPromotionStatus = (rank, totalUsers) => {
    if (rank <= 10) return { zone: 'Emerald', isPromotion: false, isDemotion: false, label: 'Top Zone 👑' }

    const zoneStart = rank <= 20 ? 11 : rank <= 50 ? 21 : rank <= 100 ? 51 : 101
    const zoneEnd = rank <= 20 ? 20 : rank <= 50 ? 50 : rank <= 100 ? 100 : totalUsers

    const posInZone = rank - zoneStart + 1
    const zoneSize = zoneEnd - zoneStart + 1

    if (posInZone <= 10) return { isPromotion: true, isDemotion: false, label: 'Promotion Zone 📈' }
    if (posInZone > zoneSize - 10) return { isPromotion: false, isDemotion: true, label: 'Demotion Risk ⚠️' }
    return { isPromotion: false, isDemotion: false, label: 'Safe Zone ✨' }
}

export const PROFESSIONS = Object.keys(PROFESSION_TARGETS)
export const DISABILITIES = Object.keys(DISABILITY_ADJUSTMENTS)
export const LEVELS = Object.keys(LEVEL_MULTIPLIERS)
export const AGE_RANGES = Object.keys(AGE_MULTIPLIERS)
