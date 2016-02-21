'use strict';

Vue.use(VueAsyncData);

$('.contact-link').on('click', function (e) {
  e.preventDefault();
  $.scrollTo('#footer', { duration: 500 });
});

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
      console.log('Error: ', err);
    },
    retry: function retry() {
      this.onSubmit();
    },
    reset: function reset() {
      this.name = '';
      this.email = '';
      this.message = '';
      this.errors = [];
      this.messageSent = false;
    }
  }
});