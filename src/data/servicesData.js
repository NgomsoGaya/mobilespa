import massageTherapy from '../assets/images/massagetherapy.jpg'; // Reusing existing images
import facial from '../assets/images/facial.jpg';
import couplesTherapy from '../assets/images/couplestherapy.jpg';
import aromatherapy from '../assets/images/aromatherapy.jpg';

const servicesData = [
  {
    id: 'spa-treatments',
    icon: massageTherapy, // Placeholder, will need to confirm image
    title: 'Spa Treatments',
    shortDescription: 'Finest wellness treatments: relaxation, invigorating, or reducing stress. Kid\'s treatments available.',
    modalContent: {
      description: 'Your wellness Mobile spa provides an array of the finest wellness treatments, each with a specific goal such as relaxation, invigorating, or reducing stress. Kid\'s treatments are available on request.',
      listItems: ['Massages', 'Pregnancy massages', 'Wood therapy', 'Facials and waxes', 'Hands and foot care'],
      action: {
        text: 'View and Download Price List',
        type: 'link',
        target: '/brochure.pdf'
      }
    }
  },
  {
    id: 'special-occasions',
    icon: couplesTherapy, // Placeholder
    title: 'Special Occasions & Pamper Parties',
    shortDescription: 'Celebrate with bespoke pamper parties for any event.',
    modalContent: {
      description: 'Make your special day or event unforgettable with our bespoke pamper parties. Perfect for bridal showers, birthdays, corporate events, or just a luxurious get-together with friends.',
      listItems: ['Bridal showers', 'Birthdays', 'Corporate events', 'Friend\'s gatherings'],
      images: [], // Placeholder for images (Phase 3)
      action: {
        text: 'Contact Us for Details',
        type: 'button',
        target: '#contact-section' // Assuming a contact section or form
      }
    }
  },
  {
    id: 'hotel-guest-house-airbnb',
    icon: facial, // Placeholder
    title: 'Hotel | Guest house | Airbnb',
    shortDescription: 'Elevate guest experience with on-site spa services.',
    modalContent: {
      description: 'Partner with us to offer your guests an unparalleled level of comfort and luxury. Provide on-site spa treatments without the overhead of a permanent spa facility.',
      listItems: ['Enhance guest experience', 'Increase guest satisfaction', 'Flexible service scheduling'],
      cta: {
        text: 'For more information on partnership opportunities, please contact us.',
        type: 'button',
        target: '#contact-section' // Assuming a contact section or form
      }
    }
  },
  {
    id: 'corporate-wellness',
    icon: aromatherapy, // Placeholder
    title: 'Corporate Wellness',
    shortDescription: 'Boost team morale and productivity with corporate wellness programs.',
    modalContent: {
      description: 'Invest in your team\'s well-being with our tailored corporate wellness programs. Reduce stress, improve focus, and boost morale right in your office.',
      listItems: ['Seated massages', 'Express facials', 'Stress relief workshops'],
      cta: {
        text: 'Contact us for more information!',
        type: 'button',
        target: '#contact-section' // Assuming a contact section or form
      }
    }
  }
];

export default servicesData;
