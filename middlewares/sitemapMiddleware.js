const fs = require('fs');
const path = require('path');
const Product = require('../models/product.model');
const Category = require('../models/category.model');

// Function to encode URLs
const encodeURL = (url) => {
    return url
        .replace(/&/g, '&amp;') // Replace & with &amp;
        .replace(/</g, '&lt;') // Replace < with &lt;
        .replace(/>/g, '&gt;') // Replace > with &gt;
        .replace(/"/g, '&quot;') // Replace " with &quot;
        .replace(/'/g, '&apos;'); // Replace ' with &apos;
};

// Function to generate URL entries
const generateURL = (loc, priority = 0.5, lastmod = new Date().toISOString(), changefreq = 'daily') => {
    return `
  <url>
    <loc>${encodeURL(loc)}</loc>
    <priority>${priority}</priority>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
  </url>`;
};

const sitemapMiddleware = async (req, res, next) => {
    try {
        const baseUrl = `https://${req.get('host')}`;
        const filePath = path.join(__dirname, '../public/sitemap.xml');

        // Static URLs to be added to the sitemap
        const staticUrls = [
            { path: '', priority: 1.0, lastmod: new Date().toISOString(), changefreq: 'daily' },
            { path: '/shop', priority: 0.8, lastmod: new Date().toISOString(), changefreq: 'daily' },
            { path: '/login', priority: 0.5, lastmod: new Date().toISOString(), changefreq: 'monthly' },
            { path: '/register', priority: 0.5, lastmod: new Date().toISOString(), changefreq: 'monthly' },
            { path: '/account', priority: 0.5, lastmod: new Date().toISOString(), changefreq: 'monthly' },
            { path: '/cart', priority: 0.5, lastmod: new Date().toISOString(), changefreq: 'weekly' },
            { path: '/terms-of-use', priority: 0.5, lastmod: new Date().toISOString(), changefreq: 'yearly' },
            { path: '/privacy-policy', priority: 0.5, lastmod: new Date().toISOString(), changefreq: 'yearly' },
            { path: '/shipping-policy', priority: 0.5, lastmod: new Date().toISOString(), changefreq: 'yearly' },
            { path: '/cookie-policy', priority: 0.5, lastmod: new Date().toISOString(), changefreq: 'yearly' },
        ];

        const socialMediaUrls = [
            { url: 'https://www.facebook.com/geldixpharma', priority: 0.1, lastmod: new Date().toISOString(), changefreq: 'never' },
            { url: 'https://twitter.com/geldixpharma', priority: 0.1, lastmod: new Date().toISOString(), changefreq: 'never' },
            { url: 'https://www.linkedin.com/in/geldix-private-limited-8098192a7/', priority: 0.1, lastmod: new Date().toISOString(), changefreq: 'never' },
            { url: 'https://www.instagram.com/geldixpharma/', priority: 0.1, lastmod: new Date().toISOString(), changefreq: 'never' },
        ];

        // Prepare sitemap content
        let sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        sitemapContent += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        // Add static URLs with metadata
        staticUrls.forEach(({ path, priority, lastmod, changefreq }) => {
            sitemapContent += generateURL(`${baseUrl}${path}`, priority, lastmod, changefreq);
        });

        // Add dynamic URLs from database (products, categories, etc.)
        const dynamicUrls = await fetchDynamicUrlsFromDatabase();
        dynamicUrls.forEach(({ loc, priority, lastmod, changefreq }) => {
            sitemapContent += generateURL(`${baseUrl}${loc}`, priority, lastmod, changefreq);
        });

        // Add social media URLs with metadata
        socialMediaUrls.forEach(({ url, priority, lastmod, changefreq }) => {
            sitemapContent += generateURL(url, priority, lastmod, changefreq);
        });

        sitemapContent += `</urlset>`;

        // Write the sitemap content to the file
        fs.writeFileSync(filePath, sitemapContent);

        console.log('Sitemap.xml has been updated.');
        next();

    } catch (error) {
        console.error("Error in generating sitemap.xml file: ", error);
        res.status(500).send('Internal Server Error');
    }
};

// Example function to fetch dynamic URLs from your MongoDB database
async function fetchDynamicUrlsFromDatabase() {
    const products = await Product.find().select('_id');
    const categories = await Category.find().select('_id subcategories');
    const urls = [];
    products.forEach(product => {
        urls.push({ loc: `/product/${product._id}`, priority: 0.6, lastmod: new Date().toISOString(), changefreq: 'weekly' });
    });
    categories.forEach(category => {
        urls.push({ loc: `/shop/?cat=${category._id}`, priority: 0.6, lastmod: new Date().toISOString(), changefreq: 'weekly' });
        category.subcategories.forEach(subcategory => {
            urls.push({ loc: `/shop/?cat=${category._id}&subcat=${subcategory._id}`, priority: 0.6, lastmod: new Date().toISOString(), changefreq: 'weekly' });
       });
    });
    return urls;
}

module.exports = sitemapMiddleware;
