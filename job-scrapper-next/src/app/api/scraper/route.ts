import { NextRequest } from "next/server";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";
import prisma from "../../../../lib/prisma";

chromium.setGraphicsMode = true;

export async function POST(req: NextRequest) {
  await chromium.font(
    "https://raw.githack.com/googlei18n/noto-emoji/master/fonts/NotoColorEmoji.ttf",
  );

  const isLocal = !!process.env.CHROME_EXECUTABLE_PATH;

  const browser = await puppeteer.launch({
    args: isLocal
      ? puppeteer.defaultArgs()
      : [...chromium.args, "--no-sandbox", "--hide-scrollbars", "--incognito"],
    defaultViewport: chromium.defaultViewport,
    executablePath:
      process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath()),
    headless: chromium.headless,
  });

  try {
    const { name } = await req.json();

    const page = await browser.newPage();
    await page.goto(
      `https://www.jobs.cz/prace/praha/?q%5B%5D=${name}&date=7d`,
      {
        waitUntil: "networkidle2",
      },
    );

    const cookiesButton = await page.$(".c-bn.c_link");
    if (cookiesButton) {
      await cookiesButton.click();
    }

    await page.waitForSelector(".SearchResultCard");

    const finalJobCards = [];

    for (let i = 0; i < 3; i++) {
      const jobCards = await page.evaluate(() => {
        const cards: NodeListOf<HTMLElement> =
          document.querySelectorAll(".SearchResultCard");

        return Array.from(cards).map((card) => {
          const titleElement = card.querySelector(
            ".SearchResultCard__title",
          ) as HTMLElement | null;
          const title: string = titleElement?.innerText.trim() || "";

          const urlElement = card.querySelector(
            ".SearchResultCard__title a",
          ) as HTMLAnchorElement | null;
          const url: string = urlElement?.getAttribute("href") || "";

          const companyElement = card.querySelector(
            ".SearchResultCard__footerItem",
          ) as HTMLElement | null;
          const company: string = companyElement?.innerText.trim() || "";

          const locationElement = card.querySelector(
            '[data-test="serp-locality"]',
          ) as HTMLElement | null;
          const location: string = locationElement?.innerText.trim() || "";

          return { title, url, company, location };
        });
      });
      finalJobCards.push(...jobCards);

      const nextButton = await page.evaluate(() => {
        const button = document.querySelector(
          "#search-result-container nav .Pagination li:last-child a",
        ) as HTMLAnchorElement;
        if (button) {
          button.click();
          return true;
        } else {
          console.log("No more pages");
          return false;
        }
      });

      if (!nextButton) {
        break;
      } else {
        await page.waitForNavigation({ waitUntil: "networkidle0" });
      }
    }

    await browser.close();

    for (const job of finalJobCards) {
      console.log(job);
      await prisma.job.upsert({
        where: {
          title_company_location: {
            title: job.title,
            company: job.company,
            location: job.location,
          },
        },
        update: {
          url: job.url,
          source: "scraped", // Ensure scraped jobs are marked
        },
        create: {
          url: job.url,
          title: job.title,
          company: job.company,
          location: job.location,
          source: "scraped", // Mark as scraped
        },
      });
    }
    return Response.json(finalJobCards);
  } catch (error) {
    console.error("Error during scraping:", error);
    return Response.json({ error: "Scraping failed" }, { status: 500 });
  }
}
