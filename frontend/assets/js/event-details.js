window.renderEventDetails = function() {
  const eventId = sessionStorage.getItem('currentEventId');
  if (!eventId) return;

  const event = window.eventsData.find(e => e.id === parseInt(eventId));
  if (!event) return;

  $('.event-hero-image img').attr('src', event.image).attr('alt', event.name);
  $('.event-detail-title').text(event.name);
  $('.event-club-badge').text(event.club);
  $('.event-description-text').first().text(event.description);

  const highlightsList = $('.highlights-list');
  highlightsList.empty();
  event.highlights.forEach(h => highlightsList.append(`<li>${h}</li>`));

  $('.detail-item').each(function() {
    const label = $(this).find('.detail-label').text();
    if (label === 'Date & Time') {
      $(this).find('.detail-value').first().text(event.date);
      $(this).find('.detail-value-sub').text(event.time);
    } else if (label === 'Location') {
      $(this).find('.detail-value').first().text(event.location);
      $(this).find('.detail-value-sub').text(event.building);
    } else if (label === 'Registered') {
      $(this).find('.detail-value').text(`${event.registered} students`);
    } else if (label === 'Organized By') {
      $(this).find('.detail-value').text(event.club);
    }
  });
};
