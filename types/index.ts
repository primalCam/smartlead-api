export interface LeadInput {
  name: string;
  phone?: string;
  email?: string;
  message: string;
  source?: string;
  propertyType?: 'residential' | 'commercial' | 'unknown';
  urgency?: 'emergency' | 'asap' | 'planning' | 'unknown';
}

export interface LeadScore {
  score: number;
  tier: 'hot' | 'warm' | 'cold' | 'junk';
  confidence: number;
  estimatedValue: 'high' | 'medium' | 'low' | 'unknown';
  recommendedAction: 'call_now' | 'call_today' | 'email_sequence' | 'nurture' | 'disqualify';
  reasons: string[];
  tags: string[];
  followUpTiming: 'immediate' | 'within_1h' | 'within_24h' | 'within_72h' | 'none';
}

export interface ApiResponse {
  success: boolean;
  data?: LeadScore;
  error?: string;
  requestId: string;
  processedAt: string;
}
