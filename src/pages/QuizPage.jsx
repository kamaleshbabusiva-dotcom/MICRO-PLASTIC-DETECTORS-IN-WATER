import { useState } from 'react'
import { CheckCircle2, ChevronRight, HelpCircle, RefreshCcw, Trophy, AlertTriangle, Droplets, ShieldCheck, PieChart as PieIcon } from 'lucide-react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const questions = [
    {
        question: "What is the recognized size limit for a particle to be classified as a 'Microplastic'?",
        options: ["Under 5mm", "Under 1cm", "Under 50 microns", "Under 2mm"],
        correct: 0,
        explanation: "Microplastics are defined as plastic particles less than 5mm in diameter, often invisible to the naked eye."
    },
    {
        question: "Which of the following is the SAFEST material for storing long-term drinking water?",
        options: ["PET Plastic", "BPA-Free Plastic", "Stainless Steel or Glass", "Polycarbonate handles"],
        correct: 2,
        explanation: "Steel and glass do not leach microplastics or chemicals into the water, unlike many plastic variants."
    },
    {
        question: "What is the recommended protocol if you suspect high microplastic density in your tap water?",
        options: ["Drink it anyway", "Boil and use a high-quality filter", "Only use UV treatment", "Freeze and thaw"],
        correct: 1,
        explanation: "Boiling water can help aggregate some particles, and a high-quality (e.g., sub-micron) filter is essential for removal."
    },
    {
        question: "Where should you report a discovered local contaminated water source?",
        options: ["Social Media only", "Local Water Authorities", "Private companies", "Ignore it"],
        correct: 1,
        explanation: "Reporting to local authorities ensures official testing and containment protocols are activated."
    },
    {
        question: "How can you help reduce microplastic pollution at the source?",
        options: ["Wash synthetic clothes more often", "Use single-use plastics", "Switch to eco-friendly/natural fibers", "Dump plastic in landfills"],
        correct: 2,
        explanation: "Synthetic fibers are a major source of microplastics. Using natural fibers and eco-friendly products reduces this loading."
    }
]

const appreciationQuotes = ["Excellent observation!", "Pure brilliance!", "Correct! You're an Aqua-expert!", "Spot on!", "Great job protecting our water!"]
const motivationQuotes = ["Not quite, but keep learning!", "Every mistake is a step toward purity.", "Don't stop now, keep improving!", "Mistakes are just data points!", "Stay alert, try the next one!"]

export default function QuizPage() {
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [score, setScore] = useState(0)
    const [showScore, setShowScore] = useState(false)
    const [selectedOption, setSelectedOption] = useState(null)
    const [isAnswered, setIsAnswered] = useState(false)
    const [currentQuote, setCurrentQuote] = useState('')

    const handleOptionSelect = (index) => {
        if (isAnswered) return
        setSelectedOption(index)
        setIsAnswered(true)
        const isCorrect = index === questions[currentQuestion].correct
        if (isCorrect) {
            setScore(score + 1)
            setCurrentQuote(appreciationQuotes[Math.floor(Math.random() * appreciationQuotes.length)])
        } else {
            setCurrentQuote(motivationQuotes[Math.floor(Math.random() * motivationQuotes.length)])
        }
    }

    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
            setSelectedOption(null)
            setIsAnswered(false)
            setCurrentQuote('')
        } else {
            setShowScore(true)
        }
    }

    const restartQuiz = () => {
        setCurrentQuestion(0)
        setScore(0)
        setShowScore(false)
        setSelectedOption(null)
        setIsAnswered(false)
        setCurrentQuote('')
    }

    if (showScore) {
        const wrongAnswers = questions.length - score;
        const chartData = {
            labels: ['Correct', 'Wrong'],
            datasets: [
                {
                    data: [score, wrongAnswers],
                    backgroundColor: ['rgba(16, 185, 129, 0.6)', 'rgba(239, 68, 68, 0.6)'],
                    borderColor: ['#10b981', '#ef4444'],
                    borderWidth: 1,
                },
            ],
        };

        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-start py-10 animate-fade-in space-y-8">
                <div className="glass-card max-w-4xl w-full p-10 border-blue-500/30">
                    <div className="flex flex-col md:flex-row items-center gap-10">
                        <div className="flex-1 text-center md:text-left space-y-6">
                            <div className="relative inline-block">
                                <div className="w-24 h-24 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto md:mx-0 border-4 border-blue-500/20">
                                    <Trophy className="w-12 h-12 text-blue-400" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold text-white uppercase tracking-widest">Assessment Report</h2>
                                <p className="text-gray-400">Total Questions: {questions.length}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                                    <div className="text-xs font-bold text-emerald-400 uppercase">Correct</div>
                                    <div className="text-2xl font-black text-white">{score}</div>
                                </div>
                                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20">
                                    <div className="text-xs font-bold text-red-400 uppercase">Wrong</div>
                                    <div className="text-2xl font-black text-white">{wrongAnswers}</div>
                                </div>
                            </div>

                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                <div className="text-xs font-bold text-blue-400 uppercase mb-1">Final Tier</div>
                                <div className="text-xl font-black text-white">
                                    {score === questions.length ? 'Master Inspector 🛡️' :
                                        score >= 3 ? 'Certified Guardian 🌊' : 'Trainee Scout 🌱'}
                                </div>
                            </div>

                            <button
                                onClick={restartQuiz}
                                className="btn-primary w-full py-4 flex items-center justify-center gap-3 active:scale-95 transition-all shadow-neon-blue"
                            >
                                <RefreshCcw className="w-5 h-5" /> Retake Awareness Quiz
                            </button>
                        </div>

                        <div className="w-64 h-64 flex flex-col items-center gap-4">
                            <div className="text-sm font-bold text-gray-400 uppercase flex items-center gap-2">
                                <PieIcon className="w-4 h-4" /> Composition
                            </div>
                            <Pie
                                data={chartData}
                                options={{
                                    plugins: {
                                        legend: { display: false }
                                    },
                                    maintainAspectRatio: true
                                }}
                            />
                            <div className="flex gap-4 text-[10px] font-bold uppercase mt-2">
                                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Correct</div>
                                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500" /> Wrong</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const currentQ = questions[currentQuestion]

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <HelpCircle className="w-8 h-8 text-blue-400" /> Water Safety IQ
                    </h1>
                    <p className="text-gray-400 mt-1">Test your knowledge on microplastics and water health protocols</p>
                </div>
                <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/10 self-start md:self-auto">
                    <span className="text-xs text-gray-500 uppercase font-black">Progress</span>
                    <div className="flex gap-1.5">
                        {questions.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 w-6 rounded-full transition-all duration-500 ${i === currentQuestion ? 'bg-blue-500 w-10' :
                                        i < currentQuestion ? 'bg-emerald-500' : 'bg-white/10'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Quiz Area */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-card p-8 min-h-[400px] flex flex-col">
                        <div className="flex-1 space-y-8">
                            <div className="space-y-2">
                                <span className="text-xs font-black text-blue-500 uppercase tracking-[0.2em]">Question {currentQuestion + 1}</span>
                                <h2 className="text-2xl font-bold text-white leading-tight">
                                    {currentQ.question}
                                </h2>
                            </div>

                            <div className="grid gap-3">
                                {currentQ.options.map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleOptionSelect(index)}
                                        className={`p-4 rounded-xl text-left border transition-all flex items-center justify-between group
                                            ${selectedOption === index
                                                ? index === currentQ.correct
                                                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                                                    : 'bg-red-500/20 border-red-500 text-red-400'
                                                : isAnswered && index === currentQ.correct
                                                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                                                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                                            }
                                            ${isAnswered && 'cursor-default'}
                                        `}
                                    >
                                        <span className="font-semibold">{option}</span>
                                        {isAnswered && index === currentQ.correct && (
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                        )}
                                        {selectedOption === index && index !== currentQ.correct && (
                                            <AlertTriangle className="w-5 h-5 text-red-500" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {isAnswered && (
                            <div className="mt-8 space-y-4 animate-scale-in">
                                <div className={`p-3 rounded-xl border text-center font-bold text-sm ${selectedOption === currentQ.correct ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-red-500/10 border-red-500 text-red-400'}`}>
                                    {currentQuote}
                                </div>
                                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                                    <div className="text-[10px] text-blue-400 font-black uppercase mb-1 flex items-center gap-1">
                                        <ShieldCheck className="w-3 h-3" /> Protocol Detail
                                    </div>
                                    <p className="text-sm text-gray-400">{currentQ.explanation}</p>
                                </div>
                            </div>
                        )}

                        {isAnswered && (
                            <button
                                onClick={nextQuestion}
                                className="mt-6 btn-primary w-full py-4 flex items-center justify-center gap-2 shadow-neon-blue group"
                            >
                                {currentQuestion === questions.length - 1 ? 'View Final Report' : 'Next Protocol'}
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="glass-card p-6 bg-gradient-to-br from-blue-600/10 to-transparent border-blue-500/20">
                        <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center mb-4">
                            <Droplets className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Awareness Credits</h3>
                        <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                            Completing this quiz contributes to your **Water Security Profile** and increases your regional trust score.
                        </p>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500" style={{ width: `${(score / questions.length) * 100}%` }} />
                        </div>
                    </div>

                    <div className="glass-card p-6 space-y-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest border-b border-white/5 pb-2">Top Insights</h3>
                        <div className="space-y-3">
                            <div className="flex gap-3">
                                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                                <p className="text-[10px] text-gray-400 font-medium">90% of household tap water in some regions contains micro-fragments.</p>
                            </div>
                            <div className="flex gap-3">
                                <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                <p className="text-[10px] text-gray-400 font-medium">Standard boiling can reduce mineral-encrusted microplastics by up to 80%.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
