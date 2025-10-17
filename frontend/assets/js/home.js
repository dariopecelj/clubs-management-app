let createdClubs = [];

function initHome() {

  document.getElementById('view-events-btn').addEventListener('click', () => {
    window.location.hash = '#events';
  });

  document.getElementById('create-club-btn').addEventListener('click', () => {
    document.getElementById('create-club-modal').classList.add('active');
  });

  document.getElementById('close-club-modal').addEventListener('click', () => {
    document.getElementById('create-club-modal').classList.remove('active');
  });

  document.querySelectorAll('.cancel-club-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      document.getElementById('create-club-modal').classList.remove('active');
    });
  });

  document.getElementById('create-club-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const clubName = document.getElementById('club-name').value;
    const clubDescription = document.getElementById('club-description').value;
    const clubLogoLink = document.getElementById('club-logo-link').value;

    if (!clubName.trim()) {
      alert('Please enter a club name');
      return;
    }

    if (!clubDescription.trim()) {
      alert('Please enter a club description');
      return;
    }

    if (!clubLogoLink.trim()) {
      alert('Please enter a logo URL');
      return;
    }

    const newClub = {
      id: Date.now(),
      name: clubName,
      description: clubDescription,
      logo: clubLogoLink,
      createdAt: new Date()
    };

    createdClubs.push(newClub);

    alert(`Club "${clubName}" created successfully!`);

    document.getElementById('create-club-form').reset();

    document.getElementById('create-club-modal').classList.remove('active');

    console.log('Created Clubs:', createdClubs);
  });

  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHome);
} else {
  initHome();
}