var EventsService = {

    init: function() {
        $("#club-form").validate({
            rules: {
                name: {
                    required: true,
                    minlength: 3,
                    maxlength: 200
                },
                description: {
                    required: true,
                    minlength: 10,
                    maxlength: 1000
                }
            },
            messages: {
                name: {
                    required: 'Please enter club name',
                    minlength: 'Name must be at least 3 characters',
                    maxlength: 'Name cannot exceed 200 characters'
                },
                description: {
                    required: 'Please enter club description',
                    minlength: 'Description must be at least 10 characters',
                    maxlength: 'Description cannot exceed 1000 characters'
                }
            }
        });

        $("#event-form").validate({
            rules: {
                name: {
                    required: true,
                    minlength: 3,
                    maxlength: 200
                },
                date: {
                    required: true,
                    date: true
                },
                description: {
                    maxlength: 1000
                },
                location: {
                    maxlength: 200
                }
            },
            messages: {
                name: {
                    required: 'Please enter event name',
                    minlength: 'Name must be at least 3 characters',
                    maxlength: 'Name cannot exceed 200 characters'
                },
                date: {
                    required: 'Please select event date',
                    date: 'Please enter a valid date'
                },
                description: {
                    maxlength: 'Description cannot exceed 1000 characters'
                },
                location: {
                    maxlength: 'Location cannot exceed 200 characters'
                }
            }
        });

        if ($("#admin-event-form").length) {
            $("#admin-event-form").validate({
                rules: {
                    name: {
                        required: true,
                        minlength: 3
                    },
                    club_id: 'required',
                    date: 'required'
                },
                messages: {
                    name: {
                        required: 'Please enter event name',
                        minlength: 'Name must be at least 3 characters'
                    },
                    club_id: 'Please select a club',
                    date: 'Please select event date'
                }
            });
        }
    },
    
    getAllEvents: function(callback, errorCallback) {
        RestClient.get('events', function(response) {
            if (callback) callback(response);
        }, function(error) {
            console.error('Error fetching events:', error);
            toastr.error('Failed to load events');
            if (errorCallback) errorCallback(error);
        });
    },

    getEventsByClub: function(clubId, callback, errorCallback) {
        RestClient.get('events?club_id=' + clubId, function(response) {
            if (callback) callback(response);
        }, function(error) {
            console.error('Error fetching club events:', error);
            toastr.error('Failed to load club events');
            if (errorCallback) errorCallback(error);
        });
    },

    searchEvents: function(searchTerm, callback, errorCallback) {
        RestClient.get('events?search=' + encodeURIComponent(searchTerm), function(response) {
            if (callback) callback(response);
        }, function(error) {
            console.error('Error searching events:', error);
            if (errorCallback) errorCallback(error);
        });
    },

    getEventById: function(eventId, callback, errorCallback) {
        RestClient.get('events/' + eventId, function(response) {
            if (callback) callback(response);
        }, function(error) {
            console.error('Error fetching event:', error);
            toastr.error('Failed to load event details');
            if (errorCallback) errorCallback(error);
        });
    },

    getEventWithClub: function(eventId, callback, errorCallback) {
        RestClient.get('events/' + eventId + '/with-club', function(response) {
            if (callback) callback(response);
        }, function(error) {
            console.error('Error fetching event with club info:', error);
            toastr.error('Failed to load event details');
            if (errorCallback) errorCallback(error);
        });
    },

    getUpcomingEvents: function(callback, errorCallback) {
        RestClient.get('events/upcoming', function(response) {
            if (callback) callback(response);
        }, function(error) {
            console.error('Error fetching upcoming events:', error);
            toastr.error('Failed to load upcoming events');
            if (errorCallback) errorCallback(error);
        });
    },

    getPastEvents: function(callback, errorCallback) {
        RestClient.get('events/past', function(response) {
            if (callback) callback(response);
        }, function(error) {
            console.error('Error fetching past events:', error);
            toastr.error('Failed to load past events');
            if (errorCallback) errorCallback(error);
        });
    },

    createEvent: function(eventData, callback, errorCallback) {
        const user = UserService.getCurrentUser();
        
        if (!user || (user.role !== Constants.ADMIN_ROLE && user.role !== Constants.CLUB_OWNER)) {
            toastr.error('You do not have permission to create events');
            return;
        }

        if (!eventData.title || !eventData.event_date || !eventData.club_id) {
            toastr.error('Please fill in all required fields');
            if (errorCallback) errorCallback({ message: 'Missing required fields' });
            return;
        }

        $.blockUI({ message: '<h3>Processing...</h3>' });
        
        RestClient.post('events', JSON.stringify(eventData), function(response) {
            $.unblockUI();
            toastr.success('Event created successfully!');
            if (callback) callback(response);
        }, function(error) {
            $.unblockUI();
            console.error('Error creating event:', error);
            const errorMsg = error.responseJSON?.message || error.responseText || 'Failed to create event';
            toastr.error(errorMsg);
            if (errorCallback) errorCallback(error);
        });
    },

    updateEvent: function(eventId, eventData, callback, errorCallback) {
        const user = UserService.getCurrentUser();
        
        if (!user || (user.role !== Constants.ADMIN_ROLE && user.role !== Constants.CLUB_OWNER)) {
            toastr.error('You do not have permission to update events');
            return;
        }

        if (!eventData.title || !eventData.event_date) {
            toastr.error('Please fill in all required fields');
            if (errorCallback) errorCallback({ message: 'Missing required fields' });
            return;
        }

        $.blockUI({ message: '<h3>Processing...</h3>' });
        
        RestClient.put('events/' + eventId, JSON.stringify(eventData), function(response) {
            $.unblockUI();
            toastr.success('Event updated successfully!');
            if (callback) callback(response);
        }, function(error) {
            $.unblockUI();
            console.error('Error updating event:', error);
            const errorMsg = error.responseJSON?.message || error.responseText || 'Failed to update event';
            toastr.error(errorMsg);
            if (errorCallback) errorCallback(error);
        });
    },

    deleteEvent: function(eventId, callback, errorCallback) {
        const user = UserService.getCurrentUser();
        
        if (!user || (user.role !== Constants.ADMIN_ROLE && user.role !== Constants.CLUB_OWNER)) {
            toastr.error('You do not have permission to delete events');
            return;
        }

        $.blockUI({ message: '<h3>Processing...</h3>' });
        
        RestClient.delete('events/' + eventId, null, function(response) {
            $.unblockUI();
            toastr.success('Event deleted successfully!');
            if (callback) callback(response);
        }, function(error) {
            $.unblockUI();
            console.error('Error deleting event:', error);
            toastr.error('Failed to delete event');
            if (errorCallback) errorCallback(error);
        });
    },

    canEditEvent: function(event) {
        const user = UserService.getCurrentUser();
        if (!user) return false;
        
        if (user.role === Constants.ADMIN_ROLE) return true;
        
        if (user.role === Constants.CLUB_OWNER && event.club_id === user.club_id) return true;
        
        return false;
    },

    canDeleteEvent: function(event) {
        return this.canEditEvent(event);
    }
};

if (!UserService.getCurrentUser) {
    UserService.getCurrentUser = function() {
        const token = localStorage.getItem("user_token");
        if (!token) return null;
        
        try {
            const userData = Utils.parseJwt(token);
            return userData ? userData.user : null;
        } catch (e) {
            console.error('Error parsing user token:', e);
            return null;
        }
    };
}