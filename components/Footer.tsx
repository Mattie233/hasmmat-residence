'use client';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/80 py-10 text-brand-200">
      <div className="container grid gap-6 md:grid-cols-3">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-brand-300">Hasmmat Residence</p>
          <p className="mt-4 max-w-sm text-sm leading-7">
            Premium serviced accommodation in Leeds, crafted for families, contractors, groups and football fans.
          </p>
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-brand-300">Quick Links</p>
          <ul className="mt-4 space-y-3 text-sm text-brand-200">
            <li>Home</li>
            <li>Gallery</li>
            <li>Amenities</li>
            <li>Location</li>
          </ul>
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-brand-300">Policies</p>
          <ul className="mt-4 space-y-3 text-sm text-brand-200">
            <li>Terms & Conditions</li>
            <li>Privacy Policy</li>
            <li>House Rules</li>
            <li>Cancellation Policy</li>
          </ul>
        </div>
      </div>
      <div className="mt-10 border-t border-white/10 pt-6 text-sm text-brand-300">
        <div className="container flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Hasmmat Residence. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Follow us:</span>
            <a href="#" className="transition hover:text-white">Instagram</a>
            <a href="#" className="transition hover:text-white">Facebook</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
