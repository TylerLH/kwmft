const bookingWidget = new TimekitBooking();
bookingWidget.init({
  name: 'Katherine',
  email: 'katherine@kwmft.com',
  apiToken: 'nma9mVtuArfYhex1LtRBnyv3FJWQgWyk',
  calendar: 'eb735ea2-0410-483e-8d57-dcb510ed26dd',
  avatar: 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg',
  timekitFindTime: {
    filters: {
      and: [
        { exclude_weekend: { } },
        { specific_time: {"start": 17, "end": 20}}
      ] }
    ,
    length: '30 minutes' }
});

$('.btn-schedule-consultation').click(function(e) {
  e.preventDefault();
  const $dest = $('.schedule-consultation');
  $.scrollTo($dest, { duration: 500 });
})
