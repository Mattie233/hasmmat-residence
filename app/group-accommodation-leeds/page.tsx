import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FloatingCTA } from '@/components/FloatingCTA';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { galleryImages } from '@/lib/data';

const features = [
  ['4 bedrooms', 'Private bedrooms give everyone space while keeping the whole group under one roof.'],
  ['Sleeps up to 8 guests', 'A comfortable capacity for families and friends travelling together.'],
  ['Free parking', 'Off-street parking makes arrivals and day trips easier for guests travelling by car.'],
  ['Fast Wi-Fi', 'Reliable internet supports streaming, planning, video calls and working during your stay.'],
  ['Fully equipped kitchen', 'Prepare meals, store food and keep a familiar routine instead of relying on restaurants.'],
  ['Living and dining space', 'Shared areas make it easy for groups to relax, eat and spend time together.'],
  ['Shared spaces', 'Living, dining and kitchen areas give the whole group room to spend time together.'],
  ['Washing facilities', 'Laundry facilities help make longer group stays more practical.'],
  ['Garden', 'The garden provides useful outdoor space during downtime between trips and activities.']
];

const faqs = [
  {
    question: 'How many guests can stay at Hasmmat Residence?',
    answer: 'Hasmmat Residence can sleep up to 8 guests across four bedrooms, subject to availability and the booking arrangements confirmed with the host.'
  },
  {
    question: 'How many bedrooms are there?',
    answer: 'The property has 4 bedrooms, along with shared living, dining and kitchen areas for the group.'
  },
  {
    question: 'Is parking available?',
    answer: 'Yes. Free off-street parking is available for guests at Hasmmat Residence.'
  },
  {
    question: 'Is Wi-Fi included?',
    answer: 'Yes. Fast Wi-Fi is included, with three workspaces or desks available for work, planning and calls.'
  },
  {
    question: 'Is there a kitchen?',
    answer: 'Yes. The fully equipped kitchen provides the appliances, cookware and storage needed to prepare meals during your stay.'
  },
  {
    question: 'How far is the property from Leeds city centre?',
    answer: 'Leeds city centre is approximately 11 minutes away by car, although journey times vary with traffic and travel conditions.'
  },
  {
    question: 'Is Hasmmat Residence near Elland Road?',
    answer: 'Yes. The property in Beeston, South Leeds is approximately 6 minutes from Elland Road by car.'
  },
  {
    question: 'Can groups book directly?',
    answer: 'Yes. Groups can send a direct enquiry with their dates, number of guests and length of stay through the booking and contact options on this website.'
  },
  {
    question: 'Are parties allowed?',
    answer: 'No. Parties and events are not permitted. Guests must follow the house rules, respect neighbours and keep the property for the registered guests on the booking.'
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
  title: 'Group Accommodation Leeds | Sleeps Up to 8 | Hasmmat Residence',
  description:
    'Spacious 4-bedroom group accommodation in Leeds for up to 8 guests, with free parking, fast Wi-Fi, kitchen and convenient access to Elland Road and Leeds city centre.',
  alternates: {
    canonical: 'https://www.hasmmat-residence.com/group-accommodation-leeds'
  },
  openGraph: {
    title: 'Group Accommodation Leeds | Sleeps Up to 8 | Hasmmat Residence',
    description:
      'Spacious 4-bedroom group accommodation in Leeds for up to 8 guests, with free parking, fast Wi-Fi, kitchen and convenient access to Elland Road and Leeds city centre.',
    url: 'https://www.hasmmat-residence.com/group-accommodation-leeds',
    siteName: 'Hasmmat Residence',
    type: 'website',
    images: [
      {
        url: '/images/hasmmatres62/PHOTO-2026-04-11-00-10-02_4.jpg',
        width: 1200,
        height: 630,
        alt: 'Group accommodation in Leeds at Hasmmat Residence'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Group Accommodation Leeds | Sleeps Up to 8 | Hasmmat Residence',
    description:
      'Spacious 4-bedroom group accommodation in Leeds for up to 8 guests, with free parking, fast Wi-Fi and a fully equipped kitchen.'
  }
};

export default function GroupAccommodationLeedsPage() {
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
                South Leeds group stays
              </p>
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                Group Accommodation in Leeds
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-brand-100/90">
                Hasmmat Residence offers a spacious Leeds base where groups of up to 8 can stay together, with four bedrooms, shared living space, free parking and the practical facilities needed for a comfortable visit.
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
                  Book Direct
                </a>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.5rem] border border-white/10 bg-black/40 p-4 backdrop-blur-xl">
                  <p className="text-sm uppercase tracking-[0.2em] text-brand-300">Bedrooms</p>
                  <p className="mt-2 text-2xl font-semibold text-white">4</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-black/40 p-4 backdrop-blur-xl">
                  <p className="text-sm uppercase tracking-[0.2em] text-brand-300">Capacity</p>
                  <p className="mt-2 text-2xl font-semibold text-white">Up to 8</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-black/40 p-4 backdrop-blur-xl">
                  <p className="text-sm uppercase tracking-[0.2em] text-brand-300">Parking</p>
                  <p className="mt-2 text-2xl font-semibold text-white">Free</p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 shadow-soft backdrop-blur-xl">
              <div className="relative h-[500px] w-full">
                <Image
                  src={heroImage}
                  alt="Spacious living room for group accommodation in Leeds at Hasmmat Residence"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="border-t border-white/10 bg-black/60 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-brand-300">A shared Leeds base</p>
                <p className="mt-3 text-base leading-7 text-brand-100/90">
                  Four bedrooms, a kitchen, living and dining space, fast Wi-Fi and free parking keep a group stay simple.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-20">
        <div className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-white/10 bg-black/40 p-7 shadow-soft backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.25em] text-brand-300">Stay together in one Leeds property</p>
            <h2 className="mt-4 text-3xl font-semibold text-white">More room and shared space than several separate hotel rooms.</h2>
            <p className="mt-5 leading-8 text-brand-200">
              Booking one home gives families and friends a shared kitchen, dining area and living room alongside private bedrooms. It makes meals and downtime easier, while keeping everyone close together throughout the stay.
            </p>
            <p className="mt-4 leading-8 text-brand-200">
              For guests comparing places to stay in Leeds for groups, Hasmmat Residence offers the convenience of one well-equipped property in Beeston rather than coordinating multiple hotel rooms.
            </p>
          </div>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 shadow-soft">
            <div className="relative h-[390px] w-full">
              <Image
                src={kitchenImage}
                alt="Fully equipped kitchen and dining area for groups staying in Leeds"
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
            Practical facilities for group stays
          </p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Everything your group needs</h2>
          <p className="mt-5 leading-8 text-brand-200">
            This group accommodation in Leeds is set up for comfortable visits, with space to relax, cook and settle in together.
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {features.map(([title, description]) => (
            <div key={title} className="rounded-[2rem] border border-white/10 bg-black/40 p-6 shadow-soft backdrop-blur-xl">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-400/10 text-lg text-brand-200">✓</div>
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              <p className="mt-3 leading-7 text-brand-200">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-20">
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-brand-300">Great location in South Leeds</p>
            <h2 className="mt-4 text-3xl font-semibold text-white">A convenient Beeston base for exploring Leeds together.</h2>
            <p className="mt-5 leading-8 text-brand-200">
              Hasmmat Residence is located in Beeston, South Leeds, with straightforward routes to Elland Road, Leeds city centre and surrounding Leeds areas. It is approximately 6 minutes from Elland Road and approximately 11 minutes from Leeds city centre by car, depending on traffic.
            </p>
            <ul className="mt-6 space-y-3 text-brand-100/90">
              <li>• Approximately 6 minutes from Elland Road</li>
              <li>• Approximately 11 minutes from Leeds city centre</li>
              <li>• Convenient for South Leeds and nearby areas</li>
              <li>• Free parking for guests travelling by car</li>
            </ul>
          </div>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 shadow-soft">
            <div className="relative h-[380px] w-full">
              <Image
                src={gardenImage}
                alt="Garden at Hasmmat Residence group accommodation in Beeston, South Leeds"
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
            Flexible group stays Leeds guests can plan around
          </p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Perfect for different types of group stays</h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[
            ['Families', 'Keep everyone together with bedrooms, shared meals and room to relax between days out in Leeds.'],
            ['Friends', 'Enjoy a comfortable base for a city break, local attractions, dining and sporting visits.'],
            ['Family groups', 'Keep everyone together with bedrooms, shared meals and room to relax between days out.'],
            ['Friends travelling together', 'Enjoy a comfortable base for a city break, local attractions, dining and sporting visits.'],
            ['Matchday groups', 'Stay approximately 6 minutes from Elland Road with enough space for the whole group.'],
            ['Leeds visits', 'Use the kitchen, living space and parking to make the group trip straightforward.']
          ].map(([title, description]) => (
            <div key={title} className="rounded-[2rem] border border-white/10 bg-black/40 p-6 shadow-soft backdrop-blur-xl">
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              <p className="mt-3 leading-7 text-brand-200">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-20">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-[2.5rem] border border-white/10 bg-brand-950/80 p-8 shadow-soft backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.25em] text-brand-300">Visiting Elland Road?</p>
            <h2 className="mt-4 text-3xl font-semibold text-white">Stay close to the stadium with space for your group.</h2>
            <p className="mt-5 leading-8 text-brand-200">
              For matchday visitors and sporting event guests, our <Link href="/accommodation-near-elland-road" className="font-semibold text-brand-300 underline decoration-brand-300/40 underline-offset-4 hover:text-white">accommodation near Elland Road</Link> offers more detail about the location and facilities.
            </p>
          </div>
          <div className="rounded-[2.5rem] border border-white/10 bg-brand-950/80 p-8 shadow-soft backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.25em] text-brand-300">Planning your group visit?</p>
            <h2 className="mt-4 text-3xl font-semibold text-white">Share your dates and guest details.</h2>
            <p className="mt-5 leading-8 text-brand-200">
              Send an enquiry with the number of guests and length of stay so the host can confirm the right arrangement.
            </p>
          </div>
        </div>
      </section>

      <section className="container py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-brand-300">Book your group stay direct</p>
            <h2 className="mt-4 text-3xl font-semibold text-white">Share your plans and we will help confirm the right arrangement.</h2>
            <p className="mt-5 leading-8 text-brand-200">
              Use the existing booking or enquiry flow to check availability for your group. Please include your dates, number of guests and length of stay. Direct booking is available, and longer stays can be discussed with the host.
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
            <p className="text-sm uppercase tracking-[0.22em] text-brand-300">What to include</p>
            <ul className="mt-6 space-y-4 text-brand-200">
              <li>• Preferred check-in and check-out dates</li>
              <li>• Number of guests, up to 8</li>
              <li>• Length of stay</li>
              <li>• Any practical requirements for your group</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="faq" className="container py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 inline-flex rounded-full border border-brand-300/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.25em] text-brand-200">
            Frequently asked questions
          </p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">Questions about group accommodation in Leeds</h2>
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
