Vue.use(VueAsyncData);

$('.contact-link').on('click', function(e) {
  e.preventDefault();
  $.scrollTo('#footer', {duration: 500});
})

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
      console.log('Error: ', err)
    },
    retry: function() {
      this.onSubmit();
    },
    reset: function() {
      this.name = '';
      this.email = '';
      this.message = '';
      this.errors = [];
      this.messageSent = false;
    }
  }
})
