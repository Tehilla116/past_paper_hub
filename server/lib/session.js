import crypto from 'crypto';

const COOKIE_NAME = 'past_paper_session';

function getSessionSecret() {
  return process.env.SESSION_SECRET || 'past-paper-hub-secret-key-change-in-production';
}

function base64UrlEncode(value) {
  return Buffer.from(value).toString('base64url');
}

function base64UrlDecode(value) {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function sign(value) {
  return crypto.createHmac('sha256', getSessionSecret()).update(value).digest('base64url');
}

function parseCookieHeader(cookieHeader = '') {
  return cookieHeader.split(';').reduce((accumulator, part) => {
    const [rawName, ...rest] = part.trim().split('=');
    if (!rawName) return accumulator;
    accumulator[rawName] = decodeURIComponent(rest.join('='));
    return accumulator;
  }, {});
}

export function createSessionToken(payload) {
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  return `${encodedPayload}.${sign(encodedPayload)}`;
}

export function readSessionToken(cookieHeader) {
  const cookies = parseCookieHeader(cookieHeader);
  const token = cookies[COOKIE_NAME];
  if (!token) return null;

  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature) return null;

  const expectedSignature = sign(encodedPayload);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (signatureBuffer.length !== expectedBuffer.length) {
    return null;
  }
  if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) {
    return null;
  }

  try {
    return JSON.parse(base64UrlDecode(encodedPayload));
  } catch {
    return null;
  }
}

export function getAuthCookieOptions() {
  const production = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: false,
    sameSite: production ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000,
    path: '/',
  };
}

export function getAuthCookieName() {
  return COOKIE_NAME;
}