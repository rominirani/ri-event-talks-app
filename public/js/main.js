document.addEventListener('DOMContentLoaded', () => {
    const scheduleList = document.getElementById('schedule-list');
    const searchCategory = document.getElementById('search-category');
    const searchSpeaker = document.getElementById('search-speaker');
    const modal = document.getElementById('talk-modal');
    const modalBody = document.getElementById('modal-body');
    const closeModal = document.querySelector('.close-modal');
    const modalOverlay = document.querySelector('.modal-overlay');
    
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
                
                // Multi-criteria filtering
                const catTerm = searchCategory.value.toLowerCase();
                const speakerTerm = searchSpeaker.value.toLowerCase();
                
                const matchesCategory = catTerm === '' || talk.categories.some(cat => cat.toLowerCase().includes(catTerm));
                const matchesSpeaker = speakerTerm === '' || talk.speakers.some(speaker => speaker.toLowerCase().includes(speakerTerm));
                
                if (matchesCategory && matchesSpeaker) {
                    card.addEventListener('click', () => openModal(talk, startTime, endTime));
                    scheduleList.appendChild(card);
                }
            }

            currentMinutes = endTime + TRANSITION_TIME;
        }

        if (scheduleList.children.length === 0) {
            scheduleList.innerHTML = '<div class="no-results">No talks found matching your search criteria.</div>';
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
                <p class="description">${talk.description.substring(0, 100)}...</p>
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

    function openModal(talk, start, end) {
        modalBody.innerHTML = `
            <div class="modal-time">${formatTime(start)} — ${formatTime(end)}</div>
            <h2>${talk.title}</h2>
            <span class="modal-speakers">Presented by ${talk.speakers.join(' & ')}</span>
            <div class="modal-description">${talk.description}</div>
            <div class="categories">
                ${talk.categories.map(cat => `<span class="tag">${cat}</span>`).join('')}
            </div>
        `;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeTalkModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Event Listeners
    searchCategory.addEventListener('input', () => renderSchedule(allTalks));
    searchSpeaker.addEventListener('input', () => renderSchedule(allTalks));

    closeModal.addEventListener('click', closeTalkModal);
    modalOverlay.addEventListener('click', closeTalkModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeTalkModal();
        }
    });

    fetchTalks();
});
