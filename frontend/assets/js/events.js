toastr.options.preventDuplicates = true;
toastr.options.timeOut = 3000;

let eventsData = [];

function createEventCard(event) {
  return `
    <div class="event-card" data-event-id="${event.id}">
      <div class="event-image">
        <img src="assets/images/image.jpg" alt="${event.title}">
      </div>
      <div class="event-content">
        <p class="event-club">${event.club_name || 'Club'}</p>
        <h3 class="event-name">${event.title}</h3>
        ${event.description ? `<p class="event-description">${event.description.substring(0, 100)}...</p>` : ''}
        <div class="event-details">
          <button class="register-btn">Register</button>
          <span class="event-date">
            <svg width="24" height="24" viewBox="0 0 14 14" fill="none">
              <rect x="2" y="3" width="10" height="9" rx="1" stroke="rgba(255,255,255,1)" stroke-width="1"/>
              <line x1="2" y1="5" x2="12" y2="5" stroke="rgba(255,255,255,0.6)" stroke-width="1"/>
              <line x1="5" y1="1" x2="5" y2="4" stroke="rgba(255,255,255,0.6)" stroke-width="1"/>
              <line x1="9" y1="1" x2="9" y2="4" stroke="rgba(255,255,255,0.6)" stroke-width="1"/>
            </svg>
            ${event.event_date}
          </span>
        </div>
      </div>
    </div>
  `;
}

function displayEvents(eventsToRender = eventsData) {
  const eventsGrid = $('.events-grid');
  
  if (!eventsGrid.length) {
    return;
  }

  eventsGrid.empty();

  if (eventsToRender.length === 0) {
    eventsGrid.html('<p class="no-events">No events found</p>');
    return;
  }

  eventsToRender.forEach(event => {
    eventsGrid.append(createEventCard(event));
  });
}

function loadEvents() {
  EventsService.getAllEvents(function(events) {
    eventsData = events;
    displayEvents(eventsData);
  }, function(error) {
    eventsData = [];
    displayEvents([]);
  });
}

$(document).on('click', '.event-card', function(e) {
  if ($(e.target).hasClass('register-btn')) {
    return;
  }

  const eventId = $(this).data('event-id');
  sessionStorage.setItem('currentEventId', eventId);
  window.location.hash = '#event-details';
});

$(document).on('click', '.register-btn', function(e) {
  e.stopPropagation();
  const user = UserService.getCurrentUser();
  
  if (!user) {
    toastr.warning('Please login to register for events');
    window.location.hash = '#login';
    return;
  }
  
  const eventId = $(this).closest('.event-card').data('event-id');
  const event = eventsData.find(e => e.id === eventId);
  
  if (event) {
    showQuickRegisterModal(event, user);
  }
});

function showQuickRegisterModal(event, user) {
  RegistrationsService.isUserRegistered(user.id, event.id, function(response) {
    const isRegistered = response.is_registered || false;
    
    if (isRegistered) {
      toastr.info('You are already registered for this event!');
      return;
    }
    
    const modalHtml = `
      <div class="registration-modal-overlay" id="quickRegisterModal">
        <div class="registration-modal">
          <div class="registration-modal-header">
            <h3>Confirm Registration</h3>
          </div>
          <div class="registration-modal-body">
            <p>Are you sure you want to register for <strong>${event.title}</strong>?</p>
          </div>
          <div class="registration-modal-footer">
            <button class="modal-btn modal-btn-cancel" onclick="closeQuickRegisterModal()">Cancel</button>
            <button class="modal-btn modal-btn-confirm" onclick="confirmQuickRegistration(${event.id}, ${user.id})">Confirm</button>
          </div>
        </div>
      </div>
    `;
    
    $('#quickRegisterModal').remove();
    $('body').append(modalHtml);
  });
}

function closeQuickRegisterModal() {
  $('#quickRegisterModal').remove();
}

function confirmQuickRegistration(eventId, userId) {
  closeQuickRegisterModal();
  
  RegistrationsService.registerUser(userId, eventId, function(response) {
    toastr.success('Successfully registered for event!');
  }, function(error) {
    toastr.error('Registration failed. You are already registered.');
  });
}

window.closeQuickRegisterModal = closeQuickRegisterModal;
window.confirmQuickRegistration = confirmQuickRegistration;

function setupSearch() {
  $('.search-input').off('input').on('input', function() {
    const searchTerm = $(this).val().toLowerCase();

    if (searchTerm === '') {
      displayEvents(eventsData);
    } else {
      const filteredEvents = eventsData.filter(event => 
        event.title.toLowerCase().includes(searchTerm) ||
        (event.club_name && event.club_name.toLowerCase().includes(searchTerm)) ||
        (event.description && event.description.toLowerCase().includes(searchTerm))
      );
      displayEvents(filteredEvents);
    }
  });
}

function renderEvents() {
  setTimeout(function() {
    loadEvents();
    setupSearch();
  }, 100);
}

window.renderEvents = renderEvents;