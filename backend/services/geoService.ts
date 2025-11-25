import geoip from 'geoip-lite';

export interface PricingInfo {
    country: string;
    currency: string;
    multiplier: number;
}

export function getLocationFromIP(ip: string): PricingInfo {
    // Handle localhost and private IPs
    if (ip === '::1' || ip === '127.0.0.1' || ip === 'localhost' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
        // Default to India for local development
        return {
            country: 'IN',
            currency: '₹',
            multiplier: 1
        };
    }

    const geo = geoip.lookup(ip);

    if (!geo || !geo.country) {
        // Default to India if location cannot be determined
        return {
            country: 'IN',
            currency: '₹',
            multiplier: 1
        };
    }

    // India gets INR pricing at 1x
    if (geo.country === 'IN') {
        return {
            country: 'IN',
            currency: '₹',
            multiplier: 1
        };
    }

    // All other countries get 2x pricing in USD
    return {
        country: geo.country,
        currency: '$',
        multiplier: 2
    };
}

export function applyPricing(basePrice: number, pricingInfo: PricingInfo): { price: number; currency: string; country: string } {
    return {
        price: Math.round(basePrice * pricingInfo.multiplier),
        currency: pricingInfo.currency,
        country: pricingInfo.country
    };
}
