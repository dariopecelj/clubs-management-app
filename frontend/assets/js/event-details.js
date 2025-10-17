function renderEventDetail() {
  const eventId = sessionStorage.getItem('currentEventId');
  if (!eventId) return;

  const event = window.eventsData.find(e => e.id === parseInt(eventId));
  if (!event) return;

  $('.event-hero-image img').attr('src', event.image).attr('alt', event.name);

  $('.event-detail-title').text(event.name);
  $('.event-club-badge').text(event.club);

  $('.event-description-text').first().text(event.description);
  $('.event-description-text').last().remove();

  const highlightsList = $('.highlights-list');
  highlightsList.empty();
  event.highlights.forEach(h => highlightsList.append(`<li>${h}</li>`));

  $('.detail-content:contains("Date & Time") .detail-value').text(event.date);
  $('.detail-content:contains("Date & Time") .detail-value-sub').text(event.time);
  $('.detail-content:contains("Location") .detail-value').text(event.location);
  $('.detail-content:contains("Location") .detail-value-sub').text(event.building);
  $('.detail-content:contains("Registered") .detail-value').text(`${event.registered} students`);
  $('.detail-content:contains("Organized By") .detail-value').text(event.club);
}

window.renderEventDetail = renderEventDetail;
