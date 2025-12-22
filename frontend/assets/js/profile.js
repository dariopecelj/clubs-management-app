let userProfile = null;
let userClub = null;
let userEvents = [];
let isProfileInitialized = false;

toastr.options.preventDuplicates = true;
toastr.options.timeOut = 3000;

function fetchUserProfile() {
    const currentUser = UserService.getCurrentUser();
    if (!currentUser) {
        toastr.error("Please login to view profile");
        window.location.hash = "#login";
        return;
    }

    userProfile = currentUser;

    ClubsService.getClubsByCreator(userProfile.id, function(clubs) {
        userClub = clubs && clubs.length > 0 ? clubs[0] : null;
        fetchUserEvents();
    }, function(err) {
        toastr.error("Failed to fetch your club");
        userClub = null;
        fetchUserEvents();
    });
}

function fetchUserEvents() {
    if (!userClub) {
        userEvents = [];
        renderProfile();
        return;
    }

    EventsService.getEventsByClub(userClub.id, function(events) {
        userEvents = events;
        renderProfile();
    }, function(err) {
        userEvents = [];
        renderProfile();
    });
}

function renderProfile() {
    if (!userProfile) return;

    document.getElementById("profile-name").textContent = userProfile.full_name || "Unnamed";
    document.getElementById("profile-email").textContent = userProfile.email;
    document.getElementById("profile-id").textContent = `ID: ${userProfile.id}`;
    document.getElementById("profile-pic").src = userProfile.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop";

    const clubsGrid = document.getElementById("clubs-grid");
    clubsGrid.innerHTML = "";

    if (userClub) {
        const card = document.createElement("div");
        card.className = "user-club-card";
        card.style.cursor = "pointer";
        card.innerHTML = `
            <div class="club-card-header">
                <div class="club-card-logo">
                    <img src="./assets/images/logo.jpg" alt="${userClub.club_name}">
                </div>
                <div class="club-card-info">
                    <h3 class="club-card-name">${userClub.club_name}</h3>
                    <p class="club-card-role">${userClub.role || 'Admin'}</p>
                </div>
            </div>
            <div class="club-card-stats">
                <span class="club-stat">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <rect x="3" y="4" width="10" height="9" rx="1" stroke="rgba(255,255,255,0.5)" stroke-width="1.5"/>
                        <line x1="3" y1="6" x2="13" y2="6" stroke="rgba(255,255,255,0.5)" stroke-width="1.5"/>
                    </svg>
                    ${userEvents.length} Events
                </span>
            </div>
        `;
        clubsGrid.appendChild(card);

        card.addEventListener("click", () => {
            window.location.hash = "#club";
        });
    }

    const clubsCount = document.getElementById("clubs-count");
    clubsCount.textContent = userClub ? "1 club" : "0 clubs";

    const eventsTbody = document.getElementById("events-tbody");
    eventsTbody.innerHTML = "";

    userEvents.forEach(event => {
        const row = document.createElement("div");
        row.className = "data-row";
        const eventDate = new Date(event.event_date);
        const formattedDate = eventDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        row.innerHTML = `
            <div data-label="Event Name">${event.title}</div>
            <div data-label="Club">${userClub.club_name}</div>
            <div data-label="Date">${formattedDate}</div>
        `;
        eventsTbody.appendChild(row);
    });

    const eventsCount = document.getElementById("events-count");
    eventsCount.textContent = `${userEvents.length} ${userEvents.length === 1 ? 'event' : 'events'}`;
}

function initProfile() {
    if (isProfileInitialized) return;

    UserService.init();

    const editBtn = document.getElementById("edit-profile-btn");
    if (editBtn) {
        editBtn.addEventListener("click", () => {
            document.getElementById("edit-name").value = userProfile.full_name || "";
            document.getElementById("edit-email").value = userProfile.email || "";
            document.getElementById("new-password").value = "";
            document.getElementById("confirm-password").value = "";
            document.getElementById("profile-modal").classList.add("active");
            $('#profile-form').validate().resetForm();
        });
    }

    const closeModal = document.getElementById("close-profile-modal");
    closeModal?.addEventListener("click", () => {
        document.getElementById("profile-modal").classList.remove("active");
        $('#profile-form').validate().resetForm();
    });
    
    document.querySelectorAll(".cancel-profile-modal").forEach(btn => {
        btn.addEventListener("click", () => {
            document.getElementById("profile-modal").classList.remove("active");
            $('#profile-form').validate().resetForm();
        });
    });

    document.querySelectorAll(".modal").forEach(modal => {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.remove("active");
            }
        });
    });

    fetchUserProfile();

    isProfileInitialized = true;
}

window.initProfile = initProfile;