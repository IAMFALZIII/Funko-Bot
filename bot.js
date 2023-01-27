const Discord = require('discord.js');
const client = new Discord.Client();
const puppeteer = require('puppeteer');
const schedule = require('node-schedule');

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    // Schedule the scraping job to run every day at 8:00 AM
    schedule.scheduleJob('0 8 * * *', async function() {
        await scrapeAndPost();
    });
});

client.on("ready", () => {
    console.log("Bot is ready!");
    client.generateInvite(["ADMINISTRATOR"]).then(link => {
        console.log("Invite link: " + link);
    }).catch(err => {
        console.log("Error generating invite link: " + err);
    });
});

client.login("752836316579889232");


async function scrapeAndPost() {
    // Use puppeteer to scrape the website for new releases
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://funko.com/collections/pop');
    const newReleases = await page.evaluate(() => {
        // Use the DOM to extract the data you need
        const releases = [];
        const elements = document.querySelectorAll('.product-card__title');
        elements.forEach(element => {
            releases.push(element.innerText);
        });
        return releases;
    });

    // Send the new releases to a specific channel on your Discord server
    const channel = client.channels.cache.get('752836316579889232');
    if (channel) {
        channel.send(`New Funko Pop releases: ${newReleases.join(', ')}`);
    } else {
        console.log('Channel not found');
    }

    await browser.close();
}

client.login('04cf2eb93e22d7a11da3b9278c2ae0a2f2f0c12bbda1775f0f831ea90ea66e2c');
