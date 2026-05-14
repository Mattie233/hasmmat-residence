type BookingOptions = {
  nights: number;
  guests: number;
  baseNightly: number;
  cleaningFee: number;
  extraGuestFee: number;
  discountThreshold: number;
  discountRate: number;
  nonRefundable?: boolean;
};

export function calculateBookingPrice({
  nights,
  guests,
  baseNightly,
  cleaningFee,
  extraGuestFee,
  discountThreshold,
  discountRate,
  nonRefundable = false
}: BookingOptions) {
  const nightsCost = baseNightly * nights;
  const extraGuestCost = guests > 4 ? (guests - 4) * extraGuestFee : 0;
  const subtotal = nightsCost + cleaningFee + extraGuestCost;
  const longStayDiscount = nights >= discountThreshold ? Math.round(subtotal * discountRate) : 0;
  const nonRefundableFee = nonRefundable ? Math.round(subtotal * 0.05) : 0;
  return subtotal - longStayDiscount + nonRefundableFee;
}
