var UserService = {
    
    login: function (entity) {
        $.ajax({
            url: Constants.PROJECT_BASE_URL + "auth/login",
            type: "POST",
            data: JSON.stringify(entity),
            contentType: "application/json",
            dataType: "json",
            success: function (result) {
                console.log(result);
                localStorage.setItem("user_token", result.data.token);
                toastr.success("Login successful!");
                UserService.updateAuthButton();
                window.location.hash = "#home";
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                toastr.error(XMLHttpRequest?.responseText ? XMLHttpRequest.responseText : 'Error');
            },
        });
    },

    register: function (entity) {
        $.ajax({
            url: Constants.PROJECT_BASE_URL + "auth/register",
            type: "POST",
            data: JSON.stringify(entity),
            contentType: "application/json",
            dataType: "json",
            success: function (result) {
                console.log(result);
                toastr.success("Registration successful! Please login.");
                setTimeout(function() {
                    window.location.hash = "#login";
                }, 1500);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                toastr.error(XMLHttpRequest?.responseText ? XMLHttpRequest.responseText : 'Error');
            },
        });
    },

    updateAuthButton: function() {
        const authBtn = document.getElementById("auth-btn");
        const token = localStorage.getItem("user_token");

        if (!authBtn) {
            setTimeout(() => {
                const retryBtn = document.getElementById("auth-btn");
                if (retryBtn) {
                    UserService.updateAuthButton();
                }
            }, 100);
            return;
        }


        if (token) {
            authBtn.textContent = "Logout";
            authBtn.href = "javascript:void(0)";
            authBtn.classList.add("logout-active");
            
            authBtn.replaceWith(authBtn.cloneNode(true));
            const newBtn = document.getElementById("auth-btn");
            
            newBtn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                UserService.logout();
                return false;
            };
        } else {
            authBtn.textContent = "Login";
            authBtn.href = "#login";
            authBtn.classList.remove("logout-active");
            
            authBtn.replaceWith(authBtn.cloneNode(true));
        }
    },

    logout: function () {
        console.log("Logging out...");
        
        localStorage.clear();
        
        sessionStorage.clear();
        
        toastr.info("You have been logged out");
        
        UserService.updateAuthButton();
        
        window.location.hash = "#login";
        
        setTimeout(() => {
            location.reload();
        }, 100);
    },
    
    generateMenuItems: function () {
        const token = localStorage.getItem("user_token");
        if (!token) {
            window.location.hash = "#login";
            return;
        }
        
        try {
            const user = Utils.parseJwt(token).user;
            const navLinks = document.querySelector(".nav-links");
            
            if (!navLinks) {
                console.error("Nav links not found");
                return;
            }
            
            navLinks.innerHTML = ""; 

            navLinks.innerHTML += `<li><a href="#home" class="nav-link">Home</a></li>`;

            navLinks.innerHTML += `<li><a href="#events" class="nav-link">Events</a></li>`;

            if (user.role === Constants.ADMIN_ROLE) {
                navLinks.innerHTML += `
                    <li><a href="#club" class="nav-link">Your Club</a></li>
                    <li><a href="#admin" class="nav-link">Admin Panel</a></li>
                    <li><a href="#profile" class="nav-link">Profile</a></li>
                `;
            }
            
            if (user.role === Constants.CLUB_OWNER) {
                navLinks.innerHTML += `
                    <li><a href="#club" class="nav-link">Your Club</a></li>
                    <li><a href="#profile" class="nav-link">Profile</a></li>
                `;
            }
            
            if (user.role === Constants.USER_ROLE) {
                navLinks.innerHTML += `<li><a href="#profile" class="nav-link">Profile</a></li>`;
            }

            UserService.updateAuthButton();
        } catch (e) {
            console.error("Error generating menu:", e);
            localStorage.clear();
            window.location.hash = "#login";
        }
    },

    getCurrentUser: function() {
        const token = localStorage.getItem("user_token");
        if (!token) return null;
        
        try {
            const payload = Utils.parseJwt(token);
            return payload?.user || null;
        } catch (e) {
            console.error("Error parsing token:", e);
            localStorage.clear();
            return null;
        }
    },

    getAllUsers: function(callback, errorCallback) {
        RestClient.get('users', function(response) {
            if (callback) callback(response);
        }, function(error) {
            console.error('Error fetching users:', error);
            toastr.error('Failed to load users');
            if (errorCallback) errorCallback(error);
        });
    },

    updateProfile: function(data, success, error) {
        const user = this.getCurrentUser();
        if (!user || !user.id) return error("User ID is missing");

        const token = localStorage.getItem("user_token");
        if (!token) return error("User is not logged in");

        const updateData = {};
        if (data.full_name) updateData.full_name = data.full_name;
        if (data.email) updateData.email = data.email;
        if (data.password) updateData.password = data.password; 

        $.ajax({
            url: Constants.PROJECT_BASE_URL + "users/" + user.id,
            type: "PUT",
            headers: {
                "Authorization": "Bearer " + token
            },
            data: JSON.stringify(updateData),
            contentType: "application/json",
            dataType: "json",
            success: function(result) {
                $.ajax({
                    url: Constants.PROJECT_BASE_URL + "users/" + user.id,
                    type: "GET",
                    headers: { "Authorization": "Bearer " + token },
                    dataType: "json",
                    success: function(freshResult) {
                        success(freshResult.data); 
                    },
                    error: function(xhr) {
                        console.error("Failed to fetch updated user:", xhr);
                        success(result.data); 
                    }
                });
            },
            error: function(xhr) {
                console.error("Error updating profile:", xhr);
                error(xhr);
            }
        });
    },

    updateUser: function(userId, userData, callback, errorCallback) {
        $.blockUI();
        
        RestClient.put('users/' + userId, JSON.stringify(userData), function(response) {
            $.unblockUI();
            toastr.success('User updated successfully!');
            if (callback) callback(response);
        }, function(error) {
            $.unblockUI();
            console.error('Error updating user:', error);
            toastr.error('Failed to update user');
            if (errorCallback) errorCallback(error);
        });
    },

    createUser: function(userData, callback, errorCallback) {
        $.blockUI();
        
        RestClient.post('users', JSON.stringify(userData), function(response) {
            $.unblockUI();
            toastr.success('User created successfully!');
            if (callback) callback(response);
        }, function(error) {
            $.unblockUI();
            console.error('Error creating user:', error);
            toastr.error('Failed to create user');
            if (errorCallback) errorCallback(error);
        });
    },

    deleteUser: function(userId, callback, errorCallback) {
   
        $.blockUI();
        
        RestClient.delete('users/' + userId, null, function(response) {
            $.unblockUI();
            toastr.success('User deleted successfully!');
            if (callback) callback(response);
        }, function(error) {
            $.unblockUI();
            console.error('Error deleting user:', error);
            toastr.error('Failed to delete user');
            if (errorCallback) errorCallback(error);
        });
    }

};