/*!
 * jquery-animate-css.js
 * My guess the original author is Daniel Eden.
 * https://github.com/daneden/animate.css#usage-with-jquery
 * Requires jQuery: https://jquery.com/download/
 * Usage: `$('#el').animateCss('bounce');`
 * or: `$('#yourElement').animateCss('bounce', function() { console.log('Do something after animation'); })`;
 */

$.fn.extend({
  animateCss: function(animationName, callback) {
    var animationEnd = (function(el) {
      var animations = {
        animation: 'animationend',
        OAnimation: 'oAnimationEnd',
        MozAnimation: 'mozAnimationEnd',
        WebkitAnimation: 'webkitAnimationEnd',
      };

      for (var t in animations) {
        if (el.style[t] !== undefined) {
          return animations[t];
        }
      }
    })(document.createElement('div'));

    this.addClass('animated ' + animationName).one(animationEnd, function() {
      $(this).removeClass('animated ' + animationName);

      if (typeof callback === 'function') {
        callback()
      };
    });

    return this;
  },
});
