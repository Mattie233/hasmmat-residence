CREATE TYPE "PaidBookingSyncStatus" AS ENUM ('PROCESSING', 'SYNCED', 'FAILED');

CREATE TABLE "PaidBooking" (
    "id" TEXT NOT NULL,
    "stripeSessionId" TEXT NOT NULL,
    "stripePaymentIntentId" TEXT,
    "smoobuReservationId" INTEGER,
    "apartmentId" INTEGER NOT NULL,
    "guestName" TEXT NOT NULL,
    "guestEmail" TEXT NOT NULL,
    "guestPhone" TEXT NOT NULL,
    "guestAddress" TEXT NOT NULL,
    "specialRequests" TEXT NOT NULL,
    "checkIn" TIMESTAMP(3) NOT NULL,
    "checkOut" TIMESTAMP(3) NOT NULL,
    "guests" INTEGER NOT NULL,
    "totalPaid" INTEGER NOT NULL,
    "bookingType" TEXT NOT NULL,
    "nights" INTEGER NOT NULL,
    "rate" TEXT NOT NULL,
    "syncStatus" "PaidBookingSyncStatus" NOT NULL DEFAULT 'PROCESSING',
    "syncError" TEXT,
    "confirmationSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaidBooking_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PaidBooking_stripeSessionId_key" ON "PaidBooking"("stripeSessionId");
CREATE UNIQUE INDEX "PaidBooking_stripePaymentIntentId_key" ON "PaidBooking"("stripePaymentIntentId");
CREATE UNIQUE INDEX "PaidBooking_smoobuReservationId_key" ON "PaidBooking"("smoobuReservationId");
