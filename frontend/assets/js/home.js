toastr.options.preventDuplicates = true;
toastr.options.timeOut = 3000;

function initHome() {
  ClubsService.init();

  const viewEventsBtn = document.getElementById('view-events-btn');
  if (viewEventsBtn) {
    viewEventsBtn.addEventListener('click', () => {
      window.location.hash = '#events';
    });
  }

  const createClubBtn = document.getElementById('create-club-btn');
  if (createClubBtn) {
    createClubBtn.addEventListener('click', () => {
      const user = UserService.getCurrentUser();
      
      if (!user) {
        toastr.warning('Please login to create a club');
        window.location.hash = '#login';
        return;
      }

      checkUserClubAndOpenModal(user);
    });
  }

  const closeModalBtn = document.getElementById('close-club-modal');
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      closeCreateClubModal();
    });
  }

  document.querySelectorAll('.cancel-club-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      closeCreateClubModal();
    });
  });

  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });
}

function checkUserClubAndOpenModal(user) {
  ClubsService.getClubsByCreator(user.id, function(clubs) {
    if (clubs && clubs.length > 0) {
      toastr.warning('You already have a club! You can only create one club.');
      
      showAlreadyHasClubModal(clubs[0]);
    } else {
      openCreateClubModal();
    }
  }, function(error) {
    openCreateClubModal();
  });
}

function showAlreadyHasClubModal(club) {
  const modalHtml = `
    <div class="registration-modal-overlay" id="alreadyHasClubModal">
      <div class="registration-modal">
        <div class="registration-modal-header">
          <h3>Club Already Exists</h3>
        </div>
        <div class="registration-modal-body">
          <p>You already have a club: <strong>${club.club_name}</strong></p>
          <p style="margin-top: 15px; color: rgba(255,255,255,0.8);">Each user can only create one club. You can manage your existing club from your profile.</p>
        </div>
        <div class="registration-modal-footer">
          <button class="modal-btn modal-btn-confirm" onclick="closeAlreadyHasClubModal()">OK</button>
        </div>
      </div>
    </div>
  `;
  
  $('#alreadyHasClubModal').remove();
  $('body').append(modalHtml);
}

function closeAlreadyHasClubModal() {
  $('#alreadyHasClubModal').remove();
}

window.closeAlreadyHasClubModal = closeAlreadyHasClubModal;

function openCreateClubModal() {
  const modal = document.getElementById('create-club-modal');
  if (modal) {
    modal.classList.add('active');
  }
}

function closeCreateClubModal() {
  const modal = document.getElementById('create-club-modal');
  if (modal) {
    modal.classList.remove('active');
  }
  
  const form = document.getElementById('create-club-form');
  if (form) {
    form.reset();
    $(form).validate().resetForm();
  }
}

if (typeof window !== 'undefined') {
  window.initHome = initHome;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHome);
} else if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(initHome, 100);
}