import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const publicDir = path.join(projectRoot, "public");
const sitemapPath = path.join(publicDir, "sitemap.xml");
const robotsPath = path.join(publicDir, "robots.txt");
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://pennrockequipment.com";

fs.mkdirSync(publicDir, { recursive: true });

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
  <url>
    <loc>${baseUrl}/sell</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
</urlset>
`;

const robotsTxt = `User-agent: *
Allow: /
Disallow: /studio/
Sitemap: ${baseUrl}/sitemap.xml
`;

fs.writeFileSync(sitemapPath, sitemapXml, "utf8");
fs.writeFileSync(robotsPath, robotsTxt, "utf8");
