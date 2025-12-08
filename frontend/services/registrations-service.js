var RegistrationsService = {

    getAllRegistrations: function(callback, errorCallback) {
        RestClient.get('registrations', function(response) {
            if (callback) callback(response);
        }, function(error) {
            console.error('Error fetching registrations:', error);
            toastr.error('Failed to load registrations');
            if (errorCallback) errorCallback(error);
        });
    },

    getRegistrationsByEvent: function(eventId, callback, errorCallback) {
        RestClient.get('registrations?event_id=' + eventId, function(response) {
            if (callback) callback(response);
        }, function(error) {
            console.error('Error fetching event registrations:', error);
            toastr.error('Failed to load event registrations');
            if (errorCallback) errorCallback(error);
        });
    },

    getRegistrationsByUser: function(userId, callback, errorCallback) {
        RestClient.get('registrations?user_id=' + userId, function(response) {
            if (callback) callback(response);
        }, function(error) {
            console.error('Error fetching user registrations:', error);
            toastr.error('Failed to load user registrations');
            if (errorCallback) errorCallback(error);
        });
    },

    getRegistrationById: function(registrationId, callback, errorCallback) {
        RestClient.get('registrations/' + registrationId, function(response) {
            if (callback) callback(response);
        }, function(error) {
            console.error('Error fetching registration:', error);
            toastr.error('Failed to load registration details');
            if (errorCallback) errorCallback(error);
        });
    },

    isUserRegistered: function(userId, eventId, callback, errorCallback) {
        RestClient.get(`registrations/check/${userId}/${eventId}`, function(response) {
            if (callback) callback(response);
        }, function(error) {
            console.error('Error checking registration:', error);
            toastr.error('Failed to check registration status');
            if (errorCallback) errorCallback(error);
        });
    },

    getRegistrationCount: function(eventId, callback, errorCallback) {
        RestClient.get(`registrations/count/${eventId}`, function(response) {
            if (callback) callback(response);
        }, function(error) {
            console.error('Error fetching registration count:', error);
            toastr.error('Failed to load registration count');
            if (errorCallback) errorCallback(error);
        });
    },

    getUpcomingEventsByUser: function(userId, callback, errorCallback) {
        RestClient.get(`registrations/user/${userId}/upcoming`, function(response) {
            if (callback) callback(response);
        }, function(error) {
            console.error('Error fetching upcoming events for user:', error);
            toastr.error('Failed to load upcoming events');
            if (errorCallback) errorCallback(error);
        });
    },

    createRegistration: function(registrationData, callback, errorCallback) {
        const user = UserService.getCurrentUser();
        if (!user) {
            toastr.error('You must be logged in to register');
            return;
        }

        $.blockUI();

        RestClient.post('registrations', JSON.stringify(registrationData), function(response) {
            $.unblockUI();
            toastr.success('Registration created successfully!');
            if (callback) callback(response);
        }, function(error) {
            $.unblockUI();
            console.error('Error creating registration:', error);
            toastr.error(error.responseJSON?.message || 'Failed to create registration');
            if (errorCallback) errorCallback(error);
        });
    },

    registerUser: function(userId, eventId, callback, errorCallback) {
        const user = UserService.getCurrentUser();
        if (!user) {
            toastr.error('You must be logged in to register');
            return;
        }

        $.blockUI();

        RestClient.post('registrations/register', JSON.stringify({ user_id: userId, event_id: eventId }), function(response) {
            $.unblockUI();
            if (callback) callback(response);
        }, function(error) {
            $.unblockUI();
            console.error('Error registering user:', error);
            toastr.error(error.responseJSON?.message || 'Failed to register user');
            if (errorCallback) errorCallback(error);
        });
    },

    deleteRegistration: function(registrationId, callback, errorCallback) {
        const user = UserService.getCurrentUser();
        if (!user || (user.role !== Constants.ADMIN_ROLE && user.role !== Constants.CLUB_OWNER)) {
            toastr.error('You do not have permission to delete registrations');
            return;
        }

        $.blockUI();

        RestClient.delete('registrations/' + registrationId, null, function(response) {
            $.unblockUI();
            toastr.success('Registration deleted successfully!');
            if (callback) callback(response);
        }, function(error) {
            $.unblockUI();
            console.error('Error deleting registration:', error);
            toastr.error(error.responseJSON?.message || 'Failed to delete registration');
            if (errorCallback) errorCallback(error);
        });
    },

    unregisterUser: function(userId, eventId, callback, errorCallback) {
        const user = UserService.getCurrentUser();
        if (!user) {
            toastr.error('You must be logged in to unregister');
            return;
        }

        $.blockUI();

        RestClient.delete(`registrations/unregister/${userId}/${eventId}`, null, function(response) {
            $.unblockUI();
            toastr.success('User unregistered successfully!');
            if (callback) callback(response);
        }, function(error) {
            $.unblockUI();
            console.error('Error unregistering user:', error);
            toastr.error(error.responseJSON?.message || 'Failed to unregister user');
            if (errorCallback) errorCallback(error);
        });
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
