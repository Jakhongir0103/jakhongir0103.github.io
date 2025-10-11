$(document).ready(function () {
  // add toggle functionality to abstract, award and bibtex buttons
  $("a.abstract").click(function () {
    $(this).parent().parent().find(".abstract.hidden").toggleClass("open");
    $(this).parent().parent().find(".award.hidden.open").toggleClass("open");
    $(this).parent().parent().find(".bibtex.hidden.open").toggleClass("open");
  });
  $("a.award").click(function () {
    $(this).parent().parent().find(".abstract.hidden.open").toggleClass("open");
    $(this).parent().parent().find(".award.hidden").toggleClass("open");
    $(this).parent().parent().find(".bibtex.hidden.open").toggleClass("open");
  });
  $("a.bibtex").click(function () {
    $(this).parent().parent().find(".abstract.hidden.open").toggleClass("open");
    $(this).parent().parent().find(".award.hidden.open").toggleClass("open");
    $(this).parent().parent().find(".bibtex.hidden").toggleClass("open");
  });
  $("a").removeClass("waves-effect waves-light");

  // bootstrap-toc
  if ($("#toc-sidebar").length) {
    // remove related publications years from the TOC
    $(".publications h2").each(function () {
      $(this).attr("data-toc-skip", "");
    });
    var navSelector = "#toc-sidebar";
    var $myNav = $(navSelector);
    Toc.init($myNav);
    $("body").scrollspy({
      target: navSelector,
    });
  }

  // add css to jupyter notebooks
  const cssLink = document.createElement("link");
  cssLink.href = "../css/jupyter.css";
  cssLink.rel = "stylesheet";
  cssLink.type = "text/css";

  let jupyterTheme = determineComputedTheme();

  $(".jupyter-notebook-iframe-container iframe").each(function () {
    $(this).contents().find("head").append(cssLink);

    if (jupyterTheme == "dark") {
      $(this).bind("load", function () {
        $(this).contents().find("body").attr({
          "data-jp-theme-light": "false",
          "data-jp-theme-name": "JupyterLab Dark",
        });
      });
    }
  });

  // Custom annotation tooltips
  function createAnnotationTooltip() {
    $('.annotation-icon').each(function() {
      var $icon = $(this);
      var annotation = $icon.data('annotation');
      
      if (annotation) {
        // Create tooltip element
        var tooltip = $('<div class="custom-tooltip"></div>')
          .text(annotation)
          .css({
            'position': 'absolute',
            'background-color': '#333',
            'color': '#fff',
            'padding': '8px 12px',
            'border-radius': '4px',
            'font-size': '14px',
            'white-space': 'nowrap',
            'z-index': '9999',
            'pointer-events': 'none',
            'opacity': '0',
            'transition': 'opacity 0.2s ease-in-out',
            'box-shadow': '0 2px 8px rgba(0,0,0,0.2)'
          });
        
        $('body').append(tooltip);
        
        // Show tooltip on hover
        $icon.on('mouseenter', function(e) {
          var iconOffset = $icon.offset();
          tooltip.css({
            'left': iconOffset.left + $icon.outerWidth() / 2 - tooltip.outerWidth() / 2 + 'px',
            'top': iconOffset.top - tooltip.outerHeight() - 8 + 'px',
            'opacity': '1'
          });
        });
        
        // Hide tooltip on mouse leave
        $icon.on('mouseleave', function() {
          tooltip.css('opacity', '0');
        });
      }
    });
  }
  
  // Initialize annotation tooltips
  createAnnotationTooltip();
});
