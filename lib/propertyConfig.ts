import { PropertyPricingConfig } from '@/types';

export const PROPERTY_PRICING_CONFIGS: Record<string, PropertyPricingConfig> = {
  '3264062': {
    propertyId: 'hasmmat-residence',
    listingId: '3264062',
    name: 'Hasmmat Residence',
    cleaningFee: 60,
    includedGuests: 4,
    extraGuestFee: 20,
    fallbackNightlyRate: 220,
  },
};

export function getPropertyConfig(listingId: string): PropertyPricingConfig {
  return PROPERTY_PRICING_CONFIGS[listingId] || PROPERTY_PRICING_CONFIGS['3264062'];
}
