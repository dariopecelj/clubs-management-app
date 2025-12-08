function renderEventDetails() {

  toastr.options.preventDuplicates = true;
  toastr.options.timeOut = 3000;
  
  const eventId = sessionStorage.getItem('currentEventId');
  
  if (!eventId) {
    toastr.error('Event not found');
    window.location.hash = '#events';
    return;
  }

  EventsService.getEventWithClub(eventId, function(event) {
    displayEventDetails(event);
  }, function(error) {
    toastr.error('Failed to load event details');
    EventsService.getEventById(eventId, function(event) {
      displayEventDetails(event);
    }, function(err) {
      window.location.hash = '#events';
    });
  });
}

function displayEventDetails(event) {
  $('.event-detail-title').text(event.title);
  $('.event-club-badge').text(event.club_name || 'Club');

  if (event.description) {
    $('.event-description-text').first().text(event.description);
  }

  if (event.highlights && Array.isArray(event.highlights)) {
    const highlightsList = $('.highlights-list');
    highlightsList.empty();
    event.highlights.forEach(highlight => {
      highlightsList.append(`<li>${highlight}</li>`);
    });
  } else if (event.description) {
    $('.event-highlights').hide();
  }

  updateEventDetail('Date & Time', formatEventDate(event.event_date), event.time || '');
  updateEventDetail('Location', event.location || 'TBA', event.building || '');
  
  RegistrationsService.getRegistrationCount(event.id, function(response) {
    const count = response.count || 0;
    updateEventDetail('Registered', `${count} students`, '');
  }, function(error) {
    updateEventDetail('Registered', 'Registration open', '');
  });
  
  updateEventDetail('Organized By', event.club_name || 'Club', '');

  checkAndSetupRegistrationButton(event);
}

function checkAndSetupRegistrationButton(event) {
  const user = UserService.getCurrentUser();
  
  if (!user) {
    setupRegistrationButton(event, false);
    return;
  }

  RegistrationsService.isUserRegistered(user.id, event.id, function(response) {
    const isRegistered = response.is_registered || false;
    setupRegistrationButton(event, isRegistered);
  }, function(error) {
    setupRegistrationButton(event, false);
  });
}

function setupRegistrationButton(event, isRegistered) {
  const btn = $('.event-register-btn');
  
  if (isRegistered) {
    btn.html(`
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M15 5L5 15M5 5L15 15" stroke="white" stroke-width="2" stroke-linecap="round"/>
      </svg>
      Unregister from Event
    `);
    btn.addClass('unregister-btn');
    
    btn.off('click').on('click', function() {
      const user = UserService.getCurrentUser();
      if (!user) {
        toastr.warning('Please login first');
        window.location.hash = '#login';
        return;
      }
      
      showUnregisterModal(event, user);
    });
  } else {
    btn.html(`
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z" stroke="white" stroke-width="2"/>
        <path d="M8 10L9.5 11.5L12.5 8.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Register for Event
    `);
    btn.removeClass('unregister-btn');
    
    btn.off('click').on('click', function() {
      const user = UserService.getCurrentUser();
      
      if (!user) {
        toastr.warning('Please login to register for events');
        window.location.hash = '#login';
        return;
      }

      showRegisterModal(event, user);
    });
  }
}

function showRegisterModal(event, user) {
  const modalHtml = `
    <div class="registration-modal-overlay" id="registerModal">
      <div class="registration-modal">
        <div class="registration-modal-header">
          <h3>Confirm Registration</h3>
        </div>
        <div class="registration-modal-body">
          <p>Are you sure you want to register for <strong>${event.title}</strong>?</p>
        </div>
        <div class="registration-modal-footer">
          <button class="modal-btn modal-btn-cancel" onclick="closeRegisterModal()">Cancel</button>
          <button class="modal-btn modal-btn-confirm" onclick="confirmRegistration(${event.id}, ${user.id})">Confirm</button>
        </div>
      </div>
    </div>
  `;
  
  $('#registerModal').remove();
  
  $('body').append(modalHtml);
}

function showUnregisterModal(event, user) {
  const modalHtml = `
    <div class="registration-modal-overlay" id="unregisterModal">
      <div class="registration-modal">
        <div class="registration-modal-header">
          <h3>Confirm Unregistration</h3>
        </div>
        <div class="registration-modal-body">
          <p>Are you sure you want to unregister from <strong>${event.title}</strong>?</p>
        </div>
        <div class="registration-modal-footer">
          <button class="modal-btn modal-btn-cancel" onclick="closeUnregisterModal()">Cancel</button>
          <button class="modal-btn modal-btn-confirm" onclick="confirmUnregistration(${event.id}, ${user.id})">Confirm</button>
        </div>
      </div>
    </div>
  `;
  
  $('#unregisterModal').remove();
  
  $('body').append(modalHtml);
}

function closeRegisterModal() {
  $('#registerModal').remove();
}

function closeUnregisterModal() {
  $('#unregisterModal').remove();
}

function confirmRegistration(eventId, userId) {
  closeRegisterModal();
  
  RegistrationsService.registerUser(userId, eventId, function(response) {
    toastr.success('Successfully registered for event!');
    renderEventDetails();
  }, function(error) {
    toastr.error('Registration failed. You are already registered');
  });
}

function confirmUnregistration(eventId, userId) {
  closeUnregisterModal();
  
  RegistrationsService.unregisterUser(userId, eventId, function(response) {
    toastr.success('Successfully unregistered from event!');
    renderEventDetails();
  }, function(error) {
    toastr.error('Unregistration failed. Please try again.');
  });
}

window.closeRegisterModal = closeRegisterModal;
window.closeUnregisterModal = closeUnregisterModal;
window.confirmRegistration = confirmRegistration;
window.confirmUnregistration = confirmUnregistration;

function updateEventDetail(label, value, subValue = '') {
  $('.detail-item').each(function() {
    const itemLabel = $(this).find('.detail-label').text();
    if (itemLabel === label) {
      $(this).find('.detail-value').first().text(value);
      if (subValue) {
        $(this).find('.detail-value-sub').text(subValue);
      }
    }
  });
}

function formatEventDate(dateString) {
  if (!dateString) return 'TBA';
  
  try {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  } catch (e) {
    return dateString;
  }
}

$(document).on('click', '.back-to-events', function(e) {
  e.preventDefault();
  window.location.hash = '#events';
});

$(document).on('click', '.registration-modal-overlay', function(e) {
  if ($(e.target).hasClass('registration-modal-overlay')) {
    closeRegisterModal();
    closeUnregisterModal();
  }
});

window.renderEventDetails = renderEventDetails;