import { cancellationPolicy, getFormattedPropertyAddress, siteInfo } from '@/lib/data';
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

export type DirectEnquiryDetails = {
  name: string;
  email: string;
  phone: string;
  guests: string;
  dates: string;
  message: string;
  submittedAt: string;
};

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

export async function sendEnquiryEmails(details: DirectEnquiryDetails) {
  const hostEmail = process.env.BOOKING_NOTIFICATION_EMAIL;

  if (!hostEmail) {
    throw new Error('Missing BOOKING_NOTIFICATION_EMAIL.');
  }

  const submittedAt = formatSubmittedAt(details.submittedAt);
  const guestRows: Array<[string, string]> = [
    ['Guest name', details.name],
    ['Preferred dates', details.dates],
    ['Number of guests', details.guests],
    ['Enquiry message', details.message],
  ];
  const hostRows: Array<[string, string]> = [
    ['Guest name', details.name],
    ['Guest email', details.email],
    ['Guest phone', details.phone],
    ['Guests', details.guests],
    ['Preferred dates', details.dates],
    ['Full enquiry message', details.message],
    ['Submitted', submittedAt],
  ];

  const guestText = [
    `Hi ${details.name},`,
    '',
    `Thank you for contacting ${siteInfo.name}. We have received your enquiry and will respond as soon as possible.`,
    '',
    textRows(guestRows),
    '',
    `${siteInfo.name}`,
    siteInfo.email,
    siteInfo.phone,
  ].join('\n');
  const hostText = ['New direct enquiry received.', '', textRows(hostRows)].join('\n');

  await Promise.all([
    sendEmail({
      to: details.email,
      subject: 'Thank you for contacting Hasmmat Residence',
      html: brandedEmailShell({
        eyebrow: 'Direct enquiry',
        heading: 'We have received your enquiry',
        body: `Thank you for contacting ${siteInfo.name}. We have received your enquiry and will respond as soon as possible.`,
        detailRows: guestRows,
        footerNote: 'We will review your preferred dates and reply with availability, pricing, and the next steps.',
      }),
      text: guestText,
      replyTo: hostEmail,
    }),
    sendEmail({
      to: hostEmail,
      subject: `New Direct Enquiry – ${details.name}`,
      html: brandedEmailShell({
        eyebrow: 'Direct enquiry',
        heading: 'New direct enquiry received',
        body: 'A guest has submitted the direct enquiry form on the Hasmmat Residence website.',
        detailRows: hostRows,
        footerNote: 'Reply to the guest with availability, pricing, and any booking requirements.',
      }),
      text: hostText,
      replyTo: details.email,
    }),
  ]);
}

export async function sendPaidBookingEmails(details: PaidBookingDetails) {
  const ownerEmail = process.env.BOOKING_NOTIFICATION_EMAIL || siteInfo.email;
  const policyTitle = details.bookingType.toLowerCase().includes('non-refundable')
    ? 'Non-refundable bookings'
    : 'Refundable bookings';
  const policy = cancellationPolicy.find((item) => item.title === policyTitle);
  const cancellationTerms = policy
    ? `${policy.title}: ${policy.points.join('; ')}.`
    : 'Please contact Hasmmat Residence for the cancellation terms that apply to this booking.';
  const bookingRows: Array<[string, string]> = [
    ['Lead guest', details.guestName],
    ['Check-in date', details.checkIn],
    ['Check-in time', '3:00 PM'],
    ['Check-out date', details.checkOut],
    ['Check-out time', '10:00 AM'],
    ['Guests', details.guests],
    ['Nights', details.nights],
    ['Booking type', details.bookingType],
    ['Total paid', details.quotedTotal],
    ['Rate', details.rate],
    ['Property address', getFormattedPropertyAddress()],
    ['Cancellation terms', cancellationTerms],
  ];
  const guestRows: Array<[string, string]> = [
    ['Email', details.guestEmail],
    ['Phone', details.guestPhone],
    ['Address', details.guestAddress],
    ['Stay notes', details.specialRequests],
    ['Stripe payment', details.paymentId],
  ];

  const guestText = [
    `Hi ${details.guestName},`,
    '',
    `Thank you for booking directly with ${siteInfo.name}. Your payment has been successfully received and your reservation has been created.`,
    '',
    textRows(bookingRows),
    '',
    'This is your paid direct-booking confirmation. We will send final access instructions before check-in.',
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
      subject: `Payment received – ${siteInfo.name} booking`,
      html: emailShell(
        `Payment received – booking confirmed for ${details.guestName}`,
        `Thank you for booking directly with ${siteInfo.name}. Your payment has been successfully received and your reservation has been created. This is a paid direct booking, not an enquiry.`,
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
