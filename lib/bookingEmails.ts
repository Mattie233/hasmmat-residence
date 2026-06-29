import type { BookingType } from '@/types';
import { siteInfo } from '@/lib/data';
import { sendEmail } from '@/lib/email';

export type PaidBookingDetails = {
  checkIn: string;
  checkOut: string;
  guests: string;
  nights: string;
  bookingType: string;
  quotedTotal: string;
  rate: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestAddress: string;
  specialRequests: string;
  paymentId: string;
};

export function formatBookingType(value: BookingType | string) {
  return value === 'nonrefundable' ? 'Non-refundable' : value === 'flexible' ? 'Refundable' : value;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function rows(details: Array<[string, string]>) {
  return details
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding:8px 0;color:#6b625c;">${escapeHtml(label)}</td>
          <td style="padding:8px 0;text-align:right;font-weight:600;color:#171412;">${escapeHtml(value)}</td>
        </tr>
      `,
    )
    .join('');
}

function textRows(details: Array<[string, string]>) {
  return details.map(([label, value]) => `${label}: ${value}`).join('\n');
}

export async function sendPaidBookingEmails(details: PaidBookingDetails) {
  const ownerEmail = process.env.BOOKING_NOTIFICATION_EMAIL || siteInfo.email;
  const bookingRows: Array<[string, string]> = [
    ['Check-in', details.checkIn],
    ['Check-out', details.checkOut],
    ['Guests', details.guests],
    ['Nights', details.nights],
    ['Booking type', details.bookingType],
    ['Total paid', details.quotedTotal],
    ['Rate', details.rate],
  ];
  const guestRows: Array<[string, string]> = [
    ['Lead guest', details.guestName],
    ['Email', details.guestEmail],
    ['Phone', details.guestPhone],
    ['Address', details.guestAddress],
    ['Stay notes', details.specialRequests],
    ['Stripe payment', details.paymentId],
  ];

  const guestText = [
    `Hi ${details.guestName},`,
    '',
    `Your booking request for ${siteInfo.name} has been received and paid.`,
    '',
    textRows(bookingRows),
    '',
    'We will review the guest details and send final check-in instructions after verification.',
    '',
    `${siteInfo.name}`,
    siteInfo.email,
    siteInfo.phone,
  ].join('\n');

  const ownerText = [
    'New paid direct booking received.',
    '',
    textRows(bookingRows),
    '',
    textRows(guestRows),
  ].join('\n');

  const emailShell = (heading: string, body: string, detailRows: Array<[string, string]>) => `
    <div style="font-family:Inter,Arial,sans-serif;background:#f7f1eb;padding:32px;color:#171412;">
      <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:18px;padding:28px;border:1px solid #eaded4;">
        <p style="margin:0 0 8px;color:#9b6f4e;text-transform:uppercase;letter-spacing:.16em;font-size:12px;">${escapeHtml(siteInfo.name)}</p>
        <h1 style="margin:0 0 16px;font-size:26px;line-height:1.25;">${escapeHtml(heading)}</h1>
        <p style="margin:0 0 24px;line-height:1.7;color:#4c4540;">${escapeHtml(body)}</p>
        <table style="width:100%;border-collapse:collapse;border-top:1px solid #eaded4;border-bottom:1px solid #eaded4;">
          ${rows(detailRows)}
        </table>
        <p style="margin:24px 0 0;line-height:1.7;color:#4c4540;">${escapeHtml(siteInfo.email)}<br />${escapeHtml(siteInfo.phone)}</p>
      </div>
    </div>
  `;

  await Promise.all([
    sendEmail({
      to: details.guestEmail,
      subject: `Booking received for ${siteInfo.name}`,
      html: emailShell(
        'Your booking has been received',
        'Thanks for booking direct. Your payment has been received and the stay details are below.',
        bookingRows,
      ),
      text: guestText,
      replyTo: ownerEmail,
    }),
    sendEmail({
      to: ownerEmail,
      subject: `New paid booking: ${details.checkIn} to ${details.checkOut}`,
      html: emailShell('New paid direct booking', 'A guest has paid through Stripe. Review the guest details below.', [
        ...bookingRows,
        ...guestRows,
      ]),
      text: ownerText,
      replyTo: details.guestEmail,
    }),
  ]);
}
