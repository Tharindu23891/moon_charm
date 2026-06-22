// Emails that are always treated as admins, no matter how they sign in
// (credentials form or Google) or what role is stored in the database. This is
// the single source of truth for "who is an owner/admin". Add more without
// touching code via the ADMIN_EMAILS env var (comma-separated).

const BUILT_IN_ADMIN_EMAILS = [
  'tdissanayaka2002@gmail.com',
  'themooncharm26@gmail.com',
];

const envAdminEmails = (process.env.ADMIN_EMAILS ?? '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

const ADMIN_EMAILS = new Set<string>([
  ...BUILT_IN_ADMIN_EMAILS.map((e) => e.toLowerCase()),
  ...envAdminEmails,
]);

/** True if this email should always have the admin role. Case-insensitive. */
export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.has(email.toLowerCase());
}
