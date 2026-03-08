import { useEffect, useRef } from 'react'
import {
    Chart as ChartJS,
    CategoryScale, LinearScale, BarElement, PointElement, LineElement,
    Title, Tooltip, Legend, Filler
} from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler)

export function DailyBarChart({ data }) {
    const last7 = data.slice(-7)
    const chartData = {
        labels: last7.map(d => d.dayName),
        datasets: [
            {
                label: 'Purity %',
                data: last7.map(d => d.steps),
                backgroundColor: last7.map(d =>
                    d.achieved ? 'rgba(16, 185, 129, 0.8)' : 'rgba(59, 130, 246, 0.8)'
                ),
                borderRadius: 8,
                borderSkipped: false,
                barThickness: 28,
            },
            {
                label: 'Safety Target',
                data: last7.map(d => d.goal),
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 8,
                borderSkipped: false,
                barThickness: 28,
            },
        ],
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#94a3b8', font: { family: 'Inter' }, boxWidth: 12, padding: 20 },
            },
            tooltip: {
                backgroundColor: '#1e293b',
                titleColor: '#fff',
                bodyColor: '#94a3b8',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                cornerRadius: 12,
                padding: 12,
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#64748b', font: { family: 'Inter' } },
            },
            y: {
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { color: '#64748b', font: { family: 'Inter' } },
            },
        },
    }

    return <Bar data={chartData} options={options} />
}

export function WeeklyLineChart({ data }) {
    const weeks = []
    for (let i = 0; i < data.length; i += 7) {
        const chunk = data.slice(i, i + 7)
        weeks.push({
            label: `Week ${Math.floor(i / 7) + 1}`,
            total: chunk.reduce((s, d) => s + d.steps, 0),
            goal: chunk.reduce((s, d) => s + d.goal, 0),
        })
    }

    const chartData = {
        labels: weeks.map(w => w.label),
        datasets: [
            {
                label: 'Purity Avg',
                data: weeks.map(w => w.total / 7),
                borderColor: '#0c8ee9',
                backgroundColor: 'rgba(12, 142, 233, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#0c8ee9',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
            },
            {
                label: 'Regional Target',
                data: weeks.map(w => w.goal),
                borderColor: 'rgba(255,255,255,0.3)',
                borderDash: [5, 5],
                fill: false,
                tension: 0.4,
                pointRadius: 0,
            },
        ],
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: { color: '#94a3b8', font: { family: 'Inter' }, boxWidth: 12, padding: 20 },
            },
            tooltip: {
                backgroundColor: '#1e293b',
                titleColor: '#fff',
                bodyColor: '#94a3b8',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                cornerRadius: 12,
                padding: 12,
                callbacks: {
                    label: (ctx) => `${ctx.dataset.label}: ${ctx.raw.toLocaleString()}%`
                },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#64748b', font: { family: 'Inter' } },
            },
            y: {
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { color: '#64748b', font: { family: 'Inter' } },
            },
        },
    }

    return <Line data={chartData} options={options} />
}

export function MonthlyAreaChart({ data }) {
    const chartData = {
        labels: data.map(d => {
            const date = new Date(d.date)
            return date.getDate()
        }),
        datasets: [
            {
                label: 'Daily Purity',
                data: data.map(d => d.steps),
                borderColor: '#10b981',
                backgroundColor: (ctx) => {
                    const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300)
                    gradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)')
                    gradient.addColorStop(1, 'rgba(16, 185, 129, 0)')
                    return gradient
                },
                fill: true,
                tension: 0.4,
                pointRadius: 2,
                pointBackgroundColor: '#10b981',
            },
            {
                label: 'Safety Threshold',
                data: data.map(d => d.goal),
                borderColor: 'rgba(255,255,255,0.2)',
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0,
            },
        ],
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: { color: '#94a3b8', font: { family: 'Inter' }, boxWidth: 12, padding: 20 },
            },
            tooltip: {
                backgroundColor: '#1e293b',
                titleColor: '#fff',
                bodyColor: '#94a3b8',
                cornerRadius: 12,
                padding: 12,
            },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { color: '#64748b', font: { family: 'Inter' } },
            },
            y: {
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { color: '#64748b', font: { family: 'Inter' } },
            },
        },
    }

    return <Line data={chartData} options={options} />
}
