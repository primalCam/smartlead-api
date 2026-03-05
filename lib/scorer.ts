import { LeadInput, LeadScore } from '../types';
import {
  URGENCY_PATTERNS,
  VALUE_INDICATORS,
  JUNK_PATTERNS,
  INTENT_PATTERNS,
  SOURCE_QUALITY,
  INDUSTRY_BOOSTERS
} from './patterns';

export function scoreLead(lead: LeadInput): LeadScore {
  const message = lead.message.toLowerCase();
  const name = lead.name.toLowerCase();
  const combinedText = `${name} ${message} ${lead.email || ''} ${lead.company || ''}`.toLowerCase();

  let score = 50;
  const reasons: string[] = [];
  const tags: string[] = [];

  // ── Junk detection ──────────────────────────────────────────
  const isJunk = JUNK_PATTERNS.some(p => p.test(combinedText));
  if (isJunk || message.trim().length < 5) {
    return {
      score: 0,
      tier: 'junk',
      confidence: 0.95,
      estimatedValue: 'unknown',
      recommendedAction: 'disqualify',
      reasons: ['Detected as spam or test submission'],
      tags: ['junk', 'auto_rejected'],
      followUpTiming: 'none'
    };
  }

  // ── Fake/low-quality name detection ─────────────────────────
  if (/^[a-z]{1,3}$/.test(name) || /asdf|test|fake|unknown/i.test(name)) {
    score -= 15;
    tags.push('suspicious_name');
  }

  // ── Fake phone detection ─────────────────────────────────────
  if (lead.phone) {
    const digits = lead.phone.replace(/\D/g, '');
    const isFakePhone = /^(\d)\1{6,}$/.test(digits) || // 1111111111
      /^1234567890$/.test(digits) ||
      /^0{7,}/.test(digits);
    if (isFakePhone) {
      score -= 20;
      tags.push('suspicious_phone');
    }
  }

  // ── Disposable email detection ───────────────────────────────
  const disposableDomains = [
    'mailinator', 'tempmail', 'guerrillamail', 'throwaway',
    'fakeinbox', 'yopmail', 'sharklasers', 'trashmail'
  ];
  if (lead.email && disposableDomains.some(d => lead.email!.includes(d))) {
    score -= 20;
    tags.push('disposable_email');
  }

  // ── ALL CAPS urgency boost ───────────────────────────────────
  const capsWords = (lead.message.match(/\b[A-Z]{3,}\b/g) || []).length;
  if (capsWords >= 3) {
    score += 5;
    tags.push('high_emotion');
  }

  // ── Urgency scoring ──────────────────────────────────────────
  let urgencyScore = 0;
  let urgencyLevel: 'emergency' | 'asap' | 'planning' | 'standard' = 'standard';

  if (URGENCY_PATTERNS.emergency.some(p => p.test(message))) {
    urgencyScore = 30;
    urgencyLevel = 'emergency';
    reasons.push('Emergency or urgent language detected');
    tags.push('emergency', 'hot_lead');
  } else if (URGENCY_PATTERNS.asap.some(p => p.test(message))) {
    urgencyScore = 20;
    urgencyLevel = 'asap';
    reasons.push('Near-term timeline mentioned');
    tags.push('urgent');
  } else if (URGENCY_PATTERNS.planning.some(p => p.test(message))) {
    urgencyScore = 5;
    urgencyLevel = 'planning';
    reasons.push('Early planning stage');
    tags.push('nurture');
  } else {
    urgencyScore = 10;
  }
  score += urgencyScore;

  // ── Value scoring ────────────────────────────────────────────
  let valueScore = 0;
  let valueLevel: 'high' | 'medium' | 'low' | 'unknown' = 'unknown';

  if (VALUE_INDICATORS.high.some(p => p.test(combinedText))) {
    valueScore = 25;
    valueLevel = 'high';
    reasons.push('High-value project indicators');
    tags.push('high_value');
  } else if (VALUE_INDICATORS.medium.some(p => p.test(combinedText))) {
    valueScore = 15;
    valueLevel = 'medium';
    reasons.push('Standard project scope');
    tags.push('standard_value');
  } else if (VALUE_INDICATORS.low.some(p => p.test(combinedText))) {
    valueScore = 5;
    valueLevel = 'low';
    reasons.push('Small or exploratory inquiry');
    tags.push('low_value');
  } else {
    valueScore = 10;
    valueLevel = 'unknown';
  }
  score += valueScore;

  // ── Industry booster ─────────────────────────────────────────
  if (lead.industry && INDUSTRY_BOOSTERS[lead.industry.toLowerCase()]) {
    const boosters = INDUSTRY_BOOSTERS[lead.industry.toLowerCase()];
    if (boosters.some(p => p.test(combinedText))) {
      score += 10;
      reasons.push(`High-value ${lead.industry} signals detected`);
      tags.push(`${lead.industry}_premium`);
    }
  }

  // ── Intent scoring ───────────────────────────────────────────
  let intentScore = 0;
  if (INTENT_PATTERNS.readyToBuy.some(p => p.test(message))) {
    intentScore = 20;
    reasons.push('Strong buying intent signals');
    tags.push('ready_to_buy');
  } else if (INTENT_PATTERNS.shopping.some(p => p.test(message))) {
    intentScore = 10;
    reasons.push('Comparison shopping');
    tags.push('price_shopper');
  } else if (INTENT_PATTERNS.tireKicker.some(p => p.test(message))) {
    intentScore = 0;
    reasons.push('Early research, low commitment');
    tags.push('tire_kicker');
  } else {
    intentScore = 10;
  }
  score += intentScore;

  // ── Source quality ───────────────────────────────────────────
  const sourceKey = lead.source?.toLowerCase() || 'unknown';
  const sourceMultiplier = SOURCE_QUALITY[sourceKey] ?? 0.5;
  const sourceScore = Math.round(15 * sourceMultiplier);
  score += sourceScore;
  if (sourceMultiplier >= 0.9) {
    reasons.push(`High-intent source: ${lead.source}`);
    tags.push('quality_source');
  }

  // ── Contact completeness ─────────────────────────────────────
  let completenessScore = 0;
  if (lead.phone && lead.phone.replace(/\D/g, '').length >= 10) {
    completenessScore += 5;
    tags.push('has_phone');
  }
  if (lead.email && lead.email.includes('@')) {
    completenessScore += 3;
    tags.push('has_email');
  }
  if (lead.company && lead.company.trim().length > 1) {
    completenessScore += 3;
    tags.push('has_company');
  }
  if (lead.budget) {
    completenessScore += 4;
    tags.push('stated_budget');
  }
  score += completenessScore;

  // ── Message quality ──────────────────────────────────────────
  const wordCount = message.split(/\s+/).filter(Boolean).length;
  if (wordCount > 50) {
    score += 5;
    reasons.push('Detailed message — serious intent');
    tags.push('detailed_inquiry');
  } else if (wordCount < 10) {
    score -= 10;
    reasons.push('Very short message');
    tags.push('low_effort');
  }

  // ── Clamp score ──────────────────────────────────────────────
  score = Math.max(0, Math.min(100, score));

  // ── Tier + action assignment ─────────────────────────────────
  let tier: LeadScore['tier'];
  let action: LeadScore['recommendedAction'];
  let timing: LeadScore['followUpTiming'];

  if (score >= 80) {
    tier = 'hot';
    action = 'call_now';
    timing = 'immediate';
    reasons.push('HOT LEAD — contact within 5 minutes');
  } else if (score >= 65) {
    tier = 'warm';
    action = urgencyLevel === 'emergency' ? 'call_now' : 'call_today';
    timing = urgencyLevel === 'emergency' ? 'immediate' : 'within_1h';
    reasons.push('WARM LEAD — priority follow-up today');
  } else if (score >= 40) {
    tier = 'warm';
    action = 'email_sequence';
    timing = 'within_24h';
    reasons.push('NURTURE — add to email sequence');
  } else if (score >= 20) {
    tier = 'cold';
    action = 'nurture';
    timing = 'within_72h';
    reasons.push('COLD — long-term nurture');
  } else {
    tier = 'junk';
    action = 'disqualify';
    timing = 'none';
    reasons.push('Low quality — disqualify');
  }

  // Emergency override
  if (urgencyLevel === 'emergency' && tier !== 'hot') {
    tier = 'hot';
    action = 'call_now';
    timing = 'immediate';
    score = Math.max(score, 75);
  }

  return {
    score,
    tier,
    confidence: calculateConfidence(lead, wordCount),
    estimatedValue: valueLevel,
    recommendedAction: action,
    reasons,
    tags: [...new Set(tags)],
    followUpTiming: timing
  };
}

function calculateConfidence(lead: LeadInput, wordCount: number): number {
  let confidence = 0.65;
  if (lead.phone && lead.email) confidence += 0.1;
  if (lead.company) confidence += 0.05;
  if (lead.budget) confidence += 0.05;
  if (wordCount > 20) confidence += 0.1;
  if (lead.source && lead.source !== 'unknown') confidence += 0.05;
  return Math.min(0.98, confidence);
}
