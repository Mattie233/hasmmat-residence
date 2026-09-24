import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { FloatingCTA } from '@/components/FloatingCTA';
import { galleryImages } from '@/lib/data';

const contractorFeatures = [
  {
    title: '4-bedroom layout',
    description: 'Spacious accommodation designed to keep teams comfortable with private rooms and shared living areas.'
  },
  {
    title: 'Sleeps up to 8',
    description: 'A practical option for project crews, site engineers, tradespeople and visiting business teams in Leeds.'
  },
  {
    title: 'Fast Wi-Fi & workspaces',
    description: 'Three desk areas and reliable internet support remote work, reporting and daily planning.'
  },
  {
    title: 'Fully equipped kitchen',
    description: 'Cook meals together, store supplies and settle in for longer stays without hotel limitations.'
  },
  {
    title: 'Free parking',
    description: 'Included off-street parking makes arrivals easier for contractors travelling in company vehicles.'
  },
  {
    title: 'Garden & washing facilities',
    description: 'A practical home-from-home setup with laundry access and outdoor space for downtime after work.'
  }
];

const faqs = [
  {
    question: 'How many contractors can stay at Hasmmat Residence?',
    answer: 'The property sleeps up to 8 guests across four bedrooms, making it suitable for small teams, trade crews and business travellers.'
  },
  {
    question: 'Is parking available?',
    answer: 'Yes. Free parking is included, which is useful for contractors and teams travelling with tools, equipment or work vehicles.'
  },
  {
    question: 'Does the property have Wi-Fi?',
    answer: 'Yes. Fast Wi-Fi and dedicated workspaces are in place to support daily work, calls and project planning.'
  },
  {
    question: 'Can companies book directly?',
    answer: 'Yes. Direct bookings are available for companies and businesses, and invoice arrangements can be discussed with the host.'
  },
  {
    question: 'Do you provide invoices?',
    answer: 'Company invoices can be arranged for qualifying business stays. Please include your dates, guest numbers and length of stay when enquiring.'
  },
  {
    question: 'Are longer stays available?',
    answer: 'Yes. Long-stay accommodation Leeds teams and project workers are welcome, with direct-booking options depending on the stay length.'
  },
  {
    question: 'Where in Leeds is the property?',
    answer: 'The property is located in Beeston, South Leeds, providing convenient access to Elland Road, Leeds city centre and surrounding business and construction locations.'
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
  title: 'Contractor Accommodation Leeds | Hasmmat Residence',
  description:
    '4-bedroom contractor accommodation in Leeds for teams of up to 8. Free parking, fast Wi-Fi, kitchen and workspaces. Direct and long-stay bookings available.',
  alternates: {
    canonical: 'https://hasmmatresidence.com/contractor-accommodation-leeds'
  },
  openGraph: {
    title: 'Contractor Accommodation Leeds | Hasmmat Residence',
    description:
      '4-bedroom contractor accommodation in Leeds for teams of up to 8. Free parking, fast Wi-Fi, kitchen and workspaces. Direct and long-stay bookings available.',
    url: 'https://hasmmatresidence.com/contractor-accommodation-leeds',
    siteName: 'Hasmmat Residence',
    type: 'website',
    images: [
      {
        url: '/images/hasmmatres62/PHOTO-2026-04-11-00-10-02_4.jpg',
        width: 1200,
        height: 630,
        alt: 'Contractor accommodation in Leeds at Hasmmat Residence'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contractor Accommodation Leeds | Hasmmat Residence',
    description:
      '4-bedroom contractor accommodation in Leeds for teams of up to 8. Free parking, fast Wi-Fi, kitchen and workspaces. Direct and long-stay bookings available.'
  }
};

export default function ContractorAccommodationLeedsPage() {
  const heroImage = galleryImages[2]?.src ?? '/images/hasmmatres62/Kitchen.jpeg';

  return (
    <main className="relative overflow-hidden bg-[#090707] text-brand-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Navbar />

      <section className="relative overflow-hidden pt-28">
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-x-0 top-12 h-72 bg-gradient-to-b from-brand-700/80 to-transparent blur-3xl" />
        <div className="container relative">
          <div className="grid items-center gap-10 pb-16 pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:pb-20">
            <div className="max-w-2xl">
              <p className="mb-4 inline-flex rounded-full border border-brand-300/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.25em] text-brand-200">
                Contractor stays Leeds
              </p>
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
                Contractor Accommodation in Leeds
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-brand-100/90">
                Hasmmat Residence provides comfortable accommodation for contractors, engineers, tradespeople, project teams and business travellers working in Leeds and the surrounding areas.
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
                  Get a Contractor Quote
                </a>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.5rem] border border-white/10 bg-black/40 p-4 backdrop-blur-xl">
                  <p className="text-sm uppercase tracking-[0.2em] text-brand-300">Property</p>
                  <p className="mt-2 text-2xl font-semibold text-white">4-bed</p>
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
                  alt="Fully equipped kitchen and dining space at Hasmmat Residence contractor accommodation in Leeds"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              <div className="border-t border-white/10 bg-black/60 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-brand-300">Why it works for contractors</p>
                <p className="mt-3 text-base leading-7 text-brand-100/90">
                  Private bedrooms, shared living space, reliable internet and straightforward enquiries for longer stays.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 inline-flex rounded-full border border-brand-300/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.25em] text-brand-200">
            Accommodation designed for working teams
          </p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">
            Built for project schedules, practical workdays and longer stays.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {contractorFeatures.map((feature) => (
            <div
              key={feature.title}
              className="rounded-[2rem] border border-white/10 bg-black/40 p-6 shadow-soft backdrop-blur-xl"
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand-400/10 text-lg text-brand-200">
                ✓
              </div>
              <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
              <p className="mt-3 leading-7 text-brand-200">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-20">
        <div className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-white/10 bg-black/40 p-6 shadow-soft backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.25em] text-brand-300">Convenient South Leeds location</p>
            <h2 className="mt-4 text-3xl font-semibold text-white">Beeston, South Leeds with easy access to work and city routes.</h2>
            <p className="mt-5 leading-8 text-brand-200">
              Set in Beeston, this property is a convenient base for accommodation for contractors in Leeds, with straightforward access to Elland Road, Leeds city centre and nearby commercial and industrial areas.
            </p>
            <ul className="mt-6 space-y-3 text-brand-100/90">
              <li>• Frequent access to Leeds city centre and surrounding commercial zones</li>
              <li>• Convenient for work-related travel across South Leeds and West Yorkshire</li>
              <li>• Suitable for business accommodation Leeds teams and project-based stays</li>
            </ul>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-black/40 shadow-soft backdrop-blur-xl">
            <div className="relative h-[420px] w-full">
              <Image
                src={galleryImages[0]?.src ?? '/images/hasmmatres62/image1.jpeg'}
                alt="Living room and dining area showing the spacious shared environment for contractor accommodation in Leeds"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container py-20">
        <div className="rounded-[2.5rem] border border-white/10 bg-brand-950/80 p-8 shadow-soft backdrop-blur-xl">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-brand-300">A practical alternative to hotel rooms</p>
              <h2 className="mt-4 text-3xl font-semibold text-white">One home for the team can be more comfortable, more efficient and more cost-effective.</h2>
            </div>
            <div className="space-y-5 text-brand-200">
              <p className="leading-8">
                Instead of booking multiple hotel rooms, contractors and teams can share one well-equipped property with a kitchen, living/dining space, fast Wi-Fi and secure parking. That creates a more settled base for longer site work and easier daily routines.
              </p>
              <p className="leading-8">
                This approach is especially useful for workforce accommodation Leeds teams, especially when projects run over several weeks and the crew needs a practical home base rather than temporary short-stay rooms.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 inline-flex rounded-full border border-brand-300/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.25em] text-brand-200">
            Long-stay contractor accommodation
          </p>
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">
            Suitable for longer project stays and steady team accommodation.
          </h2>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="rounded-[2rem] border border-white/10 bg-black/40 p-6 backdrop-blur-xl">
            <h3 className="text-xl font-semibold text-white">Short project blocks</h3>
            <p className="mt-3 leading-7 text-brand-200">
              Ideal for work schedules that require a practical base for a few nights or a few weeks.
            </p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-black/40 p-6 backdrop-blur-xl">
            <h3 className="text-xl font-semibold text-white">Multi-week assignments</h3>
            <p className="mt-3 leading-7 text-brand-200">
              Comfortable enough for longer stays, with kitchen access, laundry and shared spaces that support day-to-day living.
            </p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-black/40 p-6 backdrop-blur-xl">
            <h3 className="text-xl font-semibold text-white">Direct booking support</h3>
            <p className="mt-3 leading-7 text-brand-200">
              Direct and long-stay bookings are available, with arrangements depending on the length of stay and guest requirements.
            </p>
          </div>
        </div>
      </section>

      <section className="container py-20">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-brand-300">Direct bookings for companies</p>
            <h2 className="mt-4 text-3xl font-semibold text-white">Simple booking for teams, projects and business travel.</h2>
            <p className="mt-5 leading-8 text-brand-200">
              Companies needing contractor accommodation Leeds can book direct and discuss the details of their stay with the host. Whether you are arranging accommodation for contractors in Leeds, a short project stay, or a longer business accommodation Leeds arrangement, the process is designed to be straightforward.
            </p>
            <ul className="mt-6 space-y-3 text-brand-100/90">
              <li>• Dates, guest numbers and the length of stay can be shared in advance</li>
              <li>• Company invoicing can be arranged where required</li>
              <li>• Suitable for project teams, engineers, trades and visiting staff</li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/enquire#contact"
                className="inline-flex items-center justify-center rounded-full bg-brand-400 px-7 py-3 text-sm font-semibold text-white transition hover:bg-brand-300"
              >
                Provide your dates and guest details
              </a>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-3 text-sm font-semibold text-brand-100 transition hover:border-brand-300 hover:text-white"
              >
                Back to homepage
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-black/40 p-6 shadow-soft backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.25em] text-brand-300">Booking enquiry details</p>
            <div className="mt-6 space-y-4 text-brand-200">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-brand-300">What to send</p>
                <p className="mt-2 leading-7">Dates, number of guests, length of stay, and any project notes or work requirements.</p>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-brand-300">Suitable for</p>
                <p className="mt-2 leading-7">Construction teams, engineers, tradespeople, onsite workers and business travel groups.</p>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-brand-300">Location</p>
                <p className="mt-2 leading-7">Beeston, South Leeds, with easy access to Elland Road and the city centre.</p>
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
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">
            Common questions about contractor stays in Leeds.
          </h2>
        </div>

        <div className="mt-12 space-y-4">
          {faqs.map((item) => (
            <details
              key={item.question}
              className="group rounded-[2rem] border border-white/10 bg-black/40 p-6 shadow-soft backdrop-blur-xl"
            >
              <summary className="cursor-pointer list-none text-left text-lg font-semibold text-white">
                <span className="flex items-center justify-between gap-4">
                  <span>{item.question}</span>
                  <span className="text-brand-200 transition group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-4 leading-7 text-brand-200">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <Footer />
      <FloatingCTA />
    </main>
  );
}
