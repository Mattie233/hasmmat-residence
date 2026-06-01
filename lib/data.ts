const propertyImage = (fileName: string) => `/images/hasmmatres62/${fileName}`;

export const siteInfo = {
  name: 'Hasmmat Residence',
  tagline: 'Premium stays in Leeds for families, contractors & city visitors.',
  shortDescription:
    'Luxury 4-bedroom house with flexible stays, fast WiFi, free parking, and direct-book savings near Elland Road.',
  ctaText: 'Book Direct',
  bookingNotice: 'Secure your premium stay with direct booking discounts and fast check-out.',
  email: 'hello@hasmmat-residence.com',
  phone: '+44 7983818344',
  whatsappUrl: 'https://wa.me/447983818344',
  instagramUrl: 'https://www.instagram.com/',
  tiktokUrl: 'https://www.tiktok.com/',
  highlights: [
    'Sleeps up to 8 guests',
    'Free parking & workspace',
    'Near Elland Road & Leeds city centre',
    'Family-friendly and contractor-ready'
  ]
};

export const heroSlides = [
  {
    title: 'Luxury 4 Bedroom Stay in Leeds',
    subtitle: 'Sleeps 8 • Free Parking • Fast WiFi • Near Elland Road',
    image: propertyImage('PHOTO-2026-04-11-00-10-02_4.jpg')
  },
  {
    title: 'Boutique Comfort for Groups',
    subtitle: 'Ready for family trips, contractors, and football fans.',
    image: propertyImage('image1.jpeg')
  },
  {
    title: 'Direct Booking, Best Rates',
    subtitle: 'No marketplace fees. Flexible stays with premium service.',
    image: propertyImage('image0.jpeg')
  }
];

export const galleryImages = [
  {
    category: 'Living Room',
    title: 'Designer lounge',
    src: propertyImage('image1.jpeg')
  },
  {
    category: 'Bedroom 1',
    title: 'Double bedroom',
    src: propertyImage('image0.jpeg')
  },
  {
    category: 'Kitchen',
    title: 'Chef-ready kitchen',
    src: propertyImage('PHOTO-2026-04-11-00-10-02_15.jpg')
  },
  {
    category: 'Bathroom',
    title: 'Modern bathroom',
    src: propertyImage('20260426_184931.jpeg')
  },
  {
    category: 'Bedroom 2',
    title: 'Single bedroom',
    src: propertyImage('PHOTO-2026-04-11-00-10-02_17.jpg')
  },
  {
    category: 'Bedroom 3',
    title: 'Double bedroom',
    src: propertyImage('image2.jpeg')
  },
  {
    category: 'Bedroom 4',
    title: 'Double bedroom',
    src: propertyImage('PHOTO-2026-04-11-00-10-02_21.jpg')
  },
  {
    category: 'Backyard',
    title: 'Spacious backyard',
    src: propertyImage('PHOTO-2026-04-11-00-10-02_22.jpg')
  }
];

export const amenities = [
  { title: 'Fast WiFi', description: 'Reliable high-speed connection for work and streaming.' },
  { title: 'Smart TV', description: 'Large screen with Netflix and DAZN ready.' },
  { title: 'Fully Equipped Kitchen', description: 'Modern appliances and cookware for extended stays.' },
  { title: 'Workspace Desk', description: 'Quiet desk with power outlets and ergonomic chair.' },
  { title: 'Washing Machine', description: 'Laundry support for family and contractor stays.' },
  { title: 'Free Parking', description: 'Secure off-street parking included.' },
  { title: 'Self Check-in', description: 'Contactless arrival with key safe access.' },
  { title: 'Fresh Linen', description: 'Luxury bedding and premium towels provided.' }
];

export const roomShowcase = [
  {
    title: 'Master Bedroom',
    description:
      'King-size bed, plush linens, smart lighting, premium blackout curtains for restful stays.',
    image: propertyImage('PHOTO-2026-04-11-00-10-02_14.jpg')
  },
  {
    title: 'Living Area',
    description:
      'Spacious lounge with designer sofa, ambience lighting, and HDMI-ready smart TV for match nights.',
    image: propertyImage('PHOTO-2026-04-11-00-10-02_8.jpg')
  },
  {
    title: 'Kitchen & Dining',
    description:
      'Full kitchen with oven, coffee station, and dining table that seats eight guests comfortably.',
    image: propertyImage('PHOTO-2026-04-11-00-10-02_15.jpg')
  },
  {
    title: 'Workspace',
    description:
      'High-performance desk area with power, natural light, and calm decor for productive stays.',
    image: propertyImage('PHOTO-2026-04-11-00-10-02.jpg')
  }
];

export const reviews = [
  {
    author: 'Mia H.',
    rating: 5,
    feedback: 'Beautiful property and so easy to book direct. Perfect for our family weekend in Leeds.'
  },
  {
    author: 'James P.',
    rating: 5,
    feedback: 'Great location for Elland Road and fantastic workspace for my contractor stay.'
  },
  {
    author: 'Olivia T.',
    rating: 5,
    feedback: 'Luxury finish, fast WiFi, and the host was very responsive. Would book again.'
  }
];

export const locationPoints = [
  { label: 'Elland Road', distance: '6 mins', note: 'Stadium access for match-day groups' },
  { label: 'Leeds City Centre', distance: '12 mins', note: 'Culture, dining and shopping nearby' },
  { label: 'White Rose Centre', distance: '15 mins', note: 'Retail and leisure within easy reach' },
  { label: 'Leeds Station', distance: '14 mins', note: 'Quick train connections across the UK' }
];

export const faqs = [
  {
    question: 'What time is check-in and check-out?',
    answer: 'Check-in and check-out times are confirmed in writing before arrival. Check-in details are only released after full payment is received.'
  },
  {
    question: 'Is parking included?',
    answer: 'Yes, one free off-street parking space is included with every booking.'
  },
  {
    question: 'Can I bring children or pets?',
    answer: 'Families are welcome. Pets are not permitted to preserve luxury standards and cleanliness.'
  },
  {
    question: 'What is your cancellation policy?',
    answer: 'Refundable bookings receive a full refund 7+ days before check-in, 50% within 3-7 days, and no refund within 72 hours. Non-refundable bookings are discounted and cannot be refunded after payment.'
  },
  {
    question: 'Do you offer long-stay discounts?',
    answer: 'Yes. Extended stays of 28+ nights can receive up to 20% below the standard channel rate.'
  },
  {
    question: 'Is a deposit required?',
    answer: 'A deposit may be required. Bookings are not confirmed until the required payment is received by bank transfer.'
  }
];

export const houseRules = [
  'No parties or events',
  'No smoking inside the property',
  'No illegal substances',
  'No excessive noise',
  'Respect neighbours and surrounding properties',
  'Only registered guests allowed',
  'No unauthorised visitors',
  'Quiet hours are 10 PM - 7 AM',
  'Guests must report damages immediately',
  'Guests must leave the property in reasonable condition',
  'Turn off lights and appliances before checkout',
  'Lock all windows and doors when leaving',
  'Lost keys may result in replacement charges',
  'Additional cleaning fees may apply if house rules are breached'
];

export const cancellationPolicy = [
  {
    title: 'Refundable bookings',
    points: [
      'Full refund if cancelled 7+ days before check-in',
      '50% refund if cancelled within 3-7 days before check-in',
      'No refund within 72 hours of check-in'
    ]
  },
  {
    title: 'Non-refundable bookings',
    points: [
      'Discounted rate agreed before payment',
      'No refund after payment has been received'
    ]
  }
];

export const directBookingTerms = [
  {
    title: 'Booking confirmation',
    body:
      'A booking request does not confirm your stay. Your booking is only confirmed when the required payment has cleared and written confirmation has been issued.'
  },
  {
    title: 'Payment terms',
    body:
      'Payments are made by bank transfer. Bank details are provided after availability, guest details, and the agreed booking amount have been confirmed.'
  },
  {
    title: 'Deposits and balance',
    body:
      'A deposit may be required to reserve dates. The remaining balance must be paid by the deadline provided in your confirmation message.'
  },
  {
    title: 'Check-in details',
    body:
      'Check-in details, access instructions, and key information are only released after full payment has been received.'
  },
  {
    title: 'Damage responsibility',
    body:
      'Guests are responsible for damage, missing items, misuse of the property, and costs caused by breaches of the house rules.'
  },
  {
    title: 'Guest conduct',
    body:
      'Guests must behave responsibly, respect neighbours, follow quiet hours, and ensure only registered guests stay at or access the property.'
  },
  {
    title: 'Liability limits',
    body:
      'The business is not responsible for guest belongings, travel disruption, third-party services, or events outside reasonable control.'
  },
  {
    title: 'Refusal rights',
    body:
      'The business reserves the right to decline bookings, request verification, refuse access, or cancel stays where there is a security, conduct, payment, or misuse concern.'
  },
  {
    title: 'Additional charges',
    body:
      'Additional cleaning, key replacement, call-out, repair, or damage charges may apply where the property is left in poor condition or rules are breached.'
  }
];

export const pricingRules = [
  { label: 'Public direct website pricing', value: '10% below the standard channel rate' },
  { label: 'Returning guests', value: '15% below the standard channel rate' },
  { label: 'Last-minute unsold dates', value: '12-15% below the standard channel rate' },
  { label: 'Non-refundable bookings', value: '18% below the standard channel rate' },
  { label: 'Long stays of 28+ nights', value: '20% below the standard channel rate' }
];
