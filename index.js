import fetch from 'node-fetch';
import cheerio from 'cheerio';
import Sheet from './sheet.js';

const getPrice = async (url) => {
    const res = await fetch(url);
    const text = await res.text();
    const $ = cheerio.load(text);
    const price = $('.instrument-price_instrument-price__3uw25 span').first().text();
    return price;
}

(async () => {
    const sheet = new Sheet();
    await sheet.load();
    const stocks = await sheet.getRows(0);
    const dayPrices = {};
    for (let stock of stocks) {
        dayPrices[stock.ticker] = await getPrice(stock.url);
    }

    dayPrices.date = new Date().toDateString();
    await sheet.addRows([dayPrices], 1);
})()