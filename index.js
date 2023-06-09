const Redis = require("ioredis");

const config = require("./config.json");
const redisClient = new Redis(config.redis);
redisClient.on('error', (error) => {
    console.error('[Redis] Error', error);
});

(async function main () {
    while (true) {
        const response = await fetch(`https://api.monobank.ua/bank/currency`);
        /**
         * @type {{
         *  currencyCodeA: number,
         *  currencyCodeB: number,
         *  date: number,
         *  rateBuy: number,
         *  rateSell: number,
         *  rateCross: number
         * }[]}
         */
        const data = await response.json();

        data.forEach(item => {
            const key = `${item.currencyCodeA}_${item.currencyCodeB}`;
            const value = `${item.rateBuy}_${item.rateCross}`;
            redisClient.set(key, value);
        });

        // Wait 24h
        await new Promise(resolve => setTimeout(resolve, 24 * 60 * 60 * 1000))
    }
})()
