const { PuppeteerWebBaseLoader } = require("langchain/document_loaders/web/puppeteer");
const fs = require( "fs");
const path = require("path");
const { URL } = require("url");
const puppeteer = require("puppeteer");

const execute = async (options) => {
  const url  = options;
  try {
    const websiteName = new URL(url).hostname;
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const outputDirectory = path.join(".", "output");
    if (!fs.existsSync(outputDirectory)) {
      fs.mkdirSync(outputDirectory, { recursive: true });
    }
    const saveFileName = `${websiteName}_${timestamp}.html`;
    const saveFilePathWithDate = path.join(outputDirectory, saveFileName);
    const loader = new PuppeteerWebBaseLoader(url, {
      launchOptions: {
        headless: 'new',
      },
      gotoOptions: {
        waitUntil: "domcontentloaded",
      },
      async evaluate(page, browser) {
        const html = await page.evaluate(
          () => document.documentElement.innerHTML
        );
        fs.writeFileSync(saveFilePathWithDate, html);
        return `Website HTML saved to ${saveFilePathWithDate}`;
      },
    });
    await loader.load();
    return `Website HTML saved to ${saveFilePathWithDate}`;
  } catch (error) {
    console.error("Error occurred while scraping HTML:", error);
    throw error;
  }
};

const details = {
    name: "scrape_website",
    description: "Scrape the HTML of a website",
    parameters: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "The URL of the website to scrape the HTML",
        },
      },
      required: ["url"],
    },
    example: "Scrape the HTML for Google"
};
module.exports = { execute, details };