const fs = require('fs');
const path = require('path');

const productDir = path.join(__dirname, 'products');
const dirs = fs.readdirSync(productDir).filter(f => fs.statSync(path.join(productDir, f)).isDirectory());

dirs.forEach(dir => {
    const indexPath = path.join(productDir, dir, 'index.html');
    if (!fs.existsSync(indexPath)) return;

    let content = fs.readFileSync(indexPath, 'utf-8');

    // Extract title
    const titleMatch = content.match(/<title>(.*?)<\/title>/);
    const title = titleMatch ? titleMatch[1] : '';

    // Extract body class
    const bodyClassMatch = content.match(/<body[^>]*class="([^"]+)"/);
    const bodyClass = bodyClassMatch ? bodyClassMatch[1] : '';

    // Extract styles
    let styles = '';
    const styleMatch = content.match(/<style>([\s\S]*?)<\/style>/g);
    if (styleMatch) {
        styles = `{{#push "styles"}}\n${styleMatch.join('\n')}\n{{/push}}\n`;
    }

    // Extract the main content between <body...> and <script type="module"
    const bodyContentMatch = content.match(/<body[^>]*>([\s\S]*?)<script type="module" src="\/assets\/js\/app\.js">/);
    if (!bodyContentMatch) {
        console.log("Could not find body content for", indexPath);
        return;
    }
    let bodyContent = bodyContentMatch[1];

    // Remove header and footer
    bodyContent = bodyContent.replace(/\{\{>\s*components\/header\s*(isHome=true)?\}\}/, '');
    bodyContent = bodyContent.replace(/\{\{>\s*components\/footer\s*(hideNewsletter=true)?\}\}/, '');

    // Extract custom scripts
    // Find all scripts after app.js except swiper and aos
    let customScripts = '';
    const scriptAreaMatch = content.match(/<script type="module" src="\/assets\/js\/app\.js">([\s\S]*?)<\/body>/);
    if (scriptAreaMatch) {
        let scriptsBlock = scriptAreaMatch[1];
        // Remove swiper, aos and stack "scripts"
        scriptsBlock = scriptsBlock.replace(/<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/swiper.*><\/script>/g, '');
        scriptsBlock = scriptsBlock.replace(/<script src="https:\/\/unpkg\.com\/aos.*><\/script>/g, '');
        scriptsBlock = scriptsBlock.replace(/\{\{\{stack "scripts"\}\}\}/g, '');
        // Remove AOS init block if it matches exactly the generic one
        scriptsBlock = scriptsBlock.replace(/<script>\s*AOS\.init\(\{\s*duration:\s*800,\s*once:\s*true,\s*offset:\s*100,?\s*\}\);\s*<\/script>/g, '');
        // Remove empty lines and see if anything is left
        if (scriptsBlock.trim().length > 0) {
            customScripts = `{{#push "scripts"}}\n${scriptsBlock.trim()}\n{{/push}}\n`;
        }
    }

    const layoutHeader = `{{#> layouts/main pageName="products" lang="en" bodyClass="${bodyClass}" title="${title}" hideNewsletter=true}}\n${styles}`;
    const layoutFooter = `\n${customScripts}{{/layouts/main}}\n`;

    const newContent = `${layoutHeader}${bodyContent}${layoutFooter}`;
    
    // clean up empty GSXD DEBUG comments or multiple newlines
    const finalContent = newContent.replace(/\n\s*\n\s*\n/g, '\n\n');

    fs.writeFileSync(indexPath, finalContent);
    console.log(`Updated ${indexPath}`);
});
