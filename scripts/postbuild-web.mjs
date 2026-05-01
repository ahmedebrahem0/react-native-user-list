import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const distHtmlPath = resolve(process.cwd(), 'dist', 'index.html');
const title = 'User List';
const description =
  'Browse, search, and sort users in a fast React Native web app built with Expo Router.';

const html = readFileSync(distHtmlPath, 'utf8');

const withTitle = html.includes('<title>')
  ? html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
  : html.replace('<head>', `<head>\n    <title>${title}</title>`);

const descriptionTag = `<meta name="description" content="${description}" />`;
const withDescription = withTitle.includes('name="description"')
  ? withTitle.replace(
      /<meta\s+name="description"\s+content=".*?"\s*\/?>/,
      descriptionTag
    )
  : withTitle.replace('<head>', `<head>\n    ${descriptionTag}`);

writeFileSync(distHtmlPath, withDescription);

console.log(`Updated SEO metadata in ${distHtmlPath}`);
