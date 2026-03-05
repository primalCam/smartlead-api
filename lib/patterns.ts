export const URGENCY_PATTERNS = {
  emergency: [
    /leak/i, /leaking/i, /water damage/i, /flood/i, /storm damage/i,
    /tree fell/i, /hole/i, /collapsed/i, /urgent/i, /emergency/i,
    /asap/i, /today/i, /now/i, /tonight/i, /raining inside/i,
    /ceiling.*wet/i, /bucket/i, /dripping/i, /active leak/i
  ],
  asap: [
    /this week/i, /next week/i, /soon/i, /quickly/i, /fast/i,
    /quote.*soon/i, /estimate.*needed/i, /roof.*bad/i, /shingles.*gone/i,
    /missing shingles/i, /damage/i, /inspection/i, /before winter/i,
    /selling house/i, /closing/i, /refinance/i
  ],
  planning: [
    /next year/i, /spring/i, /summer/i, /planning/i, /research/i,
    /comparison/i, /shopping around/i, /multiple quotes/i, /future/i,
    /not urgent/i, /just looking/i, /curious/i
  ]
};

export const VALUE_INDICATORS = {
  high: [
    /commercial/i, /apartment/i, /building/i, /complex/i, /property manager/i,
    /hoa/i, /office/i, /warehouse/i, /retail/i, /restaurant/i,
    /new roof/i, /full replacement/i, /entire roof/i, /square foot/i,
    /sq ft/i, /square feet/i, /large home/i, /big house/i, /mansion/i,
    /insurance claim/i, /insurance.*cover/i, /storm damage/i, /hail/i
  ],
  medium: [
    /repair/i, /section/i, /partial/i, /patch/i, /fix/i,
    /residential/i, /house/i, /home/i, /townhouse/i, /duplex/i,
    /shingles/i, /metal roof/i, /flat roof/i, /tile/i
  ],
  low: [
    /gutter/i, /cleaning/i, /maintenance/i, /inspection only/i,
    /checkup/i, /small repair/i, /minor/i, /quote only/i,
    /how much/i, /ballpark/i, /rough estimate/i
  ]
};

export const JUNK_PATTERNS = [
  /seo/i, /marketing/i, /google ranking/i, /website/i, /promote/i,
  /\@gmail\.com.*test/i, /test\@/i, /fake/i, /asdf/i, /12345/i,
  /^\s*hi\s*$/i, /^\s*hello\s*$/i, /no message/i, /spam/i,
  /credit card/i, /loan/i, /financing.*offer/i, /warranty.*extend/i
];

export const INTENT_PATTERNS = {
  readyToBuy: [
    /schedule/i, /appointment/i, /come out/i, /look at/i, /inspect/i,
    /start/i, /begin/i, /move forward/i, /proceed/i, /ready/i,
    /when can you/i, /available/i, /this week/i, /tomorrow/i
  ],
  shopping: [
    /compare/i, /other quotes/i, /competitor/i, /price match/i,
    /cheaper/i, /lowest price/i, /discount/i, /deal/i, /offer/i
  ],
  tireKicker: [
    /just checking/i, /curious/i, /ballpark/i, /rough idea/i,
    /how much.*cost/i, /price range/i, /expensive/i, /too much/i
  ]
};

export const SOURCE_QUALITY: Record<string, number> = {
  'referral': 1.0,
  'google_ads': 0.9,
  'organic': 0.85,
  'angi': 0.75,
  'homeadvisor': 0.6,
  'facebook': 0.5,
  'craigslist': 0.3,
  'unknown': 0.5
};
