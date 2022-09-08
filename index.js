const puppeteer = require("puppeteer-extra");
const readlineSync = require("readline-sync");
const delay = require("delay");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));
(async () => {
  console.log("\nWelcome to tiktok views bot");
  // console.log("1. Get views");
  // console.log("2. Get shares");
  // console.log("3. Get comment likes\n");
  // let menu = readlineSync.question("Choose menu: ");
  let menu = 1;

  if (menu > 3) {
    console.log("Wrong menu");
  } else {
    let tiktokUrl = readlineSync.question("Enter tiktok url : ");
    const options = {
      waitUntil: "domcontentloaded",
      timeout: 5000,
    };
    const browser = await puppeteer.launch({
      headless: false,
      ignoreHTTPSErrors: true,
      slowMo: 0,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-cache",
        "--disable-application-cache",
        "--disk-cache-size=0",
        "--disable-accelerated-2d-canvas",
        "--disable-sync",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
        "--mute-audio",
      ],
    });
    const page = await browser.newPage();
    const navigationPromise = page.waitForNavigation();
    await page.goto("https://zefoy.com/", options);
    await navigationPromise;
    readlineSync.question(
      "Please check the captcha and press enter on here to continue..."
    );
    await delay(5000);
    if (menu == 1) {
      // click on tiktok views
      await page.waitForSelector(".row > .col-sm-4 > .card > .menu4");
      await page.click(".row > .col-sm-4 > .card > .menu4");
    }
    // else if (menu == 2) {
    //   await page.waitForSelector(".row > .col-sm-4 > .card > .menu7");
    //   await page.click(".row > .col-sm-4 > .card > .menu7");
    // } else if (menu == 3) {
    //   await page.waitForSelector(".row > .col-sm-4 > .card > .menu3");
    //   await page.click(".row > .col-sm-4 > .card > .menu3");
    // }

    // click on tiktok url input
    await delay(1000);
    await page.waitForSelector(
      "#sid4 > .card > form > .input-group > .form-control"
    );
    await page.click("#sid4 > .card > form > .input-group > .form-control");
    // input tiktok url
    await page.type(
      "#sid4 > .card > form > .input-group > .form-control",
      tiktokUrl
    );
    //   loop this code
    for (let i = 0; i < 1000; i++) {
      try {
        console.log("\nRunning proccess --> " + i);
        await delay(1000);
        // click search button
        await page.waitForSelector("#sid4 > div > form > div > div > button", {
          timeout: 30000,
        });
        await page.click("#sid4 > div > form > div > div > button");
        // wait total views
        try {
          await page.waitForSelector(
            "#c2VuZC9mb2xsb3dlcnNfdGlrdG9V > div.row.text-light.d-flex.justify-content-center > div > form > button",
            { timeout: 3000 }
          );
          let element = await page.$(
            "#c2VuZC9mb2xsb3dlcnNfdGlrdG9V > div.row.text-light.d-flex.justify-content-center > div > form > button"
          );
          let text = await page.evaluate((el) => el.textContent, element);
          console.log(
            "Total content views: " + (text ? text.trim() : "Unknown")
          );
          await delay(500);
          // click send action button
          await page.click(
            "#c2VuZC9mb2xsb3dlcnNfdGlrdG9V > div.row.text-light.d-flex.justify-content-center > div > form > button"
          );
          await delay(5500);
        } catch (error) {
          console.log("Waiting for next submit - (Cooldown)");
        }
        // wait for success message
        await page.waitForSelector("#c2VuZC9mb2xsb3dlcnNfdGlrdG9V > h4", {
          timeout: 10000,
        });
        let element2 = await page.$("#c2VuZC9mb2xsb3dlcnNfdGlrdG9V > h4");
        let text2 = await page.evaluate((el) => el.textContent, element2);
        console.log(text2 ? text2 : "Unknown");
        if (text2.trim() == "Checking Timer...") {
          console.log("Please wait 130 seconds...");
          await delay(130000);
        } else {
          let matches = text2.trim().match(/(\d+)/g);
          let timeDelay = matches[0] * 60 + matches[1] * 1;
          console.log("Please wait " + timeDelay + " seconds...");
          await delay(timeDelay * 1000);
        }
      } catch (error) {
        console.log(error);
        // console.log("Error, please check try again.");
        await browser.close();
      }
    }
  }
})();
