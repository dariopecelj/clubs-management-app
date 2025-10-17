let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Student', status: 'Active' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Club Leader', status: 'Inactive' }
];

let events = [
  { id: 1, name: 'Tech Night', club: 'Tech Innovation Club', date: '2025-10-22', status: 'Upcoming' },
  { id: 2, name: 'Business Workshop', club: 'Business Society', date: '2025-11-05', status: 'Upcoming' },
  { id: 3, name: 'Art Exhibition', club: 'Arts Club', date: '2025-09-15', status: 'Completed' }
];

let clubs = [
  { id: 1, name: 'Tech Innovation Club', description: 'Explore latest technologies', members: 45 },
  { id: 2, name: 'Business Society', description: 'Business networking and skills', members: 32 },
  { id: 3, name: 'Arts Club', description: 'Creative arts and expression', members: 28 }
];

let editMode = false;
let editId = null;


function renderUsers() {
  const tbody = document.getElementById('users-tbody');
  tbody.innerHTML = '';
  
  users.forEach(user => {
    const row = document.createElement('div');
    row.className = 'data-row';
    row.innerHTML = `
      <div>${user.name}</div>
      <div>${user.email}</div>
      <div>${user.role}</div>
      <div><span class="status-badge ${user.status.toLowerCase()}">${user.status}</span></div>
      <div class="action-btns">
        <button class="edit-btn" onclick="editUser(${user.id})">Edit</button>
        <button class="delete-btn" onclick="deleteUser(${user.id})">Delete</button>
      </div>
    `;
    tbody.appendChild(row);
  });
}

function renderEvents() {
  const tbody = document.getElementById('events-tbody');
  tbody.innerHTML = '';
  
  events.forEach(event => {
    const row = document.createElement('div');
    row.className = 'data-row';
    row.innerHTML = `
      <div>${event.name}</div>
      <div>${event.club}</div>
      <div>${event.date}</div>
      <div><span class="status-badge ${event.status.toLowerCase()}">${event.status}</span></div>
      <div class="action-btns">
        <button class="edit-btn" onclick="editEvent(${event.id})">Edit</button>
        <button class="delete-btn" onclick="deleteEvent(${event.id})">Delete</button>
      </div>
    `;
    tbody.appendChild(row);
  });
}

function renderClubs() {
  const tbody = document.getElementById('clubs-tbody');
  tbody.innerHTML = '';
  
  clubs.forEach(club => {
    const row = document.createElement('div');
    row.className = 'data-row';
    row.innerHTML = `
      <div>${club.name}</div>
      <div>${club.description}</div>
      <div>${club.members}</div>
      <div class="action-btns">
        <button class="edit-btn" onclick="editClub(${club.id})">Edit</button>
        <button class="delete-btn" onclick="deleteClub(${club.id})">Delete</button>
      </div>
    `;
    tbody.appendChild(row);
  });
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


  document.getElementById('add-user-btn').addEventListener('click', () => {
    editMode = false;
    editId = null;
    document.getElementById('user-modal-title').textContent = 'Add User';
    document.getElementById('user-form').reset();
    document.getElementById('user-id').value = '';
    document.getElementById('user-modal').classList.add('active');
  });

  document.getElementById('close-user-modal').addEventListener('click', () => {
    document.getElementById('user-modal').classList.remove('active');
  });

  document.querySelectorAll('.cancel-user-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('user-modal').classList.remove('active');
    });
  });

  document.getElementById('user-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const user = {
      name: document.getElementById('user-name').value,
      email: document.getElementById('user-email').value,
      role: document.getElementById('user-role').value,
      status: document.getElementById('user-status').value
    };
    
    if (editMode && editId) {
      const index = users.findIndex(u => u.id === editId);
      users[index] = { ...users[index], ...user };
    } else {
      user.id = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
      users.push(user);
    }
    
    renderUsers();
    document.getElementById('user-modal').classList.remove('active');
  });


  document.getElementById('add-event-btn').addEventListener('click', () => {
    editMode = false;
    editId = null;
    document.getElementById('event-modal-title').textContent = 'Add Event';
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
      club: document.getElementById('event-club').value,
      date: document.getElementById('event-date').value,
      status: document.getElementById('event-status').value
    };
    
    if (editMode && editId) {
      const index = events.findIndex(ev => ev.id === editId);
      events[index] = { ...events[index], ...event };
    } else {
      event.id = events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1;
      events.push(event);
    }
    
    renderEvents();
    document.getElementById('event-modal').classList.remove('active');
  });


  document.getElementById('add-club-btn').addEventListener('click', () => {
    editMode = false;
    editId = null;
    document.getElementById('club-modal-title').textContent = 'Add Club';
    document.getElementById('club-form').reset();
    document.getElementById('club-id').value = '';
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
    
    const club = {
      name: document.getElementById('club-name').value,
      description: document.getElementById('club-description').value,
      members: parseInt(document.getElementById('club-members').value)
    };
    
    if (editMode && editId) {
      const index = clubs.findIndex(c => c.id === editId);
      clubs[index] = { ...clubs[index], ...club };
    } else {
      club.id = clubs.length > 0 ? Math.max(...clubs.map(c => c.id)) + 1 : 1;
      clubs.push(club);
    }
    
    renderClubs();
    document.getElementById('club-modal').classList.remove('active');
  });


  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });

  renderUsers();
  renderEvents();
  renderClubs();
}

function editUser(id) {
  editMode = true;
  editId = id;
  const user = users.find(u => u.id === id);
  
  document.getElementById('user-modal-title').textContent = 'Edit User';
  document.getElementById('user-id').value = user.id;
  document.getElementById('user-name').value = user.name;
  document.getElementById('user-email').value = user.email;
  document.getElementById('user-role').value = user.role;
  document.getElementById('user-status').value = user.status;
  document.getElementById('user-modal').classList.add('active');
}

function deleteUser(id) {
  if (confirm('Are you sure you want to delete this user?')) {
    users = users.filter(u => u.id !== id);
    renderUsers();
  }
}

function editEvent(id) {
  editMode = true;
  editId = id;
  const event = events.find(e => e.id === id);
  
  document.getElementById('event-modal-title').textContent = 'Edit Event';
  document.getElementById('event-id').value = event.id;
  document.getElementById('event-name').value = event.name;
  document.getElementById('event-club').value = event.club;
  document.getElementById('event-date').value = event.date;
  document.getElementById('event-status').value = event.status;
  document.getElementById('event-modal').classList.add('active');
}

function deleteEvent(id) {
  if (confirm('Are you sure you want to delete this event?')) {
    events = events.filter(e => e.id !== id);
    renderEvents();
  }
}

function editClub(id) {
  editMode = true;
  editId = id;
  const club = clubs.find(c => c.id === id);
  
  document.getElementById('club-modal-title').textContent = 'Edit Club';
  document.getElementById('club-id').value = club.id;
  document.getElementById('club-name').value = club.name;
  document.getElementById('club-description').value = club.description;
  document.getElementById('club-members').value = club.members;
  document.getElementById('club-modal').classList.add('active');
}

function deleteClub(id) {
  if (confirm('Are you sure you want to delete this club?')) {
    clubs = clubs.filter(c => c.id !== id);
    renderClubs();
  }
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}