/* global Vue, VueAsyncData, $, ga */

Vue.use(VueAsyncData)

// Log contact sent event
$('.contact-cta').click((e) => {
  ga('send', {
    hitType: 'event',
    eventCategory: 'Contact',
    eventAction: 'ctaClick',
    transport: 'beacon'
  })
})
