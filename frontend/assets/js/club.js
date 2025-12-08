(function() {
    toastr.options.preventDuplicates = true;
    toastr.options.timeOut = 3000;
    
    window.clubData = window.clubData || null;
    window.clubEvents = window.clubEvents || [];
    window.editMode = window.editMode || false;
    window.editEventId = window.editEventId || null;
    window.registrations = window.registrations || [];
    window.clubInitialized = window.clubInitialized || false;

    let clubData = window.clubData;
    let clubEvents = window.clubEvents;
    let editMode = window.editMode;
    let editEventId = window.editEventId;
    let registrations = window.registrations;

    function renderClubDetails() {
        const user = UserService.getCurrentUser();
        if (!user) {
            toastr.error('Please login to view your club');
            window.location.hash = '#login';
            return;
        }

        ClubsService.getClubsByCreator(user.id, function(clubs) {
            if (!clubs || clubs.length === 0) {
                toastr.info('You do not have a club yet');
                window.location.hash = '#home';
                return;
            }

            clubData = window.clubData = clubs[0];
            updateClubInfo();

            EventsService.getEventsByClub(clubData.id, function(events) {
                clubEvents = window.clubEvents = events;
                renderEvents();
                updateEventsCount();
            }, function(err) {
                clubEvents = window.clubEvents = [];
                renderEvents();
                updateEventsCount();
            });
        }, function(err) {
            toastr.error('Failed to load your club');
            window.location.hash = '#home';
        });
    }

    function updateClubInfo() {
        if (!clubData) return;
        document.querySelector('.club-name').textContent = clubData.club_name;
        document.querySelector('.club-description').textContent = clubData.description || 'No description';
    }

    function updateEventsCount() {
        const countElements = document.querySelectorAll('.events-count');
        countElements.forEach(el => {
            el.textContent = clubEvents.length;
        });
        
        const countById = document.getElementById('events-count');
        if (countById) {
            countById.textContent = "Your Events: " + clubEvents.length;
        }
    }

    function renderEvents() {
        const grid = document.getElementById('events-grid');
        if (!grid) return;
        
        grid.innerHTML = '';

        if (!clubEvents || clubEvents.length === 0) {
            grid.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">No events yet. Click "Add Event" to create one!</p>';
            return;
        }

        clubEvents.forEach(event => {
            const eventDate = new Date(event.event_date);
            const formattedDate = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

            const card = document.createElement('div');
            card.className = 'club-event-card';
            card.innerHTML = `
                <div class="club-event-image">
                    <img src="assets/images/image.jpg">
                </div>
                <div class="club-event-content">
                    <h3 class="club-event-name">${event.title}</h3>
                    <div class="club-event-meta">
                        <span class="event-date-badge">${formattedDate}</span>
                        <span class="event-location">${event.location || ''}</span>
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
        updateEventsCount();
    }

    function fetchAllRegistrations() {
        if (!clubEvents || clubEvents.length === 0) {
            renderRegistrationsTable();
            return;
        }

        const allEventIds = clubEvents.map(e => e.id);
        registrations = window.registrations = [];

        let pending = allEventIds.length;
        allEventIds.forEach(eventId => {
            RegistrationsService.getRegistrationsByEvent(eventId, function(regs) {
                registrations = window.registrations = registrations.concat(regs.map(r => ({
                    ...r,
                    eventTitle: clubEvents.find(e => e.id === eventId)?.title || ''
                })));
                pending--;
                if (pending === 0) renderRegistrationsTable();
            }, function(err) {
                pending--;
                if (pending === 0) renderRegistrationsTable();
            });
        });
    }

    function renderRegistrationsTable() {
        const tbody = document.getElementById('registrations-tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';

        if (!registrations || registrations.length === 0) {
            tbody.innerHTML = '<div class="table-row"><div class="table-col" style="grid-column: 1 / -1; text-align: center; color: #666;">No registrations found.</div></div>';
            return;
        }

        const filterValue = document.getElementById('event-filter').value;
        const filteredRegs = filterValue === 'all' ? registrations : registrations.filter(r => r.eventTitle.toLowerCase().replace(/\s+/g, '-') === filterValue);

        if (filteredRegs.length === 0) {
            tbody.innerHTML = '<div class="table-row"><div class="table-col" style="grid-column: 1 / -1; text-align: center; color: #666;">No registrations for this filter.</div></div>';
            return;
        }

        filteredRegs.forEach(r => {
            const row = document.createElement('div');
            row.className = 'table-row';
            row.innerHTML = `
                <div class="table-col col-name">${r.name || 'User ' + r.user_id}</div>
                <div class="table-col col-email">${r.email || '-'}</div>
                <div class="table-col col-event">${r.eventTitle || '-'}</div>
                <div class="table-col col-date">${new Date(r.registered_at || r.created_at || Date.now()).toLocaleDateString()}</div>
            `;
            tbody.appendChild(row);
        });
    }

    function updateEventFilter() {
        const filter = document.getElementById('event-filter');
        if (!filter) return;
        
        filter.innerHTML = '<option value="all">All Events</option>';
        clubEvents.forEach(event => {
            const option = document.createElement('option');
            const slug = event.title.toLowerCase().replace(/\s+/g, '-');
            option.value = slug;
            option.textContent = event.title;
            filter.appendChild(option);
        });

        filter.onchange = renderRegistrationsTable;
    }

    window.editEvent = function(id) {
        editMode = window.editMode = true;
        editEventId = window.editEventId = id;

        const event = clubEvents.find(e => e.id === id);
        if (!event) return;

        document.getElementById('event-modal-title').textContent = 'Edit Event';
        document.getElementById('event-id').value = event.id;
        document.getElementById('event-name').value = event.title;
        document.getElementById('event-date').value = event.event_date.split('T')[0];
        
        const imageField = document.getElementById('event-image');
        if (imageField) {
            imageField.value = event.image || '';
        }
        
        const descField = document.getElementById('event-description');
        if (descField) {
            descField.value = event.description || '';
        }
        
        const locationField = document.getElementById('event-location');
        if (locationField) {
            locationField.value = event.location || '';
        }

        document.getElementById('event-modal').classList.add('active');
    };

    window.deleteEvent = function(id) {
        const event = clubEvents.find(e => e.id === id);
        if (!event) return;

        document.getElementById('delete-modal-title').textContent = 'Delete Event';
        document.getElementById('delete-modal-message').textContent = `Are you sure you want to delete "${event.title}"? This action cannot be undone.`;
        document.getElementById('delete-modal').classList.add('active');
        
        window.pendingDeleteAction = function() {
            document.getElementById('delete-modal').classList.remove('active');
            
            EventsService.deleteEvent(id, function() {
                toastr.success('Event deleted successfully!');
                clubEvents = window.clubEvents = clubEvents.filter(e => e.id !== id);
                registrations = window.registrations = registrations.filter(r => r.event_id !== id);
                renderEvents();
                renderRegistrationsTable();
            }, function(error) {
                toastr.error('Failed to delete event');
            });
        };
    };

    function init() {
        if (window.clubInitialized) {
            renderClubDetails();
            return;
        }
        window.clubInitialized = true;

        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const tabName = this.getAttribute('data-tab');
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                document.getElementById(tabName + '-tab').classList.add('active');

                if (tabName === 'registrations') fetchAllRegistrations();
            });
        });

        document.getElementById('edit-club-btn').addEventListener('click', () => {
            if (!clubData) {
                toastr.error('Club data not loaded');
                return;
            }
            document.getElementById('club-name').value = clubData.club_name || '';
            document.getElementById('club-description').value = clubData.description || '';
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
            
            const clubData_form = {
                club_name: document.getElementById('club-name').value,
                description: document.getElementById('club-description').value
            };
            
            ClubsService.updateClub(clubData.id, clubData_form, function(response) {
                toastr.success('Club updated successfully!');
                clubData.club_name = clubData_form.club_name;
                clubData.description = clubData_form.description;
                window.clubData = clubData;
                updateClubInfo();
                document.getElementById('club-modal').classList.remove('active');
            }, function(err) {
                toastr.error(err.responseJSON?.message || 'Failed to update club');
            });
        });

        document.getElementById('add-event-btn').addEventListener('click', () => {
            editMode = window.editMode = false;
            editEventId = window.editEventId = null;
            document.getElementById('event-form').reset();
            document.getElementById('event-id').value = '';
            document.getElementById('event-modal-title').textContent = 'Add New Event';
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
            
            const eventData = {
                title: document.getElementById('event-name').value.trim(),
                event_date: document.getElementById('event-date').value,
                club_id: clubData.id
            };
            
            const imageField = document.getElementById('event-image');
            if (imageField) {
                eventData.image = imageField.value.trim() || '';
            }
            
            const descField = document.getElementById('event-description');
            if (descField) {
                eventData.description = descField.value.trim() || '';
            }
            
            const locationField = document.getElementById('event-location');
            if (locationField) {
                eventData.location = locationField.value.trim() || '';
            }

            if (editMode && editEventId) {
                EventsService.updateEvent(editEventId, eventData, function(updated) {
                    toastr.success('Event updated successfully!');
                    const index = clubEvents.findIndex(e => e.id === editEventId);
                    if (index !== -1) {
                        clubEvents[index] = updated;
                        window.clubEvents = clubEvents;
                    }
                    renderEvents();
                    document.getElementById('event-modal').classList.remove('active');
                }, function(err) {
                    toastr.error(err.responseJSON?.message || 'Failed to update event');
                });
            } else {
                EventsService.createEvent(eventData, function(newEvent) {
                    toastr.success('Event created successfully!');
                    clubEvents.push(newEvent);
                    window.clubEvents = clubEvents;
                    renderEvents();
                    document.getElementById('event-modal').classList.remove('active');
                }, function(err) {
                    toastr.error(err.responseJSON?.message || 'Failed to create event');
                });
            }
        });

        document.getElementById('close-delete-modal').addEventListener('click', () => {
            document.getElementById('delete-modal').classList.remove('active');
        });

        document.getElementById('cancel-delete-btn').addEventListener('click', () => {
            document.getElementById('delete-modal').classList.remove('active');
        });

        document.getElementById('confirm-delete-btn').addEventListener('click', () => {
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

        renderClubDetails();
    }

    window.initClub = init;
    
    window.cleanupClub = function() {
        window.clubInitialized = false;
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else if (document.getElementById('club')) {
        init();
    }

})();