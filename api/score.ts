import type { VercelRequest, VercelResponse } from '@vercel/node';
import { LeadInput, ApiResponse } from '../types';
import { scoreLead } from '../lib/scorer';

const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 100;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - (60 * 60 * 1000);
  
  const record = requestCounts.get(ip);
  if (!record || record.resetTime < windowStart) {
    requestCounts.set(ip, { count: 1, resetTime: now + 60 * 60 * 1000 });
    return true;
  }
  
  if (record.count >= RATE_LIMIT) return false;
  
  record.count++;
  return true;
}

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  const requestId = generateRequestId();
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 'unknown';
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    const response: ApiResponse = {
      success: false,
      error: 'Method not allowed. Use POST.',
      requestId,
      processedAt: new Date().toISOString()
    };
    return res.status(405).json(response);
  }

  if (!checkRateLimit(clientIp)) {
    const response: ApiResponse = {
      success: false,
      error: 'Rate limit exceeded. 100 requests per hour.',
      requestId,
      processedAt: new Date().toISOString()
    };
    return res.status(429).json(response);
  }

  try {
    const body = req.body as LeadInput;
    
    if (!body.name || !body.message) {
      const response: ApiResponse = {
        success: false,
        error: 'Missing required fields: name and message',
        requestId,
        processedAt: new Date().toISOString()
      };
      return res.status(400).json(response);
    }

    const result = scoreLead(body);
    
    const response: ApiResponse = {
      success: true,
      data: result,
      requestId,
      processedAt: new Date().toISOString()
    };

    res.status(200).json(response);
    
  } catch (error) {
    const response: ApiResponse = {
      success: false,
      error: 'Internal processing error',
      requestId,
      processedAt: new Date().toISOString()
    };
    res.status(500).json(response);
  }
}
