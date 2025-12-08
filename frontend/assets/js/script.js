$(document).ready(function () {
    const app = $.spapp({
        defaultView: "home"
    });

    const loadedScripts = new Set();

    function showSection(viewId) {
        $('#spapp section').removeClass('active');
        $('#' + viewId).addClass('active');
    }

    function getFunctionName(viewId) {
        const parts = viewId.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1));
        const baseName = parts.join('');
        if (["events", "event-details"].includes(viewId.toLowerCase())) {
            return "render" + baseName; 
        } else {
            return "init" + baseName;
        }
    }

    function callViewFunction(viewId) {
        const fnName = getFunctionName(viewId);

        function attemptCall(attempts = 0) {
            const section = document.getElementById(viewId);

            if (!section) {
                if (attempts < 20) {
                    setTimeout(() => attemptCall(attempts + 1), 100);
                }
                return;
            }

            if (typeof window[fnName] === 'function') {
                try {
                    window[fnName]();
                } catch (error) {
                }
            } else {
                if (attempts < 20) {
                    setTimeout(() => attemptCall(attempts + 1), 100);
                }
            }
        }

        attemptCall();
    }

    function loadPageScript(viewId) {
        const scriptPath = `assets/js/${viewId}.js`;

        if (loadedScripts.has(scriptPath)) {
            callViewFunction(viewId);
            return;
        }

        const existingScript = document.querySelector(`script[src="${scriptPath}"]`);
        if (existingScript) {
            loadedScripts.add(scriptPath);
            callViewFunction(viewId);
            return;
        }

        const script = document.createElement("script");
        script.src = scriptPath;

        script.onload = () => {
            loadedScripts.add(scriptPath);
            callViewFunction(viewId); 
        };

        script.onerror = () => {
        };

        document.body.appendChild(script);
    }

    function checkAuth(viewId) {
        const token = localStorage.getItem("user_token");
        const publicPages = ["login", "register"];
        
        if (!token && !publicPages.includes(viewId)) {
            toastr.warning("Please login to access this page");
            window.location.hash = "#login";
            return false;
        }
        
        if (token && publicPages.includes(viewId)) {
            window.location.hash = "#home";
            return false;
        }
        
        if (token) {
            try {
                const userData = Utils.parseJwt(token);
                const userRole = userData?.user?.role;
                
                if (viewId === "admin") {
                    if (userRole !== Constants.ADMIN_ROLE) {
                        toastr.error("Access denied: Admin only");
                        window.location.hash = "#home";
                        return false;
                    }
                }
                
                if (viewId === "club") {
                    if (userRole !== Constants.ADMIN_ROLE && userRole !== Constants.CLUB_OWNER) {
                        toastr.error("Access denied: You need to create a club first");
                        window.location.hash = "#home";
                        return false;
                    }
                }
                
            } catch (error) {
                localStorage.clear();
                window.location.hash = "#login";
                return false;
            }
        }
        
        return true;
    }

    const pages = ["home", "events", "event-details", "club", "admin", "profile", "login", "register"];

    pages.forEach(viewId => {
        app.route({
            view: viewId,
            load: "../views/" + viewId + ".html",
            onReady: () => {
                if (!checkAuth(viewId)) {
                    return;
                }

                const checkSection = () => {
                    if (document.getElementById(viewId)) {
                        showSection(viewId);
                        
                        const token = localStorage.getItem("user_token");
                        
                        if (token && viewId !== "login" && viewId !== "register") {
                            UserService.generateMenuItems();
                        } else {
                            UserService.updateAuthButton();
                        }
                        
                        if (viewId !== "admin" && window.cleanupAdmin) {
                            window.cleanupAdmin();
                        }
                        
                        loadPageScript(viewId); 
                    } else {
                        setTimeout(checkSection, 50);
                    }
                };
                checkSection();
            }
        });
    });

    app.run();

    const token = localStorage.getItem("user_token");
    const currentHash = window.location.hash.replace('#', '') || 'home';
    
    setTimeout(() => {
        UserService.updateAuthButton();
    }, 100);
    
    if (!token && currentHash !== 'login' && currentHash !== 'register') {
        window.location.hash = '#login';
    } else if (token && (currentHash === 'login' || currentHash === 'register')) {
        window.location.hash = '#home';
    } else if (pages.includes(currentHash)) {
        setTimeout(() => {
            window.location.hash = currentHash;
        }, 100);
    }

    $('.nav-link').click(function (e) {
        e.preventDefault();
        const target = $(this).attr('href').replace('#', '');
        window.location.hash = target;
    });
});