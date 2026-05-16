document.addEventListener('DOMContentLoaded', () => {
    const scheduleList = document.getElementById('schedule-list');
    const searchInput = document.getElementById('category-search');
    let allTalks = [];

    // Schedule Settings
    const START_TIME = 10 * 60; // 10:00 AM in minutes
    const TALK_DURATION = 60;   // 1 hour
    const TRANSITION_TIME = 10; // 10 minutes
    const LUNCH_DURATION = 60;  // 1 hour
    const TALKS_BEFORE_LUNCH = 3;

    async function fetchTalks() {
        try {
            const response = await fetch('/api/talks');
            allTalks = await response.json();
            renderSchedule(allTalks);
        } catch (error) {
            console.error('Error fetching talks:', error);
            scheduleList.innerHTML = '<div class="error">Failed to load schedule. Please try again later.</div>';
        }
    }

    function formatTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        const displayMins = mins < 10 ? `0${mins}` : mins;
        return `${displayHours}:${displayMins} ${ampm}`;
    }

    function renderSchedule(talks) {
        scheduleList.innerHTML = '';
        
        let currentMinutes = START_TIME;
        let talkCount = 0;

        // Note: The prompt says 6 talks total.
        // We render all 6, but filter them based on search.
        // Even if some are filtered, the schedule positions are fixed for the 6 slots.
        
        for (let i = 0; i < 6; i++) {
            const talk = talks.find(t => t.id === i + 1);
            
            // Add Lunch Break
            if (i === TALKS_BEFORE_LUNCH) {
                const lunchEnd = currentMinutes + LUNCH_DURATION;
                scheduleList.appendChild(createBreakCard('Lunch Break', currentMinutes, lunchEnd));
                currentMinutes = lunchEnd;
            }

            const startTime = currentMinutes;
            const endTime = startTime + TALK_DURATION;
            
            if (talk) {
                const card = createTalkCard(talk, startTime, endTime);
                // Real-time filtering logic
                const searchTerm = searchInput.value.toLowerCase();
                const matches = talk.categories.some(cat => cat.toLowerCase().includes(searchTerm));
                
                if (searchTerm === '' || matches) {
                    scheduleList.appendChild(card);
                }
            }

            currentMinutes = endTime + TRANSITION_TIME;
        }

        if (scheduleList.children.length === 0) {
            scheduleList.innerHTML = '<div class="no-results">No talks found matching that category.</div>';
        }
    }

    function createTalkCard(talk, start, end) {
        const div = document.createElement('div');
        div.className = 'talk-card';
        div.innerHTML = `
            <div class="time-slot">
                ${formatTime(start)}<br>—<br>${formatTime(end)}
            </div>
            <div class="talk-info">
                <h3>${talk.title}</h3>
                <span class="speakers">by ${talk.speakers.join(' & ')}</span>
                <p class="description">${talk.description}</p>
                <div class="categories">
                    ${talk.categories.map(cat => `<span class="tag">${cat}</span>`).join('')}
                </div>
            </div>
        `;
        return div;
    }

    function createBreakCard(title, start, end) {
        const div = document.createElement('div');
        div.className = 'break-card';
        div.innerHTML = `
            <div class="time-slot">
                ${formatTime(start)}<br>—<br>${formatTime(end)}
            </div>
            <div class="talk-info">
                <h3>🍴 ${title}</h3>
                <p class="description">Time to refuel and network with other attendees.</p>
            </div>
        `;
        return div;
    }

    // Event Listeners
    searchInput.addEventListener('input', () => {
        renderSchedule(allTalks);
    });

    // Initial Fetch
    fetchTalks();
});
