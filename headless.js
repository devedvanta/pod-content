const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('http://localhost:8081/jumper/index.html');
    await page.screenshot({path: 'example.png'});
    setInterval(async () => {
        await page.screenshot({path: 'example.jpeg', quality: 5});
        console.log('new screenshot');
    }, 5000)
    page.on('console', msg => {
        // console.log(msg);
        // if (msg.type() === 'log') {
            console.log(`!! ${msg.text()}`);
        // }
      });
    // await page.evaluate()
    // await browser.close();
  })();