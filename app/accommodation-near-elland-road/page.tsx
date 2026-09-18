import type { Metadata } from 'next';
import Image from 'next/image';
import { FloatingCTA } from '@/components/FloatingCTA';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { galleryImages } from '@/lib/data';

const faqs = [
  {
    question: 'How far is Hasmmat Residence from Elland Road?',
    answer: 'Hasmmat Residence is approximately 6 minutes from Elland Road by car, making it a convenient base for matchday visits and events.'
  },
  {
    question: 'How many guests can stay?',
    answer: 'The four-bedroom property can sleep up to 8 guests, subject to availability and the booking arrangements confirmed with the host.'
  },
  {
    question: 'Is parking available?',
    answer: 'Yes. Free off-street parking is available at the property for guests.'
  },
  {
    question: 'Is the property suitable for family stays?',
    answer: 'Yes. Multiple bedrooms, a shared kitchen and living space give families room to stay together comfortably.'
  },
  {
    question: 'Is Wi-Fi included?',
    answer: 'Yes. Fast Wi-Fi is included for family planning, entertainment and staying connected during your visit.'
  },
  {
    question: 'Can I book directly?',
    answer: 'Yes. You can check availability and send a direct enquiry through the booking and contact options on the Hasmmat Residence website.'
  },
  {
    question: 'How far is Leeds city centre?',
    answer: 'Leeds city centre is approximately 11 minutes away by car, although journey times vary with traffic and travel conditions.'
  },
  {
    question: 'Is the property suitable for family stays?',
    answer: 'Yes. The four bedrooms, kitchen, shared living space, parking and nearby attractions make it a practical choice for families visiting Leeds.'
  }
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  }))
};

export const metadata: Metadata = {
  title: 'Accommodation Near Elland Road | Hasmmat Residence Leeds',
  description:
    'Stay close to Elland Road in a spacious 4-bedroom Leeds property sleeping up to 8 guests, with free parking, fast Wi-Fi and easy access to the city centre.',
  alternates: {
    canonical: 'https://www.hasmmat-residence.com/accommodation-near-elland-road'
  },
  openGraph: {
    title: 'Accommodation Near Elland Road | Hasmmat Residence Leeds',
    description:
      'Stay close to Elland Road in a spacious 4-bedroom Leeds property sleeping up to 8 guests, with free parking, fast Wi-Fi and easy access to the city centre.',
    url: 'https://www.hasmmat-residence.com/accommodation-near-elland-road',
    siteName: 'Hasmmat Residence',
    type: 'website',
    images: [
      {
        url: '/images/hasmmatres62/PHOTO-2026-04-11-00-10-02_4.jpg',
        width: 1200,
        height: 630,
        alt: 'Accommodation near Elland Road at Hasmmat Residence Leeds'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Accommodation Near Elland Road | Hasmmat Residence Leeds',
    description:
      'Stay close to Elland Road in a spacious 4-bedroom Leeds property sleeping up to 8 guests, with free parking and fast Wi-Fi.'
  }
};

export default function AccommodationNearEllandRoadPage() {
  const heroImage = galleryImages[0]?.src ?? '/images/hasmmatres62/image1.jpeg';
  const kitchenImage = galleryImages[2]?.src ?? '/images/hasmmatres62/Kitchen.jpeg';
  const gardenImage = galleryImages[7]?.src ?? '/images/hasmmatres62/1da97795-14b5-4d6e-b4d8-13f8eadd9b8c~1.jpeg';

  return (
    <main className="relative overflow-hidden bg-[#090707] text-brand-100">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Navbar />

      <section className="relative overflow-hidden pt-28">
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-x-0 top-12 h-72 bg-gradient-to-b from-brand-700/80 to-transparent blur-3xl" />
        <div className="container relative">
          <div className="grid items-center gap-10 pb-16 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:pb-20">
            <div className="max-w-2xl">
              <p className="mb-4 inline-flex rounded-full border border-brand-300/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.25em] text-brand-200">
                South Leeds stays near Elland Road
              </p>
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                Accommodation Near Elland Road, Leeds
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-brand-100/90">
                Stay in a spacious 4-bedroom property close to Elland Road, with room for up to 8 guests. Hasmmat Residence gives families a comfortable base for visiting Leeds, local attractions and matchday events.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="/#booking"
                  className="inline-flex items-center justify-center rounded-full bg-brand-400 px-7 py-3 text-sm font-semibold text-white transition hover:bg-brand-300"
                >
                  Check Availability
                </a>
                <a
                  href="/#contact"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-3 text-sm font-semibold text-brand-100 transition hover:border-brand-300 hover:text-white"
                >
                  Get a Quote
                </a>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.5rem] border border-white/10 bg-black/40 p-4 backdrop-blur-xl">
                  <p className="text-sm uppercase tracking-[0.2em] text-brand-300">Bedrooms</p>
                  <p className="mt-2 text-2xl font-semibold text-white">4-bed</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-black/40 p-4 backdrop-blur-xl">
                  <p className="text-sm uppercase tracking-[0.2em] text-brand-300">Capacity</p>
                  <p className="mt-2 text-2xl font-semibold text-white">Up to 8</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-black/40 p-4 backdrop-blur-xl">
                  <p className="text-sm uppercase tracking-[0.2em] text-brand-300">Elland Road</p>
                  <p className="mt-2 text-2xl font-semibold text-white">Approx. 6 mins</p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 shadow-soft backdrop-blur-xl">
              <div className="relative h-[500px] w-full">
                <Image
                  src={heroImage}
                  alt="Spacious living room at Hasmmat Residence accommodation near Elland Road"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="border-t border-white/10 bg-black/60 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-brand-300">A comfortable base for Leeds visits</p>
                <p className="mt-3 text-base leading-7 text-brand-100/90">
                  Shared living and dining space, a fully equipped kitchen, fast Wi-Fi and free parking make family stays straightforward.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-20">
        <div className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-white/10 bg-black/40 p-7 shadow-soft backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.25em] text-brand-300">Stay close to Elland Road</p>
            <h2 className="mt-4 text-3xl font-semibold text-white">A practical base for family visits, matchdays and local days out.</h2>
            <p className="mt-5 leading-8 text-brand-200">
              Hasmmat Residence is approximately 6 minutes from Elland Road, so families attending a match or event can stay close to the stadium without giving up the space of a whole home. White Rose Shopping Centre is approximately a 7-minute drive away for shopping, food and family activities.
            </p>
            <p className="mt-4 leading-8 text-brand-200">
              This is independent accommodation near Elland Road and is not affiliated with or endorsed by Leeds United.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 shadow-soft">
            <div className="relative h-[390px] w-full">
              <Image
                src={kitchenImage}
                alt="Fully equipped kitchen for guests staying near Elland Road in Leeds"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 inline-flex rounded-full border border-brand-300/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.25em] text-brand-200">
            Comfortable family stays near Elland Road
          </p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Stay together instead of booking multiple hotel rooms.</h2>
          <p className="mt-5 leading-8 text-brand-200">
            The property gives families up to 8 guests a shared base with the privacy of multiple bedrooms and the ease of cooking, relaxing and planning together.
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[
            ['Multiple bedrooms', 'Four bedrooms give families room to settle in comfortably.'],
            ['Shared kitchen and living space', 'Cook together, eat together and unwind in a proper home.'],
            ['Parking and fast Wi-Fi', 'Free parking supports arrivals, while reliable Wi-Fi helps with entertainment and planning.'],
            ['Nearby family activities', 'Beeston in South Leeds gives straightforward access to Elland Road, White Rose and local shops.'],
            ['Space for up to 8', 'Keep the family together across four bedrooms and shared spaces.'],
            ['A comfortable home base', 'Enjoy a practical property for family visits to Leeds.']
          ].map(([title, description]) => (
            <div key={title} className="rounded-[2rem] border border-white/10 bg-black/40 p-6 shadow-soft backdrop-blur-xl">
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              <p className="mt-3 leading-7 text-brand-200">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-20">
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-brand-300">Convenient South Leeds location</p>
            <h2 className="mt-4 text-3xl font-semibold text-white">Beeston accommodation Leeds guests can use as a city base.</h2>
            <p className="mt-5 leading-8 text-brand-200">
              Located in Beeston, South Leeds, Hasmmat Residence offers families easy access to Elland Road, White Rose Shopping Centre, local shops and public transport. Leeds city centre is approximately 11 minutes away by car, depending on traffic.
            </p>
            <ul className="mt-6 space-y-3 text-brand-100/90">
              <li>• Approximately 6 minutes from Elland Road</li>
              <li>• Approximately 11 minutes from Leeds city centre</li>
              <li>• Convenient for local shops and public transport</li>
              <li>• Easy routes through South Leeds and surrounding areas</li>
            </ul>
          </div>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 shadow-soft">
            <div className="relative h-[380px] w-full">
              <Image
                src={gardenImage}
                alt="Garden at Hasmmat Residence in Beeston, South Leeds"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container py-20">
        <div className="rounded-[2.5rem] border border-white/10 bg-brand-950/80 p-8 shadow-soft backdrop-blur-xl">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-brand-300">A comfortable family base</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">More space for family visits to Leeds.</h2>
            </div>
            <div className="space-y-5 text-brand-200">
              <p className="leading-8">
                Alongside its location near Elland Road, the property gives families the space and facilities needed for a practical short stay in Leeds.
              </p>
              <p className="leading-8">
                White Rose Shopping Centre is approximately a 7-minute drive away, and Leeds city centre is approximately 11 minutes away by car, depending on traffic.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-brand-300">Book direct</p>
            <h2 className="mt-4 text-3xl font-semibold text-white">Plan your stay directly with Hasmmat Residence.</h2>
            <p className="mt-5 leading-8 text-brand-200">
              Send your dates and guest details through the existing booking or enquiry flow. Direct bookings include the public direct saving already advertised on the website, with availability, payment and booking details confirmed by the host.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/enquire#booking"
                className="inline-flex items-center justify-center rounded-full bg-brand-400 px-7 py-3 text-sm font-semibold text-white transition hover:bg-brand-300"
              >
                Check Availability
              </a>
              <a
                href="/enquire#contact"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-3 text-sm font-semibold text-brand-100 transition hover:border-brand-300 hover:text-white"
              >
                Enquire or Book
              </a>
            </div>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-black/40 p-7 shadow-soft backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.22em] text-brand-300">Direct booking details</p>
            <div className="mt-6 space-y-4 text-brand-200">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <span>Public direct saving</span>
                <strong className="text-white">5%</strong>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <span>Property</span>
                <strong className="text-white">4 bedrooms</strong>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span>Capacity</span>
                <strong className="text-white">Up to 8 guests</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="container py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 inline-flex rounded-full border border-brand-300/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.25em] text-brand-200">
            Frequently asked questions
          </p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Questions about staying near Elland Road.</h2>
        </div>
        <div className="mt-12 space-y-4">
          {faqs.map((faq) => (
            <details key={faq.question} className="group rounded-[2rem] border border-white/10 bg-black/40 p-6 shadow-soft backdrop-blur-xl">
              <summary className="cursor-pointer list-none text-left text-lg font-semibold text-white">
                <span className="flex items-center justify-between gap-4">
                  <span>{faq.question}</span>
                  <span className="text-brand-200 transition group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-4 leading-7 text-brand-200">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <Footer />
      <FloatingCTA />
    </main>
  );
}