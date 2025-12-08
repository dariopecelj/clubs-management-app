function initLogin() {
    toastr.options.preventDuplicates = true;
    toastr.options.timeOut = 3000;
    
    var token = localStorage.getItem("user_token");
    if (token && token !== undefined) {
        window.location.hash = "#home";
        return;
    }
    
    $("#login-form").validate({
        submitHandler: function (form) {
            var entity = Object.fromEntries(new FormData(form).entries());
            UserService.login(entity);
        },
    });
}