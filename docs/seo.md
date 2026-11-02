# SEO: what is automatic, and what only you can do

Nobody can guarantee a first-page ranking. Rankings depend on competition, links from other sites and time. What the code can do is make every page easy for every crawler to read. That is done and measured below.

## Automatic (every build)
- Every page is **prerendered** to its own HTML file (own title, description, canonical, Open Graph and Twitter tags, text and structured data), so crawlers that do not run JavaScript still see the content. `npm run build` also writes `sitemap.xml` and `search-index.json`.
- **Sitemap** comes from `src/routes.js` (the one list of pages). Last-modified dates come from `src/data/lastmod.json`, which is committed so hosts that clone shallowly still get real dates. After changing a page, run `npm run lastmod --prefix website-react` and commit the file.
- The build **warns** if a sitemap page is missing from `public/llms.txt` or has no date.
- `node scripts/audit-seo.mjs` (after a build) checks every page: title under 60 characters, description under 160, one H1, canonical, Open Graph and Twitter tags, structured data, images with alt text, links to unknown pages, duplicates.
- Structured data: Organization / ProfessionalService with address, phone and areas served (all pages), Service and BreadcrumbList (service pages), FAQPage (landing pages and the cover maker), WebApplication (cover maker).
- `robots.txt` allows all crawlers including AI crawlers. `llms.txt` and `.well-known/ai-catalog.json` describe the site for AI assistants. `www` and `http` redirect to `https://firefoxpublisher.com` (checked on the live site: 301).

## Landing pages for real search phrases
Written for what people type, without keyword stuffing: book cover design services, Amazon KDP publishing help, ghostwriting services USA, children's book illustration and publishing, plus the existing USA and NJ/NY pages. Each has its own FAQ and links to the matching service page.

## Only you can do these
1. **Google Search Console.** Go to search.google.com/search-console, sign in with the Google account that should own the site, click **Add property**, choose **Domain**, type `firefoxpublisher.com`. Google shows a TXT record. In Cloudflare: your domain > DNS > Records > Add record > Type TXT, Name `@`, paste the value, Save. Back in Search Console click **Verify**.
2. **Submit the sitemap.** Search Console > Sitemaps > type `sitemap.xml` > Submit. Then URL Inspection > paste `https://firefoxpublisher.com/` > Request indexing (repeat for the four new landing pages).
3. **Bing Webmaster Tools.** Go to bing.com/webmasters, sign in, **Import from Google Search Console** (quickest) or Add a site and verify the same way. Then Sitemaps > Submit `https://firefoxpublisher.com/sitemap.xml`. Bing's index feeds Edge, DuckDuckGo, Yahoo and several AI assistants.
4. **Google Business Profile.** Go to business.google.com > Add your business. The business is at 333 Washington St #233, Hoboken, NJ 07030. Google usually requires a postcard or video verification, and a service-area business can hide the address. Keep the name, address and phone identical to the website footer.
5. **Backlinks (links from other sites).** The biggest ranking factor and the one code cannot create. Ideas that are honest and work: list the business on Hoboken and New Jersey business directories, ask authors you published to link to their book credits, write guest posts for writing blogs, answer questions in author communities with a link where it helps, and keep the free cover maker shareable (it is the most linkable page).
6. **Reviews.** Ask happy authors for a Google review after the project. Never buy or write fake reviews.

## Measured (see the final report for the numbers)
Lab Lighthouse scores on a slow computer are noisy: run twice and trust trends, not single numbers.
