(function ($) {
  "use strict";

  $(window).scroll(function () {
    var window_top = $(window).scrollTop() + 1;
    if (window_top > 50) {
      $('.main_menu').addClass('menu_fixed animated fadeInDown');
    } else {
      $('.main_menu').removeClass('menu_fixed animated fadeInDown');
    }
  });

  var client_logo = $('.client_logo_slider');
  if (client_logo.length) {
    client_logo.owlCarousel({
      items: 6,
      loop: true,
      autoplay: true,
      autoplayHoverPause: true,
      autoplayTimeout: 3500,
      responsive: {
        0: {
          items: 2,
          margin: 15
        },
        600: {
          items: 3,
          margin: 15
        },
        991: {
          items: 5,
          margin: 15
        },
        1200: {
          items: 6,
          margin: 15
        }
      }
    });
  }
}(jQuery));
