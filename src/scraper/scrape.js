import cheerio from 'cheerio';

export async function scrapeWebsite(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove all script and style elements
    $('script, style').remove();

    let siteText = $('body').text();
    siteText = siteText.replace(/(\r\n){2,}/g, '\r\n').trim();

    const accessDate = new Date().toISOString();

    return {
      siteUrl: url,
      siteText: siteText.trim(),
      accessDate: accessDate
    };
  } catch (error) {
    console.error(`Error scraping ${url}: ${error}`);
    return null;
  }
}