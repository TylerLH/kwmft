Vue.use(VueAsyncData);

const quickContact = new Vue({
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
    onSubmit: function() {
      this.isLoading = true;
      // const captcha = grecaptcha.getResponse();
      const {name, email, message} = this;
      $.post('/contact', {name, email, message})
        .done(this.onMessageSent.bind(this))
        .fail(this.onMessageFail.bind(this))
    },
    onMessageSent: function() {
      setTimeout(() => {
        this.isLoading = false;
        this.messageSent = true;
      }, 500);
    },
    onMessageFail: function(err) {
      this.isLoading = false;
      this.error = err;
    },
    retry: function() {
      this.onSubmit();
    },
    reset: function() {
      this.name = '';
      this.email = '';
      this.message = '';
      this.error = null;
      this.messageSent = false;
    }
  }
});
