export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zammel.store';
  const content = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${siteUrl.replace(/\/$/, '')}/sitemap.xml`,
  ].join('\n');

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}