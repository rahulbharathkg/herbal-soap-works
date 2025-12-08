"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocationFromIP = getLocationFromIP;
exports.applyPricing = applyPricing;
const geoip_lite_1 = __importDefault(require("geoip-lite"));
function getLocationFromIP(ip) {
    // Handle localhost and private IPs
    if (ip === '::1' || ip === '127.0.0.1' || ip === 'localhost' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
        // Default to India for local development
        return {
            country: 'IN',
            currency: '₹',
            multiplier: 1
        };
    }
    const geo = geoip_lite_1.default.lookup(ip);
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
function applyPricing(basePrice, pricingInfo) {
    return {
        price: Math.round(basePrice * pricingInfo.multiplier),
        currency: pricingInfo.currency,
        country: pricingInfo.country
    };
}
