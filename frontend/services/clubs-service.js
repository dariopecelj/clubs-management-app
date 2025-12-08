var ClubsService = {
    
    getAllClubs: function(searchTerm, callback, errorCallback) {
        let url = 'clubs';
        if (searchTerm) {
            url += '?search=' + encodeURIComponent(searchTerm);
        }

        RestClient.get(url, function(response) {
            if (callback) callback(response);
        }, function(error) {
            console.error('Error fetching clubs:', error);
            toastr.error('Failed to load clubs');
            if (errorCallback) errorCallback(error);
        });
    },

    getClubById: function(clubId, callback, errorCallback) {
        RestClient.get('clubs/' + clubId, function(response) {
            if (callback) callback(response);
        }, function(error) {
            console.error('Error fetching club:', error);
            toastr.error('Failed to load club details');
            if (errorCallback) errorCallback(error);
        });
    },

    getClubsByCreator: function(creatorUserId, callback, errorCallback) {
        RestClient.get('clubs/creator/' + creatorUserId, function(response) {
            if (callback) callback(response);
        }, function(error) {
            console.error('Error fetching clubs by creator:', error);
            toastr.error('Failed to load clubs');
            if (errorCallback) errorCallback(error);
        });
    },

    createClub: function(clubData, callback, errorCallback) {
        const user = UserService.getCurrentUser();

        if (!user) {
            toastr.error('You must be logged in to create a club');
            window.location.hash = '#login';
            return;
        }

        $.blockUI();

        RestClient.post('clubs', JSON.stringify(clubData), function(response) {
            $.unblockUI();
            toastr.success('Club created successfully! You are now a Club Owner.');
            

            if (response.token) {
                localStorage.setItem("user_token", response.token);
                UserService.updateAuthButton();
                UserService.generateMenuItems(); 
            } else {
                setTimeout(() => {
                    location.reload();
                }, 2000);
            }
            
            if (callback) callback(response);
        }, function(error) {
            $.unblockUI();
            console.error('Error creating club:', error);
            toastr.error(error.responseJSON?.message || 'Failed to create club');
            if (errorCallback) errorCallback(error);
        });
    },

    updateClub: function(clubId, clubData, callback, errorCallback) {
        const user = UserService.getCurrentUser();

        if (!user || (user.role !== Constants.ADMIN_ROLE && user.role !== Constants.CLUB_OWNER)) {
            toastr.error('You do not have permission to update clubs');
            return;
        }

        $.blockUI();

        RestClient.put('clubs/' + clubId, JSON.stringify(clubData), function(response) {
            $.unblockUI();
            toastr.success('Club updated successfully!');
            if (callback) callback(response);
        }, function(error) {
            $.unblockUI();
            console.error('Error updating club:', error);
            toastr.error(error.responseJSON?.message || 'Failed to update club');
            if (errorCallback) errorCallback(error);
        });
    },

    deleteClub: function(clubId, callback, errorCallback) {
        const user = UserService.getCurrentUser();

        if (!user || (user.role !== Constants.ADMIN_ROLE && user.role !== Constants.CLUB_OWNER)) {
            toastr.error('You do not have permission to delete clubs');
            return;
        }

        $.blockUI();

        RestClient.delete('clubs/' + clubId, null, function(response) {
            $.unblockUI();
            toastr.success('Club deleted successfully!');
            if (callback) callback(response);
        }, function(error) {
            $.unblockUI();
            console.error('Error deleting club:', error);
            toastr.error(error.responseJSON?.message || 'Failed to delete club');
            if (errorCallback) errorCallback(error);
        });
    },

    canEditClub: function(club) {
        const user = UserService.getCurrentUser();
        if (!user) return false;

        if (user.role === Constants.ADMIN_ROLE) return true;

        if (user.role === Constants.CLUB_OWNER && club.creator_user_id === user.id) return true;

        return false;
    },

    canDeleteClub: function(club) {
        return this.canEditClub(club);
    }
};