var EventsService = {
    
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

        $.blockUI();
        
        RestClient.post('events', JSON.stringify(eventData), function(response) {
            $.unblockUI();
            toastr.success('Event created successfully!');
            if (callback) callback(response);
        }, function(error) {
            $.unblockUI();
            console.error('Error creating event:', error);
            toastr.error(error.responseJSON?.message || 'Failed to create event');
            if (errorCallback) errorCallback(error);
        });
    },

    updateEvent: function(eventId, eventData, callback, errorCallback) {
        const user = UserService.getCurrentUser();
        
        if (!user || (user.role !== Constants.ADMIN_ROLE && user.role !== Constants.CLUB_OWNER)) {
            toastr.error('You do not have permission to update events');
            return;
        }

        $.blockUI();
        
        RestClient.put('events/' + eventId, JSON.stringify(eventData), function(response) {
            $.unblockUI();
            toastr.success('Event updated successfully!');
            if (callback) callback(response);
        }, function(error) {
            $.unblockUI();
            console.error('Error updating event:', error);
            toastr.error(error.responseJSON?.message || 'Failed to update event');
            if (errorCallback) errorCallback(error);
        });
    },

    deleteEvent: function(eventId, callback, errorCallback) {
        const user = UserService.getCurrentUser();
        
        if (!user || (user.role !== Constants.ADMIN_ROLE && user.role !== Constants.CLUB_OWNER)) {
            toastr.error('You do not have permission to delete events');
            return;
        }

    

        $.blockUI();
        
        RestClient.delete('events/' + eventId, null, function(response) {
            $.unblockUI();
            toastr.success('Event deleted successfully!');
            if (callback) callback(response);
        }, function(error) {
            $.unblockUI();
            console.error('Error deleting event:', error);
            toastr.error(error.responseJSON?.message || 'Failed to delete event');
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
        
        const userData = Utils.parseJwt(token);
        return userData ? userData.user : null;
    };
}