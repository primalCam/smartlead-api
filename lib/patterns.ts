// ============================================================
// UNIVERSAL LEAD SCORING PATTERNS
// Works for any service business: home services, legal, medical,
// real estate, financial, automotive, beauty, fitness, and more.
// ============================================================

export const URGENCY_PATTERNS = {
  emergency: [
    // Universal emergency language
    /urgent/i, /emergency/i, /asap/i, /right away/i, /immediately/i,
    /today/i, /tonight/i, /now/i, /crisis/i, /critical/i,
    // Home services
    /leak/i, /leaking/i, /flood/i, /no heat/i, /no ac/i, /no power/i,
    /burst pipe/i, /water damage/i, /collapsed/i, /fire damage/i,
    /raining inside/i, /ceiling.*wet/i, /dripping/i,
    // Legal
    /arrested/i, /court date/i, /lawsuit/i, /served/i, /eviction/i,
    /custody hearing/i, /statute of limitations/i, /accident.*today/i,
    // Medical
    /pain/i, /severe/i, /bleeding/i, /infection/i, /swollen/i,
    /can't wait/i, /unbearable/i,
    // Business
    /contract expires/i, /deadline/i, /losing money/i, /going under/i,
    /closing soon/i, /shutting down/i,
    // Real estate
    /closing.*tomorrow/i, /closing.*this week/i, /losing the house/i,
    /foreclosure/i, /evicted/i
  ],
  asap: [
    /this week/i, /next week/i, /soon/i, /quickly/i, /fast/i,
    /before.*weekend/i, /by.*friday/i, /by.*monday/i,
    /need.*estimate/i, /need.*quote/i, /need.*appointment/i,
    /damage/i, /broken/i, /not working/i, /stopped working/i,
    /selling.*house/i, /closing/i, /refinance/i,
    /interview/i, /meeting/i, /presentation/i,
    /appointment.*soon/i, /schedule.*soon/i,
    /before winter/i, /before summer/i, /before.*season/i
  ],
  planning: [
    /next year/i, /next month/i, /spring/i, /summer/i, /fall/i, /winter/i,
    /planning/i, /research/i, /comparing/i, /shopping around/i,
    /multiple quotes/i, /future/i, /not urgent/i, /just looking/i,
    /curious/i, /eventually/i, /someday/i, /when.*ready/i
  ]
};

export const VALUE_INDICATORS = {
  high: [
    // Business/commercial
    /commercial/i, /business/i, /company/i, /corporate/i, /enterprise/i,
    /multiple locations/i, /franchise/i, /fleet/i, /bulk/i, /wholesale/i,
    /property manager/i, /hoa/i, /office/i, /warehouse/i, /retail/i,
    /apartment complex/i, /building/i,
    // High-value residential
    /full replacement/i, /complete.*overhaul/i, /entire/i, /whole/i,
    /renovation/i, /remodel/i, /new construction/i, /custom/i,
    /luxury/i, /high.?end/i, /premium/i, /estate/i, /mansion/i,
    // Insurance/legal/financial signals
    /insurance claim/i, /settlement/i, /lawsuit/i, /injury/i,
    /malpractice/i, /class action/i, /wrongful/i,
    /investment property/i, /portfolio/i, /multiple properties/i,
    // Large purchases
    /large order/i, /big project/i, /major/i, /significant/i,
    /budget.*\$[5-9]\d{3}/i, /budget.*\$[1-9]\d{4}/i,
    /\$[5-9],\d{3}/i, /\$[1-9]\d,\d{3}/i
  ],
  medium: [
    /repair/i, /fix/i, /replace/i, /install/i, /service/i,
    /residential/i, /house/i, /home/i, /apartment/i, /condo/i,
    /standard/i, /typical/i, /regular/i, /routine/i,
    /personal/i, /individual/i, /family/i,
    /small business/i, /startup/i, /solo/i, /freelance/i
  ],
  low: [
    /cleaning/i, /maintenance/i, /inspection only/i, /checkup/i,
    /minor/i, /small/i, /quick/i, /simple/i, /basic/i,
    /cheap/i, /affordable/i, /budget/i, /inexpensive/i,
    /just a quote/i, /ballpark/i, /rough estimate/i, /how much/i,
    /diy/i, /do it myself/i, /help me understand/i
  ]
};

export const INTENT_PATTERNS = {
  readyToBuy: [
    /ready to.*start/i, /ready to.*book/i, /ready to.*hire/i,
    /let's.*go/i, /move forward/i, /proceed/i, /sign.*contract/i,
    /schedule.*appointment/i, /book.*appointment/i, /come out/i,
    /when.*available/i, /when can you/i, /next.*opening/i,
    /take.*credit card/i, /payment plan/i, /financing/i,
    /already.*decided/i, /chosen.*you/i, /going.*with.*you/i,
    /start.*monday/i, /start.*this week/i, /start.*asap/i
  ],
  shopping: [
    /compare/i, /comparison/i, /other quotes/i, /other companies/i,
    /competitor/i, /price match/i, /beat.*price/i,
    /cheaper/i, /lowest price/i, /best price/i, /discount/i,
    /deal/i, /coupon/i, /promo/i, /offer/i, /special/i,
    /getting.*estimates/i, /shopping around/i, /few options/i
  ],
  tireKicker: [
    /just checking/i, /just curious/i, /just wondering/i,
    /ballpark/i, /rough idea/i, /general idea/i,
    /how much.*cost/i, /price range/i, /too expensive/i,
    /can't afford/i, /might not/i, /not sure if/i,
    /my friend said/i, /heard it costs/i, /is it worth/i
  ]
};

export const JUNK_PATTERNS = [
  // Spam/marketing
  /seo/i, /marketing.*service/i, /google ranking/i, /promote your/i,
  /increase.*traffic/i, /more.*customers.*guaranteed/i,
  /make money online/i, /work from home.*\$/i,
  // Test submissions
  /test@/i, /fake/i, /asdf/i, /qwerty/i, /123456/i,
  /^hi\s*$/i, /^hello\s*$/i, /^test\s*$/i, /no message/i,
  /lorem ipsum/i, /sample text/i, /placeholder/i,
  // Scams
  /wire transfer/i, /western union/i, /gift card/i, /bitcoin.*pay/i,
  /nigerian/i, /inheritance/i, /won.*lottery/i,
  // Solicitation
  /we offer/i, /our company provides/i, /i am.*vendor/i,
  /partner.*with.*us/i, /white label/i
];

export const SOURCE_QUALITY: Record<string, number> = {
  // Highest intent
  'referral': 1.0,
  'word_of_mouth': 1.0,
  'repeat_customer': 1.0,
  // High intent paid
  'google_ads': 0.9,
  'bing_ads': 0.85,
  'google_local': 0.9,
  // Organic
  'organic': 0.85,
  'seo': 0.8,
  'blog': 0.75,
  // Marketplaces
  'angi': 0.75,
  'thumbtack': 0.7,
  'homeadvisor': 0.65,
  'yelp': 0.7,
  'bark': 0.65,
  // Social
  'facebook': 0.55,
  'instagram': 0.5,
  'tiktok': 0.4,
  'twitter': 0.4,
  // Low quality
  'craigslist': 0.3,
  'unknown': 0.5
};

// Industry-specific value boosters (optional field)
export const INDUSTRY_BOOSTERS: Record<string, RegExp[]> = {
  legal: [/injury/i, /accident/i, /settlement/i, /sue/i, /malpractice/i],
  medical: [/surgery/i, /implant/i, /procedure/i, /treatment/i, /cosmetic/i],
  realestate: [/cash buyer/i, /pre.?approved/i, /investor/i, /no contingency/i],
  homeservices: [/new construction/i, /full replacement/i, /insurance/i, /permit/i],
  financial: [/portfolio/i, /rollover/i, /inheritance/i, /business.*sale/i],
  automotive: [/fleet/i, /multiple vehicles/i, /lease/i, /purchase.*outright/i]
};
