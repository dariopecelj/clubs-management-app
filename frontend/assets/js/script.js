$(document).ready(function () {
    console.log("Initializing SPApp...");

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
                } else {
                    console.warn(`Section #${viewId} not found after waiting`);
                }
                return;
            }

            if (typeof window[fnName] === 'function') {
                console.log(`Calling ${fnName} for view: ${viewId}`);
                try {
                    window[fnName]();
                } catch (error) {
                    console.error(`Error calling ${fnName}:`, error);
                }
            } else {
                if (attempts < 20) {
                    setTimeout(() => attemptCall(attempts + 1), 100);
                } else {
                    console.warn(`Function ${fnName} not defined for view: ${viewId} after waiting`);
                }
            }
        }

        attemptCall();
    }

    function loadPageScript(viewId) {
        const scriptPath = `assets/js/${viewId}.js`;

        if (loadedScripts.has(scriptPath)) {
            console.log(`Script already loaded: ${scriptPath}`);
            callViewFunction(viewId);
            return;
        }

        const existingScript = document.querySelector(`script[src="${scriptPath}"]`);
        if (existingScript) {
            console.log(`Script element exists: ${scriptPath}`);
            loadedScripts.add(scriptPath);
            callViewFunction(viewId);
            return;
        }

        console.log(`Loading script: ${scriptPath}`);
        const script = document.createElement("script");
        script.src = scriptPath;

        script.onload = () => {
            console.log(`Script loaded successfully: ${scriptPath}`);
            loadedScripts.add(scriptPath);
            callViewFunction(viewId); 
        };

        script.onerror = () => {
            console.error(`Failed to load script: ${scriptPath}`);
        };

        document.body.appendChild(script);
    }

    const pages = ["home", "events", "event-details", "club", "admin", "profile", "login", "register"];

    pages.forEach(viewId => {
        app.route({
            view: viewId,
            load: "../views/" + viewId + ".html",
            onReady: () => {
                console.log(`View ready: ${viewId}`);

       
                const checkSection = () => {
                    if (document.getElementById(viewId)) {
                        showSection(viewId);
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
    console.log("SPApp is running");

    const currentHash = window.location.hash.replace('#', '');
    if (currentHash && pages.includes(currentHash)) {
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
