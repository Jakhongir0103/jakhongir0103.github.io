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
      
      // Try multiple ways to get the annotation text
      var annotation = $icon.data('annotation') || 
                      $icon.attr('data-annotation') || 
                      $icon.attr('data-content');
      
      console.log('Annotation found:', annotation); // Debug log
      console.log('Icon element:', $icon[0]); // Debug log
      console.log('All attributes:', $icon[0].attributes); // Debug log
      
      // Fallback for testing
      if (!annotation || annotation.trim() === '') {
        annotation = '* Equal Contribution (fallback)';
        console.log('Using fallback annotation:', annotation);
      }
      
      if (annotation && annotation.trim() !== '') {
        // Create tooltip element
        var tooltip = $('<div class="custom-tooltip"></div>')
          .html(annotation) // Use html() instead of text() to preserve any HTML
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
            'box-shadow': '0 2px 8px rgba(0,0,0,0.2)',
            'max-width': '300px',
            'word-wrap': 'break-word',
            'white-space': 'normal'
          });
        
        $('body').append(tooltip);
        
        // Show tooltip on hover
        $icon.on('mouseenter', function(e) {
          var iconOffset = $icon.offset();
          var tooltipWidth = tooltip.outerWidth();
          var tooltipHeight = tooltip.outerHeight();
          
          tooltip.css({
            'left': (iconOffset.left + $icon.outerWidth() / 2 - tooltipWidth / 2) + 'px',
            'top': (iconOffset.top - tooltipHeight - 8) + 'px',
            'opacity': '1'
          });
        });
        
        // Hide tooltip on mouse leave
        $icon.on('mouseleave', function() {
          tooltip.css('opacity', '0');
        });
        
        // Also hide tooltip when mouse leaves the tooltip itself
        tooltip.on('mouseleave', function() {
          tooltip.css('opacity', '0');
        });
        
        console.log('Tooltip created for:', annotation); // Debug log
      } else {
        console.log('No annotation found for icon:', $icon); // Debug log
      }
    });
  }
  
  // Initialize annotation tooltips
  createAnnotationTooltip();
});
