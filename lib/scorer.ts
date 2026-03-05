import { LeadInput, LeadScore } from '../types';
import {
  URGENCY_PATTERNS,
  VALUE_INDICATORS,
  JUNK_PATTERNS,
  INTENT_PATTERNS,
  SOURCE_QUALITY
} from './patterns';

export function scoreLead(lead: LeadInput): LeadScore {
  const message = lead.message.toLowerCase();
  const name = lead.name.toLowerCase();
  const combinedText = `${name} ${message} ${lead.email || ''}`.toLowerCase();
  
  let score = 50;
  const reasons: string[] = [];
  const tags: string[] = [];

  const isJunk = JUNK_PATTERNS.some(pattern => pattern.test(combinedText));
  if (isJunk || message.length < 5) {
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

  let urgencyScore = 0;
  let urgencyLevel: keyof typeof URGENCY_PATTERNS = 'planning';
  
  if (URGENCY_PATTERNS.emergency.some(p => p.test(message))) {
    urgencyScore = 30;
    urgencyLevel = 'emergency';
    reasons.push('Emergency language detected');
    tags.push('emergency', 'hot_lead');
  } else if (URGENCY_PATTERNS.asap.some(p => p.test(message))) {
    urgencyScore = 20;
    urgencyLevel = 'asap';
    reasons.push('Urgent timeline mentioned');
    tags.push('urgent');
  } else if (URGENCY_PATTERNS.planning.some(p => p.test(message))) {
    urgencyScore = 5;
    reasons.push('Long-term planning stage');
    tags.push('nurture');
  } else {
    urgencyScore = 10;
  }
  score += urgencyScore;

  let valueScore = 0;
  let valueLevel: 'high' | 'medium' | 'low' | 'unknown' = 'unknown';
  
  if (VALUE_INDICATORS.high.some(p => p.test(message))) {
    valueScore = 25;
    valueLevel = 'high';
    reasons.push('High-value indicators present');
    tags.push('high_value', 'commercial_potential');
  } else if (VALUE_INDICATORS.medium.some(p => p.test(message))) {
    valueScore = 15;
    valueLevel = 'medium';
    reasons.push('Standard residential project');
    tags.push('residential');
  } else if (VALUE_INDICATORS.low.some(p => p.test(message))) {
    valueScore = 5;
    valueLevel = 'low';
    reasons.push('Minor repair or maintenance');
    tags.push('small_job');
  } else {
    valueScore = 10;
    valueLevel = 'unknown';
  }
  score += valueScore;

  let intentScore = 0;
  if (INTENT_PATTERNS.readyToBuy.some(p => p.test(message))) {
    intentScore = 20;
    reasons.push('Ready to schedule');
    tags.push('ready_to_buy');
  } else if (INTENT_PATTERNS.shopping.some(p => p.test(message))) {
    intentScore = 10;
    reasons.push('Comparison shopping');
    tags.push('price_shopper');
  } else if (INTENT_PATTERNS.tireKicker.some(p => p.test(message))) {
    intentScore = 0;
    reasons.push('Early research phase');
    tags.push('tire_kicker');
  } else {
    intentScore = 10;
  }
  score += intentScore;

  const sourceMultiplier = SOURCE_QUALITY[lead.source?.toLowerCase() || 'unknown'] || 0.5;
  const sourceScore = Math.round(15 * sourceMultiplier);
  score += sourceScore;
  
  if (sourceMultiplier >= 0.9) {
    reasons.push(`High-quality source: ${lead.source}`);
    tags.push('quality_source');
  }

  let completenessScore = 0;
  if (lead.phone && lead.phone.length >= 10) {
    completenessScore += 5;
    tags.push('has_phone');
  }
  if (lead.email && lead.email.includes('@')) {
    completenessScore += 3;
    tags.push('has_email');
  }
  if (lead.propertyType && lead.propertyType !== 'unknown') {
    completenessScore += 2;
  }
  score += completenessScore;

  const wordCount = message.split(/\s+/).length;
  if (wordCount > 50) {
    score += 5;
    reasons.push('Detailed message indicates serious intent');
    tags.push('detailed_inquiry');
  } else if (wordCount < 10) {
    score -= 10;
    reasons.push('Very short message');
    tags.push('low_effort');
  }

  score = Math.max(0, Math.min(100, score));

  let tier: LeadScore['tier'];
  let action: LeadScore['recommendedAction'];
  let timing: LeadScore['followUpTiming'];

  if (score >= 80) {
    tier = 'hot';
    action = 'call_now';
    timing = 'immediate';
    reasons.push('HOT LEAD: Call within 5 minutes');
  } else if (score >= 60) {
    tier = 'warm';
    action = urgencyLevel === 'emergency' ? 'call_now' : 'call_today';
    timing = urgencyLevel === 'emergency' ? 'immediate' : 'within_1h';
    reasons.push('WARM LEAD: Priority follow-up today');
  } else if (score >= 40) {
    tier = 'warm';
    action = 'email_sequence';
    timing = 'within_24h';
    reasons.push('NURTURE: Add to email sequence');
  } else if (score >= 20) {
    tier = 'cold';
    action = 'nurture';
    timing = 'within_72h';
    reasons.push('COLD: Long-term nurture');
  } else {
    tier = 'junk';
    action = 'disqualify';
    timing = 'none';
    reasons.push('Low quality');
  }

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
  let confidence = 0.7;
  
  if (lead.phone && lead.email) confidence += 0.1;
  if (wordCount > 20) confidence += 0.1;
  if (lead.source && lead.source !== 'unknown') confidence += 0.05;
  if (lead.propertyType && lead.propertyType !== 'unknown') confidence += 0.05;
  
  return Math.min(0.98, confidence);
}
