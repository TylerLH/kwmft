'use strict';

// Site homepage

module.exports = function(req, res) {
  var model = {
    meta: {
      title: 'Katherine Warner, MA, MFT | Therapy and counseling in Palo Alto',
      description: 'Katherine Warner is a licensed marriage and family therapist providing therapy and counseling services in the Palo Alto, CA area.'
    },
    slides: [
      {
        image: 'images/teens.jpg',
        caption: {
          heading: 'Teen Counseling'
        }
      },
      {
        image: 'images/individual.jpg',
        caption: {
          heading: 'Individual Counseling'
        }
      },
      {
        image: 'images/couple.jpg',
        caption: {
          heading: 'Couples Counseling'
        }
      }
    ]
  }
  res.render('index', model);
}
