import type { BookingType } from '@/types';
import { siteInfo } from '@/lib/data';
import { sendEmail } from '@/lib/email';
import type { BookingConfirmationRequest } from '@/lib/bookingRequest';

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

export type BookingConfirmationDetails = BookingConfirmationRequest & {
  submittedAt: string;
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

function brandedEmailShell({
  eyebrow,
  heading,
  body,
  detailRows,
  footerNote,
}: {
  eyebrow: string;
  heading: string;
  body: string;
  detailRows: Array<[string, string]>;
  footerNote?: string;
}) {
  return `
    <div style="margin:0;padding:0;background:#090707;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#090707;">
        <tr>
          <td style="padding:28px 14px;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;margin:0 auto;background:#fffaf5;border-radius:22px;overflow:hidden;border:1px solid #eaded4;">
              <tr>
                <td style="background:#17120f;padding:30px 26px;color:#fffaf5;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="vertical-align:middle;">
                        <div style="display:inline-block;width:52px;height:52px;border-radius:16px;background:#e6ad2f;color:#17120f;text-align:center;line-height:52px;font-family:Georgia,serif;font-size:22px;font-weight:700;">HR</div>
                      </td>
                      <td style="vertical-align:middle;padding-left:14px;">
                        <p style="margin:0;color:#e6ad2f;text-transform:uppercase;letter-spacing:.18em;font:700 12px Arial,sans-serif;">${escapeHtml(eyebrow)}</p>
                        <p style="margin:6px 0 0;color:#fffaf5;font:700 22px Georgia,serif;">${escapeHtml(siteInfo.name)}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td style="padding:30px 26px 12px;">
                  <h1 style="margin:0 0 14px;color:#17120f;font:700 28px/1.25 Georgia,serif;">${escapeHtml(heading)}</h1>
                  <p style="margin:0;color:#4c4540;font:16px/1.7 Arial,sans-serif;">${escapeHtml(body)}</p>
                </td>
              </tr>
              <tr>
                <td style="padding:18px 26px 28px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;background:#ffffff;border:1px solid #eaded4;border-radius:16px;overflow:hidden;">
                    ${detailRows
                      .map(
                        ([label, value]) => `
                          <tr>
                            <td style="padding:14px 16px;border-bottom:1px solid #f1e5dc;color:#756a62;font:14px Arial,sans-serif;">${escapeHtml(label)}</td>
                            <td style="padding:14px 16px;border-bottom:1px solid #f1e5dc;color:#17120f;font:700 14px Arial,sans-serif;text-align:right;">${escapeHtml(value)}</td>
                          </tr>
                        `,
                      )
                      .join('')}
                  </table>
                  ${
                    footerNote
                      ? `<p style="margin:18px 0 0;color:#4c4540;font:14px/1.7 Arial,sans-serif;">${escapeHtml(footerNote)}</p>`
                      : ''
                  }
                  <p style="margin:22px 0 0;color:#4c4540;font:14px/1.7 Arial,sans-serif;">
                    ${escapeHtml(siteInfo.name)}<br />
                    ${escapeHtml(siteInfo.email)}<br />
                    ${escapeHtml(siteInfo.phone)}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;
}

function formatSubmittedAt(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Europe/London',
  }).format(new Date(value));
}

export async function sendBookingConfirmationEmails(details: BookingConfirmationDetails) {
  const hostEmail = siteInfo.email;
  const total = `£${details.total.toFixed(0)}`;
  const bookingRows: Array<[string, string]> = [
    ['Guest name', details.guestName],
    ['Property booked', details.propertyName],
    ['Check-in date', details.checkIn],
    ['Check-out date', details.checkOut],
    ['Number of guests', `${details.guests}`],
    ['Total booking price', total],
    ['Booking summary', `${details.nights} night${details.nights === 1 ? '' : 's'} · ${formatBookingType(details.bookingType)} · ${details.savingsLabel}`],
  ];
  const hostRows: Array<[string, string]> = [
    ['Guest name', details.guestName],
    ['Guest email address', details.guestEmail],
    ['Guest phone number', details.guestPhone],
    ['Property booked', details.propertyName],
    ['Check-in date', details.checkIn],
    ['Check-out date', details.checkOut],
    ['Number of guests', `${details.guests}`],
    ['Total booking price', total],
    ['Special requests', details.specialRequests || 'None'],
    ['Submitted', formatSubmittedAt(details.submittedAt)],
  ];

  const guestText = [
    `Hi ${details.guestName},`,
    '',
    `Thank you for choosing ${siteInfo.name}. Your booking details are below.`,
    '',
    textRows(bookingRows),
    '',
    'If any detail is incorrect, please contact us as soon as possible.',
    '',
    `${siteInfo.name}`,
    siteInfo.email,
    siteInfo.phone,
  ].join('\n');
  const hostText = ['New booking received.', '', textRows(hostRows)].join('\n');

  await Promise.all([
    sendEmail({
      to: details.guestEmail,
      subject: 'Booking Confirmation – Hasmmat Residence',
      html: brandedEmailShell({
        eyebrow: 'Booking confirmation',
        heading: 'Your booking is confirmed',
        body: `Thank you for choosing ${siteInfo.name}. We have received your booking and the summary is below.`,
        detailRows: bookingRows,
        footerNote: 'If you do not recognise this booking or need to change anything, please contact Hasmmat Residence directly.',
      }),
      text: guestText,
      replyTo: hostEmail,
    }),
    sendEmail({
      to: hostEmail,
      subject: `New Booking Received – ${details.guestName}`,
      html: brandedEmailShell({
        eyebrow: 'Host notification',
        heading: 'New booking received',
        body: 'A guest has submitted a booking through the Hasmmat Residence website. The details are below.',
        detailRows: hostRows,
        footerNote: 'Follow up with the guest if any verification, deposit, or arrival details are required.',
      }),
      text: hostText,
      replyTo: details.guestEmail,
    }),
  ]);
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
