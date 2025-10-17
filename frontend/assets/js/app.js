$(document).ready(function () {
  const BASE_PATH = '/frontend/';
  const VIEWS_PATH = `${BASE_PATH}views/`;
  const SCRIPTS_PATH = `${BASE_PATH}assets/js/`;

  loadPage(window.location.hash || '#home');

  $(window).on('hashchange', function () {
    loadPage(window.location.hash);
  });

  function loadPage(hash) {
    const page = hash.replace('#', '') || 'home';
    const filePath = `${VIEWS_PATH}${page}.html`;

    $('#app').stop(true, true).fadeOut(150, function () {
      $.ajax({
        url: filePath,
        dataType: 'html',
        cache: false,
        success: function (html) {
          $('#app').html(html).fadeIn(150);
          loadPageScript(page);
        },
        error: function () {
          $('#app')
            .html('<h3 class="text-danger text-center mt-5">404 - Page not found</h3>')
            .fadeIn(150);
        }
      });
    });
  }

  function loadPageScript(page) {
    const scriptPath = `${SCRIPTS_PATH}${page}.js`;

    $('script[data-dynamic]').remove();

    $.ajax({
      url: scriptPath,
      dataType: 'text',
      cache: false,
      success: function (code) {
        console.log(`Loaded ${scriptPath}`);

        const wrapped = `(function(){\n${code}\n})();`;
        const scriptEl = document.createElement('script');
        scriptEl.dataset.dynamic = true;
        scriptEl.textContent = wrapped;
        document.body.appendChild(scriptEl);

        if (typeof window.renderEventDetail === 'function') {
          window.renderEventDetail();
        }

        if (typeof window.initEventsPage === 'function') {
          window.initEventsPage();
        }
      },
      error: function () {
        console.log(`No JS found for ${page}`);
      }
    });
  }
});
