const eventsData = [
  {
    id: 1,
    name: "AWS Workshop",
    club: "AWS IBU Club",
    date: "17.02.2025",
    time: "20:00",
    location: "Room A-201",
    building: "Engineering Building",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop",
    description: "Join us for an immersive AWS Workshop where you'll learn the fundamentals of cloud computing and Amazon Web Services. This hands-on session will cover essential AWS services including EC2, S3, Lambda, and more.",
    highlights: [
      "Introduction to AWS Cloud Infrastructure",
      "Hands-on experience with key AWS services",
      "Best practices for cloud architecture",
      "Security and cost optimization strategies"
    ],
    registered: 47,
    capacity: 60
  },
  {
    id: 2,
    name: "Hackathon 2025",
    club: "Tech Club",
    date: "25.02.2025",
    time: "09:00",
    location: "Main Hall",
    building: "Student Center",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=250&fit=crop",
    description: "24-hour coding marathon where students collaborate to build innovative solutions. Form teams, tackle real-world problems, and compete for amazing prizes!",
    highlights: [
      "24-hour intensive coding experience",
      "Mentorship from industry professionals",
      "Networking opportunities",
      "Prizes for top teams"
    ],
    registered: 89,
    capacity: 120
  },
  {
    id: 3,
    name: "AI & Machine Learning Talk",
    club: "Data Science Club",
    date: "10.03.2025",
    time: "18:30",
    location: "Room B-105",
    building: "Computer Science Building",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop",
    description: "Explore the latest trends in AI and Machine Learning with guest speakers from leading tech companies. Learn about real-world applications and career opportunities.",
    highlights: [
      "Industry expert presentations",
      "Latest AI trends and technologies",
      "Q&A session with speakers",
      "Networking with professionals"
    ],
    registered: 65,
    capacity: 80
  },
  {
    id: 4,
    name: "Web Development Bootcamp",
    club: "Code Club",
    date: "15.03.2025",
    time: "14:00",
    location: "Lab C-301",
    building: "Engineering Building",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop",
    description: "Intensive hands-on bootcamp covering modern web development. Learn HTML, CSS, JavaScript, and popular frameworks to build your first web application.",
    highlights: [
      "Full-stack web development basics",
      "Modern JavaScript frameworks",
      "Responsive design principles",
      "Build and deploy your first app"
    ],
    registered: 34,
    capacity: 40
  },
  {
    id: 5,
    name: "Cybersecurity Workshop",
    club: "Security Club",
    date: "22.03.2025",
    time: "16:00",
    location: "Room D-202",
    building: "IT Building",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=250&fit=crop",
    description: "Learn essential cybersecurity concepts, ethical hacking techniques, and how to protect systems from cyber threats. Hands-on labs included.",
    highlights: [
      "Network security fundamentals",
      "Ethical hacking demonstrations",
      "Practical security labs",
      "Industry certifications overview"
    ],
    registered: 52,
    capacity: 60
  },
  {
    id: 6,
    name: "Startup Pitch Competition",
    club: "Entrepreneurship Club",
    date: "05.04.2025",
    time: "13:00",
    location: "Auditorium",
    building: "Main Campus",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=250&fit=crop",
    description: "Present your startup ideas to a panel of investors and entrepreneurs. Top ideas receive funding and mentorship opportunities.",
    highlights: [
      "Pitch to real investors",
      "Funding opportunities",
      "Business mentorship",
      "Networking with entrepreneurs"
    ],
    registered: 28,
    capacity: 50
  }
];


window.eventsData = eventsData;

function createEventCard(event) {
  return `
    <div class="event-card" data-event-id="${event.id}">
      <div class="event-image">
        <img src="${event.image}" alt="${event.name}">
      </div>
      <div class="event-content">
        <p class="event-club">${event.club}</p>
        <h3 class="event-name">${event.name}</h3>
        <div class="event-details">
          <button class="register-btn">Register</button>
          <span class="event-date">
            <svg width="24" height="24" viewBox="0 0 14 14" fill="none">
              <rect x="2" y="3" width="10" height="9" rx="1" stroke="rgba(255,255,255,1)" stroke-width="1"/>
              <line x1="2" y1="5" x2="12" y2="5" stroke="rgba(255,255,255,0.6)" stroke-width="1"/>
              <line x1="5" y1="1" x2="5" y2="4" stroke="rgba(255,255,255,0.6)" stroke-width="1"/>
              <line x1="9" y1="1" x2="9" y2="4" stroke="rgba(255,255,255,0.6)" stroke-width="1"/>
            </svg>
            ${event.time} - ${event.date}
          </span>
        </div>
      </div>
    </div>
  `;
}

function renderEvents(eventsToRender = eventsData) {
  const eventsGrid = $('.events-grid');
  eventsGrid.empty();

  eventsToRender.forEach(event => {
    eventsGrid.append(createEventCard(event));
  });
}

$(document).on('click', '.event-card', function() {
  const eventId = $(this).data('event-id');
  sessionStorage.setItem('currentEventId', eventId);

  window.location.hash = '#event-details';
});

$(document).on('click', '.register-btn', function(e) {
  e.stopPropagation();
  const eventId = $(this).closest('.event-card').data('event-id');
  const event = eventsData.find(e => e.id === eventId);
  alert(`Registration for "${event.name}" coming soon!`);
});

function setupSearch() {
  $('.search-input').on('input', function() {
    const searchTerm = $(this).val().toLowerCase();

    if (searchTerm === '') {
      renderEvents(eventsData);
    } else {
      const filteredEvents = eventsData.filter(event => 
        event.name.toLowerCase().includes(searchTerm) ||
        event.club.toLowerCase().includes(searchTerm) ||
        event.description.toLowerCase().includes(searchTerm)
      );
      renderEvents(filteredEvents);
    }
  });
}

function initEventsPage() {
  renderEvents();
  setupSearch();
}

$(document).ready(function() {
  if ($('.events-container').length) {
    initEventsPage();
  }
});

window.initEventsPage = initEventsPage;