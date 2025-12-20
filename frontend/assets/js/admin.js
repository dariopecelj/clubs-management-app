toastr.options.preventDuplicates = true;
toastr.options.timeOut = 3000;

(function() {
    window.adminUsers = window.adminUsers || [];
    window.adminEvents = window.adminEvents || [];
    window.adminClubs = window.adminClubs || [];
    window.adminEditMode = window.adminEditMode || false;
    window.adminEditId = window.adminEditId || null;
    window.adminInitialized = window.adminInitialized || false;

    let users = window.adminUsers;
    let events = window.adminEvents;
    let clubs = window.adminClubs;
    let editMode = window.adminEditMode;
    let editId = window.adminEditId;

    function renderUsers() {
        const tbody = document.getElementById('users-tbody');
        if (!tbody) {
            return;
        }
        tbody.innerHTML = '';
        
        if (users.length === 0) {
            tbody.innerHTML = '<div class="data-row"><div style="grid-column: 1/-1; text-align: center;">No users found</div></div>';
            return;
        }
        
        users.forEach(user => {
            const row = document.createElement('div');
            row.className = 'data-row';
            row.innerHTML = `
                <div>${user.id}</div>
                <div>${user.full_name || user.name || 'N/A'}</div>
                <div>${user.email}</div>
                <div>${user.role}</div>
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
        if (!tbody) {
            return;
        }
        tbody.innerHTML = '';
        
        if (events.length === 0) {
            tbody.innerHTML = '<div class="data-row"><div style="grid-column: 1/-1; text-align: center;">No events found</div></div>';
            return;
        }
        
        events.forEach(event => {
            const club = clubs.find(c => c.id === event.club_id);
            const clubName = club ? club.club_name : 'N/A';
            
            const row = document.createElement('div');
            row.className = 'data-row';
            row.innerHTML = `
                <div>${event.id}</div>
                <div>${event.title}</div>
                <div>${clubName}</div>
                <div>${event.event_date}</div>
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
        if (!tbody) {
            return;
        }
        tbody.innerHTML = '';
        
        if (clubs.length === 0) {
            tbody.innerHTML = '<div class="data-row"><div style="grid-column: 1/-1; text-align: center;">No clubs found</div></div>';
            return;
        }
        
        clubs.forEach(club => {
            const row = document.createElement('div');
            row.className = 'data-row';
            row.innerHTML = `
                <div>${club.id}</div>
                <div>${club.club_name}</div>
                <div>${club.description || 'N/A'}</div>
                <div class="action-btns">
                    <button class="edit-btn" onclick="editClub(${club.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteClub(${club.id})">Delete</button>
                </div>
            `;
            tbody.appendChild(row);
        });
    }

    function loadUsers() {
        UserService.getAllUsers(function(response) {
            users = window.adminUsers = response || [];
            renderUsers();
        }, function(error) {
            toastr.error('Failed to load users');
            users = window.adminUsers = [];
            renderUsers();
        });
    }

    function loadEvents() {
        EventsService.getAllEvents(function(response) {
            events = window.adminEvents = response || [];
            renderEvents();
        }, function(error) {
            toastr.error('Failed to load events');
            events = window.adminEvents = [];
            renderEvents();
        });
    }

    function loadClubs() {
        ClubsService.getAllClubs(null, function(response) {
            clubs = window.adminClubs = response || [];
            renderClubs();
            if (events.length > 0) {
                renderEvents();
            }
        }, function(error) {
            toastr.error('Failed to load clubs');
            clubs = window.adminClubs = [];
            renderClubs();
        });
    }

    window.editUser = function(id) {
        editMode = window.adminEditMode = true;
        editId = window.adminEditId = id;
        const user = users.find(u => u.id === id);
        
        document.getElementById('admin-user-form').reset();
        const validator = $('#admin-user-form').validate();
        validator.resetForm();
        $('#admin-user-form').find('.error').removeClass('error');
        
        document.getElementById('admin-user-modal-title').textContent = 'Edit User';
        document.getElementById('admin-user-id').value = user.id;
        document.getElementById('admin-user-name').value = user.full_name || user.name || '';
        document.getElementById('admin-user-email').value = user.email;
        document.getElementById('admin-user-role').value = user.role;
        document.getElementById('admin-user-password').value = '';
        
        document.getElementById('admin-user-modal').classList.add('active');
    };

    window.deleteUser = function(id) {
        const user = users.find(u => u.id === id);
        
        document.getElementById('admin-delete-modal-title').textContent = 'Delete User';
        document.getElementById('admin-delete-modal-message').textContent = `Are you sure you want to delete "${user.full_name || user.email}"?`;
        document.getElementById('admin-delete-modal').classList.add('active');
        
        window.pendingDeleteAction = function() {
            document.getElementById('admin-delete-modal').classList.remove('active');
            
            UserService.deleteUser(id, function(response) {
                loadUsers();
            }, function(error) {
                toastr.error('Failed to delete user');
            });
        };
    };

    window.editEvent = function(id) {
        editMode = window.adminEditMode = true;
        editId = window.adminEditId = id;
        const event = events.find(e => e.id === id);
        
        if (!event) {
            toastr.error('Event not found');
            return;
        }
        
        document.getElementById('admin-event-form').reset();
        const validator = $('#admin-event-form').validate();
        validator.resetForm();
        $('#admin-event-form').find('.error').removeClass('error');
        
        document.getElementById('admin-event-modal-title').textContent = 'Edit Event';
        document.getElementById('admin-event-id').value = event.id;
        document.getElementById('admin-event-name').value = event.title;
        document.getElementById('admin-event-date').value = event.event_date.split('T')[0];
        
        const descField = document.getElementById('admin-event-description');
        if (descField) {
            descField.value = event.description || '';
        }
        
        const locationField = document.getElementById('admin-event-location');
        if (locationField) {
            locationField.value = event.location || '';
        }
        
        loadClubsForDropdown(function() {
            const clubSelect = document.getElementById('admin-event-club');
            if (clubSelect) {
                clubSelect.value = event.club_id || '';
            }
        });
        
        document.getElementById('admin-event-modal').classList.add('active');
    };

    window.deleteEvent = function(id) {
        const event = events.find(e => e.id === id);
        
        document.getElementById('admin-delete-modal-title').textContent = 'Delete Event';
        document.getElementById('admin-delete-modal-message').textContent = `Are you sure you want to delete "${event.title}"?`;
        document.getElementById('admin-delete-modal').classList.add('active');
        
        window.pendingDeleteAction = function() {
            document.getElementById('admin-delete-modal').classList.remove('active');
            
            EventsService.deleteEvent(id, function(response) {
                loadEvents();
            }, function(error) {
                toastr.error('Failed to delete event');
            });
        };
    };

    window.editClub = function(id) {
        editMode = window.adminEditMode = true;
        editId = window.adminEditId = id;
        const club = clubs.find(c => c.id === id);
        
        document.getElementById('admin-club-form').reset();
        const validator = $('#admin-club-form').validate();
        validator.resetForm();
        $('#admin-club-form').find('.error').removeClass('error');
        
        document.getElementById('admin-club-modal-title').textContent = 'Edit Club';
        document.getElementById('admin-club-id').value = club.id;
        document.getElementById('admin-club-name').value = club.club_name;
        document.getElementById('admin-club-description').value = club.description || '';
        document.getElementById('admin-club-user-id').value = club.creator_user_id || club.user_id || '';
        
        document.getElementById('admin-club-modal').classList.add('active');
    };

    window.deleteClub = function(id) {
        const club = clubs.find(c => c.id === id);
        
        document.getElementById('admin-delete-modal-title').textContent = 'Delete Club';
        document.getElementById('admin-delete-modal-message').textContent = `Are you sure you want to delete "${club.club_name}"?`;
        document.getElementById('admin-delete-modal').classList.add('active');
        
        window.pendingDeleteAction = function() {
            document.getElementById('admin-delete-modal').classList.remove('active');
            
            ClubsService.deleteClub(id, function(response) {
                loadClubs();
            }, function(error) {
                toastr.error('Failed to delete club');
            });
        };
    };

    function loadClubsForDropdown(callback) {
        const clubSelect = document.getElementById('admin-event-club');
        if (!clubSelect) {
            if (callback) callback();
            return;
        }
        
        ClubsService.getAllClubs(null, function(response) {
            clubSelect.innerHTML = '<option value="">-- Select Club --</option>';
            response.forEach(club => {
                const option = document.createElement('option');
                option.value = club.id;
                option.textContent = club.club_name;
                clubSelect.appendChild(option);
            });
            if (callback) callback();
        }, function(error) {
            toastr.error('Failed to load clubs');
            if (callback) callback();
        });
    }

    function initAdmin() {
        if (window.adminInitialized) {
            return;
        }
        window.adminInitialized = true;

        UserService.init();
        ClubsService.init();
        EventsService.init();

        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const tabName = this.getAttribute('data-tab');
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                document.getElementById(tabName + '-tab').classList.add('active');
                
                if (tabName === 'users') {
                    loadUsers();
                } else if (tabName === 'events') {
                    if (clubs.length === 0) {
                        loadClubs();
                    }
                    loadEvents();
                } else if (tabName === 'clubs') {
                    loadClubs();
                }
            });
        });

        document.getElementById('add-user-btn').addEventListener('click', () => {
            editMode = window.adminEditMode = false;
            editId = window.adminEditId = null;
            document.getElementById('admin-user-modal-title').textContent = 'Add User';
            document.getElementById('admin-user-form').reset();
            document.getElementById('admin-user-id').value = '';
            document.getElementById('admin-user-modal').classList.add('active');
            
            const validator = $('#admin-user-form').validate();
            validator.resetForm();
            $('#admin-user-form').find('.error').removeClass('error');
        });

        document.getElementById('admin-close-user-modal').addEventListener('click', () => {
            document.getElementById('admin-user-modal').classList.remove('active');
            const validator = $('#admin-user-form').validate();
            validator.resetForm();
            $('#admin-user-form').find('.error').removeClass('error');
        });

        document.querySelectorAll('.cancel-admin-user-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('admin-user-modal').classList.remove('active');
                const validator = $('#admin-user-form').validate();
                validator.resetForm();
                $('#admin-user-form').find('.error').removeClass('error');
            });
        });

        document.getElementById('admin-user-form').addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!$('#admin-user-form').valid()) {
                return;
            }
            
            const submitBtn = e.target.querySelector('.submit-btn');
            if (submitBtn.disabled) return;
            
            const userData = {
                full_name: document.getElementById('admin-user-name').value,
                email: document.getElementById('admin-user-email').value,
                role: document.getElementById('admin-user-role').value
            };
            
            const password = document.getElementById('admin-user-password').value;
            if (password && password.trim() !== '') {
                userData.password = password;
            }
            
            if (editMode && editId) {
                submitBtn.disabled = true;
                UserService.updateUser(editId, userData, function(response) {
                    submitBtn.disabled = false;
                    document.getElementById('admin-user-modal').classList.remove('active');
                    loadUsers();
                }, function(error) {
                    submitBtn.disabled = false;
                    toastr.error('Failed to update user');
                });
            } else {
                if (!password || password.trim() === '') {
                    toastr.error('Password is required for new users');
                    return;
                }
                
                submitBtn.disabled = true;
                UserService.createUser(userData, function(response) {
                    submitBtn.disabled = false;
                    document.getElementById('admin-user-modal').classList.remove('active');
                    loadUsers();
                }, function(error) {
                    submitBtn.disabled = false;
                    toastr.error('Failed to create user');
                });
            }
        });

        document.getElementById('add-event-btn').addEventListener('click', () => {
            editMode = window.adminEditMode = false;
            editId = window.adminEditId = null;
            document.getElementById('admin-event-modal-title').textContent = 'Add Event';
            document.getElementById('admin-event-form').reset();
            document.getElementById('admin-event-id').value = '';
            
            const validator = $('#admin-event-form').validate();
            validator.resetForm();
            $('#admin-event-form').find('.error').removeClass('error');
            
            loadClubsForDropdown();
            document.getElementById('admin-event-modal').classList.add('active');
        });

        document.getElementById('admin-close-event-modal').addEventListener('click', () => {
            document.getElementById('admin-event-modal').classList.remove('active');
            const validator = $('#admin-event-form').validate();
            validator.resetForm();
            $('#admin-event-form').find('.error').removeClass('error');
        });

        document.querySelectorAll('.cancel-admin-event-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('admin-event-modal').classList.remove('active');
                const validator = $('#admin-event-form').validate();
                validator.resetForm();
                $('#admin-event-form').find('.error').removeClass('error');
            });
        });

        document.getElementById('admin-event-form').addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!$('#admin-event-form').valid()) {
                return;
            }
            
            const submitBtn = e.target.querySelector('.submit-btn');
            if (submitBtn.disabled) return;
            
            const clubId = parseInt(document.getElementById('admin-event-club').value);
            
            if (!clubId || isNaN(clubId)) {
                toastr.error('Please select a club');
                return;
            }
            
            const eventData = {
                title: document.getElementById('admin-event-name').value.trim(),
                club_id: clubId,
                event_date: document.getElementById('admin-event-date').value,
                description: 'Event description'
            };
            
            if (editMode && editId) {
                submitBtn.disabled = true;
                EventsService.updateEvent(editId, eventData, function(response) {
                    submitBtn.disabled = false;
                    document.getElementById('admin-event-modal').classList.remove('active');
                    loadEvents();
                }, function(error) {
                    submitBtn.disabled = false;
                    console.error('Update error:', error);
                });
            } else {
                submitBtn.disabled = true;
                EventsService.createEvent(eventData, function(response) {
                    submitBtn.disabled = false;
                    document.getElementById('admin-event-modal').classList.remove('active');
                    loadEvents();
                }, function(error) {
                    submitBtn.disabled = false;
                    console.error('Create error:', error);
                });
            }
        });

        document.getElementById('add-club-btn').addEventListener('click', () => {
            editMode = window.adminEditMode = false;
            editId = window.adminEditId = null;
            document.getElementById('admin-club-modal-title').textContent = 'Add Club';
            document.getElementById('admin-club-form').reset();
            document.getElementById('admin-club-id').value = '';
            document.getElementById('admin-club-modal').classList.add('active');
            
            const validator = $('#admin-club-form').validate();
            validator.resetForm();
            $('#admin-club-form').find('.error').removeClass('error');
        });

        document.getElementById('admin-close-club-modal').addEventListener('click', () => {
            document.getElementById('admin-club-modal').classList.remove('active');
            const validator = $('#admin-club-form').validate();
            validator.resetForm();
            $('#admin-club-form').find('.error').removeClass('error');
        });

        document.querySelectorAll('.cancel-admin-club-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('admin-club-modal').classList.remove('active');
                const validator = $('#admin-club-form').validate();
                validator.resetForm();
                $('#admin-club-form').find('.error').removeClass('error');
            });
        });

        document.getElementById('admin-club-form').addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!$('#admin-club-form').valid()) {
                return;
            }
            
            const submitBtn = e.target.querySelector('.submit-btn');
            if (submitBtn.disabled) return;
            submitBtn.disabled = true;
            
            const clubData = {
                club_name: document.getElementById('admin-club-name').value,
                description: document.getElementById('admin-club-description').value,
                creator_user_id: parseInt(document.getElementById('admin-club-user-id').value)
            };
            
            if (editMode && editId) {
                ClubsService.updateClub(editId, clubData, function(response) {
                    submitBtn.disabled = false;
                    document.getElementById('admin-club-modal').classList.remove('active');
                    loadClubs();
                }, function(error) {
                    submitBtn.disabled = false;
                    toastr.error('Failed to update club');
                });
            } else {
                ClubsService.createClub(clubData, function(response) {
                    submitBtn.disabled = false;
                    document.getElementById('admin-club-modal').classList.remove('active');
                    loadClubs();
                }, function(error) {
                    submitBtn.disabled = false;
                    toastr.error('Failed to create club');
                });
            }
        });

        document.getElementById('admin-close-delete-modal').addEventListener('click', () => {
            document.getElementById('admin-delete-modal').classList.remove('active');
        });

        document.getElementById('admin-cancel-delete-btn').addEventListener('click', () => {
            document.getElementById('admin-delete-modal').classList.remove('active');
        });

        document.getElementById('admin-confirm-delete-btn').addEventListener('click', () => {
            if (window.pendingDeleteAction) {
                window.pendingDeleteAction();
                window.pendingDeleteAction = null;
            }
        });

        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });

        loadUsers();
    }

    window.initAdmin = initAdmin;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (document.getElementById('users-tab')) {
                initAdmin();
            }
        });
    } else if (document.getElementById('users-tab')) {
        initAdmin();
    }

})();