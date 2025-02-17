import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium-min'
import prisma from '../../../../lib/prisma';

chromium.setGraphicsMode = true;

export async function POST(req: NextRequest, res: NextResponse) {

    await chromium.font(
        "https://raw.githack.com/googlei18n/noto-emoji/master/fonts/NotoColorEmoji.ttf"
    );

    const isLocal = !!process.env.CHROME_EXECUTABLE_PATH;

    const browser = await puppeteer.launch({
        args: isLocal ? puppeteer.defaultArgs() : [...chromium.args, '--no-sandbox', '--hide-scrollbars', '--incognito'],
        defaultViewport: chromium.defaultViewport,
        executablePath: process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath(),
        headless: chromium.headless,
    });

    try {
        const { name } = await req.json();

        const page = await browser.newPage();
        await page.goto(`https://www.jobs.cz/prace/praha/?q%5B%5D=${name}&date=7d`, {
            waitUntil: 'networkidle2',
        });

        const cookiesButton = await page.$('.c-bn c_link');
        if (cookiesButton) {
            await cookiesButton.click();
        }

        await page.waitForSelector('.SearchResultCard');

        const finalJobCards = [];


        for (let i = 0; i < 3; i++) {
            const jobCards = await page.evaluate(() => {
                const cards: NodeListOf<Element> = document.querySelectorAll('.SearchResultCard');

                return Array.from(cards).map(card => {
                    const title: | string = card.querySelector('.SearchResultCard__title')?.innerText.trim();
                    const url: string = card.querySelector('.SearchResultCard__title a')?.getAttribute('href');
                    const company: string = card.querySelector('.SearchResultCard__footerItem')?.innerText.trim();
                    const location: string = card.querySelector('[data-test="serp-locality"]')?.innerText.trim();
                    return { title, url, company, location };
                });
            });

            finalJobCards.push(...jobCards);

            await page.evaluate(() => {
                const nextButton = document.querySelector('#search-result-container nav .Pagination li:last-child a') as HTMLAnchorElement;
                if (nextButton) {
                    nextButton.click();
                } else {
                    throw new Error('Next button not found');
                }
            });

            await page.waitForNavigation({ waitUntil: 'networkidle0' })
        }

        await browser.close();

        for (const job of finalJobCards) {
            console.log(job)
            await prisma.job.upsert({
                where: {
                    title_company_location: { // Use the composite unique key
                        title: job.title,
                        company: job.company,
                        location: job.location,
                    },
                },
                update: {
                    url: job.url, // Update the URL or other fields
                },
                create: {
                    url: job.url,
                    title: job.title,
                    company: job.company,
                    location: job.location,
                },
            });
        }
        return Response.json(finalJobCards);
    } catch (error) {
        console.error('Error during scraping:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
