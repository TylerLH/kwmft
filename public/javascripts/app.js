'use strict';

Vue.use(VueAsyncData);

var quickContact = new Vue({
  el: '.quick-contact',
  data: {
    name: '',
    email: '',
    message: '',
    isLoading: false,
    messageSent: false,
    error: null
  },
  methods: {
    onSubmit: function onSubmit() {
      this.isLoading = true;
      // const captcha = grecaptcha.getResponse();
      var name = this.name;
      var email = this.email;
      var message = this.message;

      $.post('/contact', { name: name, email: email, message: message }).done(this.onMessageSent.bind(this)).fail(this.onMessageFail.bind(this));
    },
    onMessageSent: function onMessageSent() {
      var _this = this;

      setTimeout(function () {
        _this.isLoading = false;
        _this.messageSent = true;
      }, 500);
    },
    onMessageFail: function onMessageFail(err) {
      this.isLoading = false;
      this.error = err;
    },
    retry: function retry() {
      this.onSubmit();
    },
    reset: function reset() {
      this.name = '';
      this.email = '';
      this.message = '';
      this.error = null;
      this.messageSent = false;
    }
  }
});

$('.contact-cta').click(function (e) {
  ga('send', {
    hitType: 'event',
    eventCategory: 'Contact',
    eventAction: 'ctaClick',
    transport: 'beacon'
  });
});