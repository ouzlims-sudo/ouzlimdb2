// Training Load Tracker Application
class TrainingTracker {
    constructor() {
        this.trackSessions = [];
        this.gymSessions = [];
        this.chart = null;
        
        // Initialize in the correct order
        this.loadData();
        this.loadSampleData();
        this.initializeElements();
        this.bindEvents();
        this.setDefaultDates();
        this.updateDashboard();
        this.updateHistory();
    }

    initializeElements() {
        // Navigation elements
        this.navTabs = document.querySelectorAll('.nav-tab');
        this.tabContents = document.querySelectorAll('.tab-content');
        
        // Forms
        this.trackForm = document.getElementById('trackForm');
        this.gymForm = document.getElementById('gymForm');
        
        // History tabs
        this.historyTabs = document.querySelectorAll('.history-tab');
        this.historyContents = document.querySelectorAll('.history-content');
        
        // Chart canvas
        this.chartCanvas = document.getElementById('loadTrendChart');
    }

    bindEvents() {
        // Navigation tabs
        this.navTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const tabName = e.target.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });

        // History tabs
        this.historyTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const historyType = e.target.getAttribute('data-history');
                this.switchHistoryTab(historyType);
            });
        });

        // Form submissions
        if (this.trackForm) {
            this.trackForm.addEventListener('submit', (e) => this.handleTrackSubmission(e));
        }
        
        if (this.gymForm) {
            this.gymForm.addEventListener('submit', (e) => this.handleGymSubmission(e));
        }
    }

    setDefaultDates() {
        const today = new Date().toISOString().split('T')[0];
        const trackDateInput = document.getElementById('trackDate');
        const gymDateInput = document.getElementById('gymDate');
        
        if (trackDateInput) trackDateInput.value = today;
        if (gymDateInput) gymDateInput.value = today;
    }

    loadSampleData() {
        // Only load sample data if no existing data
        if (this.trackSessions.length === 0 && this.gymSessions.length === 0) {
            // Generate sample data for the last few weeks
            const today = new Date();
            const sampleTrack = [
                {
                    id: Date.now() + 1,
                    date: this.formatDateForStorage(new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000)),
                    type: 'Track',
                    sessionType: 'Technical',
                    event: 'Shot Put',
                    implementWeight: 7.26,
                    totalThrows: 25,
                    duration: 120,
                    rpe: 6,
                    bestThrow: 15.2,
                    notes: 'Good technique work',
                    trainingLoad: 720
                },
                {
                    id: Date.now() + 2,
                    date: this.formatDateForStorage(new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000)),
                    type: 'Track',
                    sessionType: 'Competition Prep',
                    event: 'Shot Put',
                    implementWeight: 7.26,
                    totalThrows: 18,
                    duration: 90,
                    rpe: 8,
                    bestThrow: 16.1,
                    notes: 'Preparing for meet',
                    trainingLoad: 720
                },
                {
                    id: Date.now() + 5,
                    date: this.formatDateForStorage(new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000)),
                    type: 'Track',
                    sessionType: 'Volume',
                    event: 'Discus',
                    implementWeight: 2.0,
                    totalThrows: 35,
                    duration: 105,
                    rpe: 7,
                    bestThrow: 42.5,
                    notes: 'Volume session',
                    trainingLoad: 735
                }
            ];

            const sampleGym = [
                {
                    id: Date.now() + 3,
                    date: this.formatDateForStorage(new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000)),
                    type: 'Gym',
                    sessionType: 'Strength',
                    exercise: 'Back Squat',
                    sets: 4,
                    reps: 5,
                    weight: 120,
                    duration: 60,
                    rpe: 7,
                    notes: 'Good strength session',
                    trainingLoad: 420,
                    volumeLoad: 2400
                },
                {
                    id: Date.now() + 4,
                    date: this.formatDateForStorage(new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)),
                    type: 'Gym',
                    sessionType: 'Power',
                    exercise: 'Clean',
                    sets: 5,
                    reps: 3,
                    weight: 85,
                    duration: 45,
                    rpe: 8,
                    notes: 'Power development',
                    trainingLoad: 360,
                    volumeLoad: 1275
                },
                {
                    id: Date.now() + 6,
                    date: this.formatDateForStorage(today),
                    type: 'Gym',
                    sessionType: 'Special Strength',
                    exercise: 'Overhead Press',
                    sets: 3,
                    reps: 8,
                    weight: 75,
                    duration: 50,
                    rpe: 6,
                    notes: 'Upper body strength',
                    trainingLoad: 300,
                    volumeLoad: 1800
                }
            ];

            this.trackSessions = sampleTrack;
            this.gymSessions = sampleGym;
            this.saveData();
        }
    }

    switchTab(tabName) {
        if (!tabName) return;

        // Update nav tabs
        this.navTabs.forEach(tab => tab.classList.remove('active'));
        const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }

        // Update content
        this.tabContents.forEach(content => content.classList.remove('active'));
        const activeContent = document.getElementById(tabName);
        if (activeContent) {
            activeContent.classList.add('active');
        }

        // Update dashboard and history when switching to those tabs
        if (tabName === 'dashboard') {
            setTimeout(() => this.updateDashboard(), 100);
        } else if (tabName === 'history') {
            this.updateHistory();
        }
    }

    switchHistoryTab(historyType) {
        if (!historyType) return;

        this.historyTabs.forEach(tab => tab.classList.remove('active'));
        const activeHistoryTab = document.querySelector(`[data-history="${historyType}"]`);
        if (activeHistoryTab) {
            activeHistoryTab.classList.add('active');
        }

        this.historyContents.forEach(content => content.classList.remove('active'));
        const contentId = historyType === 'recent' ? 'recentSessions' : 'weeklySummary';
        const activeHistoryContent = document.getElementById(contentId);
        if (activeHistoryContent) {
            activeHistoryContent.classList.add('active');
        }

        if (historyType === 'recent') {
            this.updateRecentSessions();
        } else {
            this.updateWeeklySummary();
        }
    }

    handleTrackSubmission(e) {
        e.preventDefault();
        
        try {
            const formData = {
                id: Date.now(),
                type: 'Track',
                date: document.getElementById('trackDate').value,
                sessionType: document.getElementById('sessionType').value,
                event: document.getElementById('event').value,
                implementWeight: parseFloat(document.getElementById('implementWeight').value),
                totalThrows: parseInt(document.getElementById('totalThrows').value),
                duration: parseInt(document.getElementById('sessionDuration').value),
                rpe: parseInt(document.getElementById('sessionRPE').value),
                bestThrow: parseFloat(document.getElementById('bestThrow').value) || 0,
                notes: document.getElementById('trackNotes').value
            };

            // Validate required fields
            if (!formData.date || !formData.sessionType || !formData.event || 
                !formData.implementWeight || !formData.totalThrows || 
                !formData.duration || !formData.rpe) {
                this.showMessage('Please fill in all required fields.', 'error');
                return;
            }

            // Calculate training load
            formData.trainingLoad = formData.rpe * formData.duration;

            this.trackSessions.push(formData);
            this.saveData();
            this.showMessage('Track session logged successfully!', 'success');
            this.trackForm.reset();
            this.setDefaultDates();
            this.updateDashboard();
        } catch (error) {
            console.error('Error submitting track session:', error);
            this.showMessage('Error logging session. Please try again.', 'error');
        }
    }

    handleGymSubmission(e) {
        e.preventDefault();
        
        try {
            const formData = {
                id: Date.now(),
                type: 'Gym',
                date: document.getElementById('gymDate').value,
                sessionType: document.getElementById('gymSessionType').value,
                exercise: document.getElementById('exercise').value,
                sets: parseInt(document.getElementById('sets').value),
                reps: parseInt(document.getElementById('reps').value),
                weight: parseFloat(document.getElementById('weight').value),
                duration: parseInt(document.getElementById('gymDuration').value),
                rpe: parseInt(document.getElementById('gymRPE').value),
                notes: document.getElementById('gymNotes').value
            };

            // Validate required fields
            if (!formData.date || !formData.sessionType || !formData.exercise || 
                !formData.sets || !formData.reps || !formData.weight || 
                !formData.duration || !formData.rpe) {
                this.showMessage('Please fill in all required fields.', 'error');
                return;
            }

            // Calculate training load and volume load
            formData.trainingLoad = formData.rpe * formData.duration;
            formData.volumeLoad = formData.sets * formData.reps * formData.weight;

            this.gymSessions.push(formData);
            this.saveData();
            this.showMessage('Gym session logged successfully!', 'success');
            this.gymForm.reset();
            this.setDefaultDates();
            this.updateDashboard();
        } catch (error) {
            console.error('Error submitting gym session:', error);
            this.showMessage('Error logging session. Please try again.', 'error');
        }
    }

    showMessage(message, type = 'success') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.form-message');
        existingMessages.forEach(msg => msg.remove());

        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type === 'success' ? 'success-message' : 'error-message'} show`;
        messageDiv.textContent = message;
        
        // Insert before active form
        const activeContent = document.querySelector('.tab-content.active');
        const activeForm = activeContent ? activeContent.querySelector('form') : null;
        
        if (activeForm && activeForm.parentNode) {
            activeForm.parentNode.insertBefore(messageDiv, activeForm);
            
            // Remove after 4 seconds
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 4000);
        }
    }

    updateDashboard() {
        const metrics = this.calculateMetrics();
        
        // Update metric values with null checks
        const elements = {
            currentWeekLoad: document.getElementById('currentWeekLoad'),
            weeklyAverage: document.getElementById('weeklyAverage'),
            acwrValue: document.getElementById('acwrValue'),
            monotonyValue: document.getElementById('monotonyValue'),
            strainValue: document.getElementById('strainValue'),
            weeklyThrows: document.getElementById('weeklyThrows')
        };

        if (elements.currentWeekLoad) elements.currentWeekLoad.textContent = Math.round(metrics.currentWeekLoad);
        if (elements.weeklyAverage) elements.weeklyAverage.textContent = Math.round(metrics.weeklyAverage);
        if (elements.acwrValue) elements.acwrValue.textContent = metrics.acwr.toFixed(2);
        if (elements.monotonyValue) elements.monotonyValue.textContent = metrics.monotony.toFixed(2);
        if (elements.strainValue) elements.strainValue.textContent = Math.round(metrics.strain);
        if (elements.weeklyThrows) elements.weeklyThrows.textContent = metrics.weeklyThrows;

        // Update ACWR status
        const acwrStatus = document.getElementById('acwrStatus');
        if (acwrStatus) {
            let statusClass = 'optimal';
            let statusText = 'Optimal';

            if (metrics.acwr < 0.7 || metrics.acwr > 1.5) {
                statusClass = 'danger';
                statusText = 'High Risk';
            } else if ((metrics.acwr >= 0.7 && metrics.acwr < 0.8) || (metrics.acwr > 1.3 && metrics.acwr <= 1.5)) {
                statusClass = 'caution';
                statusText = 'Caution';
            }

            acwrStatus.className = `metric-status ${statusClass}`;
            acwrStatus.textContent = statusText;
        }

        // Update chart
        this.updateLoadTrendChart();
    }

    calculateMetrics() {
        const allSessions = [...this.trackSessions, ...this.gymSessions];
        const currentDate = new Date();
        const oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
        const fourWeeksAgo = new Date(currentDate.getTime() - 28 * 24 * 60 * 60 * 1000);

        // Current week sessions
        const currentWeekSessions = allSessions.filter(session => {
            const sessionDate = new Date(session.date);
            return sessionDate >= oneWeekAgo && sessionDate <= currentDate;
        });

        // Last 28 days sessions
        const last28DaysSessions = allSessions.filter(session => {
            const sessionDate = new Date(session.date);
            return sessionDate >= fourWeeksAgo && sessionDate <= currentDate;
        });

        // Calculate current week load
        const currentWeekLoad = currentWeekSessions.reduce((sum, session) => sum + (session.trainingLoad || 0), 0);

        // Calculate weekly averages for last 4 weeks
        const weeklyLoads = [];
        for (let i = 0; i < 4; i++) {
            const weekStart = new Date(currentDate.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
            const weekEnd = new Date(currentDate.getTime() - i * 7 * 24 * 60 * 60 * 1000);
            
            const weekSessions = allSessions.filter(session => {
                const sessionDate = new Date(session.date);
                return sessionDate >= weekStart && sessionDate < weekEnd;
            });
            
            const weekLoad = weekSessions.reduce((sum, session) => sum + (session.trainingLoad || 0), 0);
            weeklyLoads.push(weekLoad);
        }

        const weeklyAverage = weeklyLoads.length > 0 ? weeklyLoads.reduce((a, b) => a + b, 0) / weeklyLoads.length : 0;

        // Calculate ACWR
        const acuteLoad = currentWeekLoad; // Last 7 days
        const chronicLoad = last28DaysSessions.reduce((sum, session) => sum + (session.trainingLoad || 0), 0) / 4; // Last 28 days average
        const acwr = chronicLoad > 0 ? acuteLoad / chronicLoad : 0;

        // Calculate monotony and strain
        const dailyLoads = {};
        currentWeekSessions.forEach(session => {
            if (!dailyLoads[session.date]) {
                dailyLoads[session.date] = 0;
            }
            dailyLoads[session.date] += session.trainingLoad || 0;
        });

        const loadValues = Object.values(dailyLoads);
        const meanLoad = loadValues.length > 0 ? loadValues.reduce((a, b) => a + b, 0) / loadValues.length : 0;
        const stdDev = loadValues.length > 1 ? Math.sqrt(loadValues.reduce((sum, load) => sum + Math.pow(load - meanLoad, 2), 0) / loadValues.length) : 0;
        const monotony = stdDev > 0 ? meanLoad / stdDev : 0;
        const strain = currentWeekLoad * monotony;

        // Calculate weekly throws
        const weeklyThrows = currentWeekSessions
            .filter(session => session.type === 'Track')
            .reduce((sum, session) => sum + (session.totalThrows || 0), 0);

        return {
            currentWeekLoad,
            weeklyAverage,
            acwr,
            monotony,
            strain,
            weeklyThrows
        };
    }

    updateLoadTrendChart() {
        if (!this.chartCanvas) return;

        const ctx = this.chartCanvas.getContext('2d');
        
        // Destroy existing chart
        if (this.chart) {
            this.chart.destroy();
        }

        // Get last 8 weeks of data
        const weeklyData = this.getWeeklyLoadData(8);

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: weeklyData.labels,
                datasets: [{
                    label: 'Training Load',
                    data: weeklyData.loads,
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#1FB8CD',
                    pointBorderColor: '#FFFFFF',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            color: '#626c71'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        ticks: {
                            color: '#626c71'
                        }
                    }
                }
            }
        });
    }

    getWeeklyLoadData(weeks) {
        const labels = [];
        const loads = [];
        const currentDate = new Date();

        for (let i = weeks - 1; i >= 0; i--) {
            const weekStart = new Date(currentDate.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
            const weekEnd = new Date(currentDate.getTime() - i * 7 * 24 * 60 * 60 * 1000);
            
            const weekSessions = [...this.trackSessions, ...this.gymSessions].filter(session => {
                const sessionDate = new Date(session.date);
                return sessionDate >= weekStart && sessionDate < weekEnd;
            });
            
            const weekLoad = weekSessions.reduce((sum, session) => sum + (session.trainingLoad || 0), 0);
            
            labels.push(`Week ${weeks - i}`);
            loads.push(weekLoad);
        }

        return { labels, loads };
    }

    updateHistory() {
        this.updateRecentSessions();
        this.updateWeeklySummary();
    }

    updateRecentSessions() {
        const tbody = document.getElementById('recentSessionsBody');
        if (!tbody) return;

        const allSessions = [...this.trackSessions, ...this.gymSessions]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 20); // Show last 20 sessions

        tbody.innerHTML = '';

        if (allSessions.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="6" style="text-align: center; color: #626c71;">No training sessions recorded yet</td>';
            tbody.appendChild(row);
            return;
        }

        allSessions.forEach(session => {
            const row = document.createElement('tr');
            row.className = session.type === 'Track' ? 'session-track' : 'session-gym';
            
            const activity = session.type === 'Track' ? 
                `${session.event} (${session.totalThrows} throws)` : 
                `${session.exercise} (${session.sets}x${session.reps}@${session.weight}kg)`;

            row.innerHTML = `
                <td>${this.formatDate(session.date)}</td>
                <td><span class="status status--${session.type === 'Track' ? 'info' : 'warning'}">${session.sessionType}</span></td>
                <td>${activity}</td>
                <td>${session.trainingLoad || 0}</td>
                <td>${session.rpe}/10</td>
                <td>${session.duration}min</td>
            `;
            
            tbody.appendChild(row);
        });
    }

    updateWeeklySummary() {
        const tbody = document.getElementById('weeklySummaryBody');
        if (!tbody) return;

        const weeklyData = this.getWeeklySummaryData(8);

        tbody.innerHTML = '';

        weeklyData.forEach(week => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${week.weekLabel}</td>
                <td>${Math.round(week.totalLoad)}</td>
                <td>${Math.round(week.avgLoad)}</td>
                <td>${week.sessions}</td>
                <td>${week.monotony.toFixed(2)}</td>
                <td>${Math.round(week.strain)}</td>
            `;
            tbody.appendChild(row);
        });
    }

    getWeeklySummaryData(weeks) {
        const summary = [];
        const currentDate = new Date();

        for (let i = 0; i < weeks; i++) {
            const weekStart = new Date(currentDate.getTime() - (i + 1) * 7 * 24 * 60 * 60 * 1000);
            const weekEnd = new Date(currentDate.getTime() - i * 7 * 24 * 60 * 60 * 1000);
            
            const weekSessions = [...this.trackSessions, ...this.gymSessions].filter(session => {
                const sessionDate = new Date(session.date);
                return sessionDate >= weekStart && sessionDate < weekEnd;
            });

            const totalLoad = weekSessions.reduce((sum, session) => sum + (session.trainingLoad || 0), 0);
            const avgLoad = weekSessions.length > 0 ? totalLoad / weekSessions.length : 0;

            // Calculate daily loads for monotony
            const dailyLoads = {};
            weekSessions.forEach(session => {
                if (!dailyLoads[session.date]) {
                    dailyLoads[session.date] = 0;
                }
                dailyLoads[session.date] += session.trainingLoad || 0;
            });

            const loadValues = Object.values(dailyLoads);
            const meanLoad = loadValues.length > 0 ? loadValues.reduce((a, b) => a + b, 0) / loadValues.length : 0;
            const stdDev = loadValues.length > 1 ? Math.sqrt(loadValues.reduce((sum, load) => sum + Math.pow(load - meanLoad, 2), 0) / loadValues.length) : 0;
            const monotony = stdDev > 0 ? meanLoad / stdDev : 0;
            const strain = totalLoad * monotony;

            summary.push({
                weekLabel: i === 0 ? 'Current' : `${i} week${i > 1 ? 's' : ''} ago`,
                totalLoad,
                avgLoad,
                sessions: weekSessions.length,
                monotony,
                strain
            });
        }

        return summary;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    }

    formatDateForStorage(date) {
        return date.toISOString().split('T')[0];
    }

    saveData() {
        try {
            localStorage.setItem('trackSessions', JSON.stringify(this.trackSessions));
            localStorage.setItem('gymSessions', JSON.stringify(this.gymSessions));
        } catch (error) {
            console.warn('Unable to save data to localStorage:', error);
        }
    }

    loadData() {
        try {
            const trackData = localStorage.getItem('trackSessions');
            const gymData = localStorage.getItem('gymSessions');
            
            this.trackSessions = trackData ? JSON.parse(trackData) : [];
            this.gymSessions = gymData ? JSON.parse(gymData) : [];
        } catch (error) {
            console.warn('Unable to load data from localStorage:', error);
            this.trackSessions = [];
            this.gymSessions = [];
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        new TrainingTracker();
    } catch (error) {
        console.error('Failed to initialize Training Tracker:', error);
    }
});