toastr.options.preventDuplicates = true;
toastr.options.timeOut = 3000;

function initRegister() {
    var token = localStorage.getItem("user_token");
    if (token && token !== undefined) {
        window.location.hash = "#home";
        return;
    }
    
    $("#register-form").validate({
        rules: {
            full_name: {
                required: true,
                minlength: 2
            },
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                minlength: 6
            }
        },
        messages: {
            full_name: {
                required: "Please enter your full name",
                minlength: "Name must be at least 2 characters"
            },
            email: {
                required: "Please enter your email",
                email: "Please enter a valid email address"
            },
            password: {
                required: "Please enter a password",
                minlength: "Password must be at least 6 characters"
            }
        },
        submitHandler: function (form) {
            var entity = Object.fromEntries(new FormData(form).entries());
            UserService.register(entity);
        }
    });

    const signInLink = document.querySelector('.auth-link');
    if (signInLink) {
        signInLink.href = "#login";
    }
}