const bookingWidget = new TimekitBooking();
bookingWidget.init({
  name: 'Katherine',
  email: 'katherine@kwmft.com',
  apiToken: 'nma9mVtuArfYhex1LtRBnyv3FJWQgWyk',
  calendar: 'eb735ea2-0410-483e-8d57-dcb510ed26dd',
  avatar: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
  showCredits: false,
  goToFirstEvent: true,
  bookingGraph: 'confirm_decline',
  bookingFields: {
    phone: {
      enabled: true,
      placeholder: 'Phone number',
      prefilled: false,
      required: true,
      locked: false
    }
  },
  timekitFindTime: {
    filters: {
      and: [
        { exclude_weekend: { } },
        { specific_time: {"start": 17, "end": 20, "timezone": "America/Los_angeles"}}
      ]
    },
    future: '4 weeks',
    length: '30 minutes'
  },
  fullCalendar: {
    views: {
      agenda: {
        displayEventEnd: false
      }
    },
    weekends: false,
    businessHours: {
      start: '17:00',
      end: '20:00'
    },
    allDaySlot:   false,
    scrollTime:   '17:00:00',
    timezone:     'local',
  }
});

$('.btn-schedule-consultation').click(function(e) {
  e.preventDefault();

  // Log CTA Click Event
  ga('send', {
    hitType: 'event',
    eventCategory: 'Consultations',
    eventAction: 'ctaClick'
  });

  const $dest = $('.schedule-consultation');
  $.scrollTo($dest, { duration: 500 });
})
