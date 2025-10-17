let clubInfo = {
  name: 'Tech Innovation Club',
  description: 'Building the future through technology and innovation',
  logo: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&h=150&fit=crop'
};

let events = [
  { 
    id: 1, 
    name: 'AWS Workshop 2024', 
    date: '2024-10-20', 
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop',
    registered: 45 
  },
  { 
    id: 2, 
    name: 'Hackathon 2024', 
    date: '2024-11-05', 
    image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400&h=200&fit=crop',
    registered: 128 
  },
  { 
    id: 3, 
    name: 'Tech Talk Series', 
    date: '2024-11-12', 
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=200&fit=crop',
    registered: 67 
  }
];

let registrations = [
  { id: 1, name: 'John Doe', email: 'john.doe@university.edu', event: 'AWS Workshop 2024', eventSlug: 'aws', date: '2024-10-10' },
  { id: 2, name: 'Alice Smith', email: 'alice.smith@university.edu', event: 'Hackathon 2024', eventSlug: 'hackathon', date: '2024-10-12' },
  { id: 3, name: 'Michael Brown', email: 'michael.b@university.edu', event: 'AWS Workshop 2024', eventSlug: 'aws', date: '2024-10-11' },
  { id: 4, name: 'Emma Johnson', email: 'emma.johnson@university.edu', event: 'Tech Talk Series', eventSlug: 'techtalk', date: '2024-10-13' },
  { id: 5, name: 'David Wilson', email: 'david.w@university.edu', event: 'Hackathon 2024', eventSlug: 'hackathon', date: '2024-10-14' }
];

let editMode = false;
let editId = null;


function renderEvents() {
  const grid = document.getElementById('events-grid');
  grid.innerHTML = '';
  
  events.forEach(event => {
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    const card = document.createElement('div');
    card.className = 'club-event-card';
    card.innerHTML = `
      <div class="club-event-image">
        <img src="${event.image}" alt="${event.name}">
      </div>
      <div class="club-event-content">
        <h3 class="club-event-name">${event.name}</h3>
        <div class="club-event-meta">
          <span class="event-date-badge">${formattedDate}</span>
          <span class="event-registered">${event.registered} Registered</span>
        </div>
        <div class="club-event-actions">
          <button class="action-btn-small edit-btn" onclick="editEvent(${event.id})">Edit</button>
          <button class="action-btn-small delete-btn" onclick="deleteEvent(${event.id})">Delete</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
  
  updateEventFilter();
}

function renderRegistrations() {
  const tbody = document.getElementById('registrations-tbody');
  tbody.innerHTML = '';
  
  registrations.forEach(reg => {
    const initials = reg.name.split(' ').map(n => n[0]).join('');
    const regDate = new Date(reg.date);
    const formattedDate = regDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    const row = document.createElement('div');
    row.className = 'table-row';
    row.setAttribute('data-event-slug', reg.eventSlug);
    row.innerHTML = `
      <div class="table-col col-name">
        <div class="user-info">
          <div class="user-avatar">${initials}</div>
          <span>${reg.name}</span>
        </div>
      </div>
      <div class="table-col col-email">${reg.email}</div>
      <div class="table-col col-event">
        <span class="event-badge event-${reg.eventSlug}">${reg.event}</span>
      </div>
      <div class="table-col col-date">${formattedDate}</div>
    `;
    tbody.appendChild(row);
  });
}

function updateEventFilter() {
  const filter = document.getElementById('event-filter');
  filter.innerHTML = '<option value="all">All Events</option>';
  
  events.forEach(event => {
    const option = document.createElement('option');
    const slug = event.name.toLowerCase().replace(/\s+/g, '-');
    option.value = slug;
    option.textContent = event.name;
    filter.appendChild(option);
  });
}

function updateClubInfo() {
  document.querySelector('.club-name').textContent = clubInfo.name;
  document.querySelector('.club-description').textContent = clubInfo.description;
  document.querySelector('.club-logo img').src = clubInfo.logo;
}


function init() {

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const tabName = this.getAttribute('data-tab');
      
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      this.classList.add('active');
      document.getElementById(tabName + '-tab').classList.add('active');
    });
  });


  document.getElementById('edit-club-btn').addEventListener('click', () => {
    document.getElementById('club-name').value = clubInfo.name;
    document.getElementById('club-description').value = clubInfo.description;
    document.getElementById('club-logo').value = clubInfo.logo;
    document.getElementById('club-modal').classList.add('active');
  });


  document.getElementById('close-club-modal').addEventListener('click', () => {
    document.getElementById('club-modal').classList.remove('active');
  });

  document.querySelectorAll('.cancel-club-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('club-modal').classList.remove('active');
    });
  });


  document.getElementById('club-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    clubInfo.name = document.getElementById('club-name').value;
    clubInfo.description = document.getElementById('club-description').value;
    clubInfo.logo = document.getElementById('club-logo').value;
    
    updateClubInfo();
    document.getElementById('club-modal').classList.remove('active');
  });


  document.getElementById('add-event-btn').addEventListener('click', () => {
    editMode = false;
    editId = null;
    document.getElementById('event-modal-title').textContent = 'Add New Event';
    document.getElementById('event-form').reset();
    document.getElementById('event-id').value = '';
    document.getElementById('event-modal').classList.add('active');
  });


  document.getElementById('close-event-modal').addEventListener('click', () => {
    document.getElementById('event-modal').classList.remove('active');
  });

  document.querySelectorAll('.cancel-event-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('event-modal').classList.remove('active');
    });
  });


  document.getElementById('event-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const event = {
      name: document.getElementById('event-name').value,
      date: document.getElementById('event-date').value,
      image: document.getElementById('event-image').value || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop',
      registered: parseInt(document.getElementById('event-registered').value)
    };
    
    if (editMode && editId) {
      const index = events.findIndex(e => e.id === editId);
      events[index] = { ...events[index], ...event };
    } else {
      event.id = events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1;
      events.push(event);
    }
    
    renderEvents();
    document.getElementById('event-modal').classList.remove('active');
  });


  document.getElementById('event-filter').addEventListener('change', function() {
    const selectedEvent = this.value;
    const rows = document.querySelectorAll('.table-row');
    
    if (selectedEvent === 'all') {
      rows.forEach(row => row.style.display = 'grid');
    } else {
      rows.forEach(row => {
        const eventSlug = row.getAttribute('data-event-slug');
        if (eventSlug === selectedEvent) {
          row.style.display = 'grid';
        } else {
          row.style.display = 'none';
        }
      });
    }
  });


  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });


  renderEvents();
  renderRegistrations();
  updateClubInfo();
}


function editEvent(id) {
  editMode = true;
  editId = id;
  const event = events.find(e => e.id === id);
  
  document.getElementById('event-modal-title').textContent = 'Edit Event';
  document.getElementById('event-id').value = event.id;
  document.getElementById('event-name').value = event.name;
  document.getElementById('event-date').value = event.date;
  document.getElementById('event-image').value = event.image;
  document.getElementById('event-registered').value = event.registered;
  document.getElementById('event-modal').classList.add('active');
}

function deleteEvent(id) {
  const event = events.find(e => e.id === id);
  if (confirm(`Are you sure you want to delete "${event.name}"?`)) {
    events = events.filter(e => e.id !== id);
    renderEvents();
  }
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}