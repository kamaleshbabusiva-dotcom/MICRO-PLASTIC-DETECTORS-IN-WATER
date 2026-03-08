// Mock data for AquaPure Detect — realistic water purity and microplastic tracking data

const REGIONS = [
    'Ganges River', 'Nile Delta', 'Amazon Basin', 'Thames Estuary', 'Yangtze River', 'Mississippi River',
    'Danube Basin', 'Rhine Valley', 'Mekong Delta', 'Hudson River', 'Murray-Darling', 'Volga Delta'
]

const WATER_BODIES = [
    'River / Stream', 'Industrial Lake', 'Coastal Ocean', 'Urban Reservoir',
    'Groundwater Basin', 'Estuary', 'Wetland System', 'Arctic Melt'
]

export const generateLeaderboardUsers = (count = 120) => {
    const users = []
    for (let i = 0; i < count; i++) {
        const name = REGIONS[i % REGIONS.length]
        const suffix = i >= REGIONS.length ? ` Site-${Math.floor(i / REGIONS.length) + 1}` : ' North'
        const basePurity = Math.max(10, 98 - (i * 0.5) + Math.floor(Math.random() * 5 - 2))
        const microplastics = Math.floor((100 - basePurity) * 12.5 + Math.random() * 50)

        users.push({
            id: `site-${i + 1}`,
            rank: i + 1,
            name: `${name}${suffix}`,
            avatar: `https://api.dicebear.com/7.x/shapes/svg?seed=${name}${i}`,
            steps: microplastics, // Reusing field name for compatibility, but it's microplastics/L
            purity: basePurity,
            profession: WATER_BODIES[i % WATER_BODIES.length],
            streak: Math.max(0, Math.floor(Math.random() * 30)),
            weeklySteps: microplastics * 7 + Math.floor(Math.random() * 100),
            monthlySteps: microplastics * 30 + Math.floor(Math.random() * 500),
            bonusPoints: Math.floor(basePurity * 5),
            freezeDays: Math.floor(Math.random() * 3),
        })
    }
    return users.sort((a, b) => b.purity - a.purity).map((u, i) => ({ ...u, rank: i + 1 }))
}

export const leaderboardUsers = generateLeaderboardUsers()

export const currentUserProfile = {
    id: 'demo-inspector-001',
    name: 'Inspector Arjun Mehta',
    email: 'arjun.mehta@waterwatch.org',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun',
    age: 'Level 4 Senior Inspector',
    profession: 'Urban Reservoir Specialist',
    level: 'Expert',
    disability: 'None',
    emergencyContact: {
        name: 'Pollution Control Board',
        phone: '+91-1800-WATER-SOS',
        relation: 'Official Agency',
    },
    favoriteLocations: [
        { name: 'Kaveri River - Zone A', lat: 12.9716, lng: 77.5946 },
        { name: 'Bellandur Lake Site', lat: 12.9352, lng: 77.6245 },
        { name: 'Hesaraghatta Reservoir', lat: 12.9698, lng: 77.6009 },
    ],
    stepGoal: { daily: 95, weekly: 92, monthly: 90 }, // Purity Target %
    bonusPoints: 850,
    freezeDays: 2,
    streak: 12,
}

// Generate realistic purity data for the past 30 days
export const generateStepHistory = (dailyGoal = 95) => {
    const days = []
    const today = new Date()
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const basePurity = 85 + Math.random() * 14
        days.push({
            date: date.toISOString().split('T')[0],
            dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
            steps: Math.round(basePurity), // Reading as Purity %
            goal: dailyGoal,
            achieved: basePurity >= dailyGoal,
        })
    }
    return days
}

export const stepHistory = generateStepHistory(95)

export const todaySteps = stepHistory[stepHistory.length - 1]

export const weeklySteps = 94.2 // Avg Purity
export const monthlySteps = 91.8 // Avg Purity

export const achievements = [
    { id: 1, title: 'Clean Water Act', description: 'Complete 30 days of monitoring', icon: '💧', earned: true, date: '2024-01-15' },
    { id: 2, title: 'Microplastic Hunter', description: 'Detect and report 500 particles', icon: '🔍', earned: true, date: '2024-01-22' },
    { id: 3, title: 'Sentinel Status', description: 'Reach top 10 in regional purity', icon: '🛡️', earned: true, date: '2024-02-01' },
    { id: 4, title: 'Zero Pollution Day', description: 'Monitor a source with 99.9% purity', icon: '✨', earned: true, date: '2024-02-10' },
    { id: 5, title: 'Voice of the River', description: 'Submit 10 verified complaints', icon: '🗣️', earned: true, date: '2024-02-15' },
    { id: 6, title: 'Crisis Averted', description: 'Identify an industrial leak early', icon: '🚨', earned: false, progress: 3, target: 5 },
    { id: 7, title: 'Ocean Guardian', description: 'Analyze 200,000 liters of water', icon: '🌊', earned: false, progress: 150000, target: 200000 },
    { id: 8, title: 'Global Emissary', description: 'Post quality findings for 3 continents', icon: '🌍', earned: false, progress: 1, target: 3 },
    { id: 9, title: 'Resilience Master', description: 'Maintain monitoring during heavy storms', icon: '⛈️', earned: false, progress: 12, target: 30 },
    { id: 10, title: 'Community Leader', description: 'Organize a local lake cleanup', icon: '🤝', earned: false, progress: 0, target: 1 },
]

export const chatGroups = [
    { id: 'global-power-stations', name: '⚡ Global Power Station Hub', members: 1250, unread: 24 },
    { id: 'hydro-plant-monitoring', name: '🏭 Hydro Plant Monitoring', members: 85, unread: 12 },
    { id: 'thermal-water-cooling', name: '🌊 Thermal Cooling Reservoirs', members: 420, unread: 0 },
    { id: 'microplastic-r-d', name: '🔬 Microplastic R&D (Energy Sector)', members: 318, unread: 5 },
    { id: 'industrial-audit', name: '🏭 Industrial Audit Team', members: 42, unread: 0 },
]

export const neighborhoodGroups = [
    { id: 'street-watch', name: '🏘️ Street Watch - Sector 4', members: 154, unread: 8 },
    { id: 'neighborhood-safety', name: '🛡️ Neighborhood Safety', members: 89, unread: 3 },
    { id: 'local-water-talk', name: '🚰 Local Water Status', members: 210, unread: 0 },
    { id: 'garden-community', name: '🌿 Green Gardeners', members: 45, unread: 1 },
]

export const chatMessages = [
    { id: 1, user: 'Priya', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya1', text: 'Detected a spike in microfibers at Site-14 🚨', time: '10:30 AM', isOwn: false },
    { id: 2, user: 'You', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun', text: 'Confirmed on my sensor too. Running a detailed chemical analysis now.', time: '10:32 AM', isOwn: true },
    { id: 3, user: 'Rahul', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul2', text: 'Does anyone have the latest turbidity calibration for Yangtze sites?', time: '10:35 AM', isOwn: false },
    { id: 4, user: 'Ananya', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya3', text: 'The new sonar detection model is working perfectly for micro-fragments!', time: '10:40 AM', isOwn: false },
    { id: 5, user: 'Vikram', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram4', text: 'Alert: Heavy runoff expected in Ganges North. Prepare sensors.', time: '10:45 AM', isOwn: false },
    { id: 6, user: 'You', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun', text: 'Sensors deployed and shielded. Ready for data capture. 🛡️', time: '10:47 AM', isOwn: true },
    { id: 7, user: 'Deepa', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Deepa5', text: 'Site-32 just hit 99.8% purity after the restoration project!! 💎', time: '11:00 AM', isOwn: false },
]

export const neighborhoodMessages = [
    { id: 1, user: 'Mrs. Sharma', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sharma', text: 'Is anyone else getting a slight metallic taste in the tap water today? 🧐', time: '09:15 AM', isOwn: false },
    { id: 2, user: 'Karthik', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karthik', text: 'Yes! I just ran a test on my home scanner, microplastic count is up by 15%.', time: '09:20 AM', isOwn: false },
    { id: 3, user: 'Mrs. Sharma', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sharma', text: 'Oh dear, I better boil the water for 10 minutes then. Glad we have the app!', time: '09:22 AM', isOwn: false },
    { id: 4, user: 'Amit', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit', text: 'I reported it to the authorities via the dashboard. They should look at it soon.', time: '09:45 AM', isOwn: false },
    { id: 5, user: 'You', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun', text: 'The authorities are onto it! Just saw an update in the global feed. 🛡️', time: '10:00 AM', isOwn: true },
]

export const groupChallenges = [
    {
        id: 1,
        name: 'Ganges Restoration Sprint',
        teamA: { name: 'Team North', purity: 94.5, members: 15, avatar: '🏔️' },
        teamB: { name: 'Team South', purity: 91.2, members: 15, avatar: '🌊' },
        endsIn: '3 days',
        prize: 'Environmental Excellence Award',
        status: 'active',
    },
    {
        id: 2,
        name: 'Zero Microplastic Challenge',
        teamA: { name: 'Urban Reservoirs', purity: 88.4, members: 25, avatar: '🏢' },
        teamB: { name: 'Coastal Watch', purity: 85.1, members: 20, avatar: '🏖️' },
        endsIn: '5 days',
        prize: 'Advanced Purity Sensor Kit',
        status: 'active',
    },
    {
        id: 3,
        name: 'Rainy Season Readiness',
        teamA: { name: 'Delta Defenders', purity: 0, members: 8, avatar: '🌿' },
        teamB: { name: 'Valley Guardians', purity: 0, members: 10, avatar: '⛰️' },
        endsIn: 'Starts Monday',
        prize: 'Site Certification Bonus',
        status: 'upcoming',
    },
]

export const spectroscopyDatabase = [
    { id: 'PET', name: 'Polyethylene Terephthalate', peakWavelength: 1660, riskLevel: 'Medium', origin: 'Bottles, Packaging', matchConfidence: 98.5 },
    { id: 'PE', name: 'Polyethylene', peakWavelength: 1730, riskLevel: 'High', origin: 'Bags, Films', matchConfidence: 99.1 },
    { id: 'PVC', name: 'Polyvinyl Chloride', peakWavelength: 1715, riskLevel: 'Critical', origin: 'Pipes, Industrial', matchConfidence: 96.4 },
    { id: 'PP', name: 'Polypropylene', peakWavelength: 1732, riskLevel: 'Medium', origin: 'Containers, Textiles', matchConfidence: 97.8 },
    { id: 'PS', name: 'Polystyrene', peakWavelength: 1680, riskLevel: 'High', origin: 'Foam, Insulation', matchConfidence: 95.2 },
    { id: 'PA', name: 'Polyamide (Nylon)', peakWavelength: 1710, riskLevel: 'Medium', origin: 'Fishing nets, Fabrics', matchConfidence: 98.0 },
    { id: 'PC', name: 'Polycarbonate', peakWavelength: 1650, riskLevel: 'High', origin: 'Electronics, CDs', matchConfidence: 94.6 },
    { id: 'PUR', name: 'Polyurethane', peakWavelength: 1690, riskLevel: 'Critical', origin: 'Sponges, Paints', matchConfidence: 92.3 }
];
