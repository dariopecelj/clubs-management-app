let userProfile = {
  name: 'John Doe',
  email: 'john.doe@university.edu',
  userId: '12345',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop'
};

let userClubs = [
  {
    id: 1,
    name: 'Tech Innovation Club',
    logo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=80&h=80&fit=crop',
    role: 'Member',
    events: 8
  },
  {
    id: 2,
    name: 'Design & Creative Club',
    logo: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=80&h=80&fit=crop',
    role: 'Admin',
    events: 5
  },
  {
    id: 3,
    name: 'Entrepreneurship Club',
    logo: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=80&h=80&fit=crop',
    role: 'Member',
    events: 12
  }
];

let userEvents = [
  {
    id: 1,
    name: 'AWS Workshop 2024',
    club: 'Tech Innovation Club',
    date: '2024-11-20',
    status: 'upcoming'
  },
  {
    id: 2,
    name: 'Design Thinking Bootcamp',
    club: 'Design & Creative Club',
    date: '2024-11-15',
    status: 'upcoming'
  },
  {
    id: 3,
    name: 'Startup Pitch Night',
    club: 'Entrepreneurship Club',
    date: '2024-10-05',
    status: 'completed'
  },
  {
    id: 4,
    name: 'Hackathon 2024',
    club: 'Tech Innovation Club',
    date: '2024-11-25',
    status: 'upcoming'
  },
  {
    id: 5,
    name: 'UI/UX Workshop',
    club: 'Design & Creative Club',
    date: '2024-10-10',
    status: 'completed'
  }
];

function renderProfileInfo() {
  document.getElementById('profile-name').textContent = userProfile.name;
  document.getElementById('profile-email').textContent = userProfile.email;
  document.getElementById('profile-id').textContent = `ID: ${userProfile.userId}`;
  document.getElementById('profile-pic').src = userProfile.avatar;
}

function renderUserClubs() {
  const grid = document.getElementById('clubs-grid');
  grid.innerHTML = '';
  
  userClubs.forEach(club => {
    const card = document.createElement('div');
    card.className = 'user-club-card';
    card.innerHTML = `
      <div class="club-card-header">
        <div class="club-card-logo">
          <img src="${club.logo}" alt="${club.name}">
        </div>
        <div class="club-card-info">
          <h3 class="club-card-name">${club.name}</h3>
          <p class="club-card-role">${club.role}</p>
        </div>
      </div>
      <div class="club-card-stats">
        <span class="club-stat">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <rect x="3" y="4" width="10" height="9" rx="1" stroke="rgba(255,255,255,0.5)" stroke-width="1.5"/>
            <line x1="3" y1="6" x2="13" y2="6" stroke="rgba(255,255,255,0.5)" stroke-width="1.5"/>
          </svg>
          ${club.events} Events
        </span>
      </div>
    `;
    grid.appendChild(card);
  });
  
  document.getElementById('clubs-count').textContent = `${userClubs.length} ${userClubs.length === 1 ? 'club' : 'clubs'}`;
}

function renderUserEvents() {
  const tbody = document.getElementById('events-tbody');
  tbody.innerHTML = '';
  
  userEvents.forEach(event => {
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
    
    const row = document.createElement('div');
    row.className = 'data-row';
    row.innerHTML = `
      <div data-label="Event Name">${event.name}</div>
      <div data-label="Club">${event.club}</div>
      <div data-label="Date">
        ${formattedDate}
      </div>
    `;
    tbody.appendChild(row);
  });
  
  document.getElementById('events-count').textContent = `${userEvents.length} ${userEvents.length === 1 ? 'event' : 'events'}`;
}

function init() {

  document.getElementById('edit-profile-btn').addEventListener('click', () => {
    document.getElementById('edit-name').value = userProfile.name;
    document.getElementById('edit-email').value = userProfile.email;
    
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
    
    document.getElementById('profile-modal').classList.add('active');
  });

  document.getElementById('close-profile-modal').addEventListener('click', () => {
    document.getElementById('profile-modal').classList.remove('active');
  });

  document.querySelectorAll('.cancel-profile-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('profile-modal').classList.remove('active');
    });
  });

  document.getElementById('profile-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    
    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        alert('New passwords do not match!');
        return;
      }
      
      if (newPassword && newPassword.length < 6) {
        alert('New password must be at least 6 characters long.');
        return;
      }
    }
    
    userProfile.name = document.getElementById('edit-name').value;
    userProfile.email = document.getElementById('edit-email').value;
    
    if (newPassword) {
      alert('Profile and password updated successfully!');
    } else {
      alert('Profile updated successfully!');
    }
    
    renderProfileInfo();
    
    document.getElementById('profile-modal').classList.remove('active');
  });

  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });

  renderProfileInfo();
  renderUserClubs();
  renderUserEvents();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}