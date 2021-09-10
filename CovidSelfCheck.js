require("geckodriver");
var firefox = require("selenium-webdriver/firefox");

var webdriver = require("selenium-webdriver");
var until = webdriver.until;
var By = webdriver.By;
var Key = webdriver.Key;
var element = webdriver.WebElement;

const {
  getElement,
  getElements,
  getSubElement,
  IsDisplayed,
  waitFor,
} = require("./Utils");

const Login = require("./Login");
const { utor, p } = require("./UserDetails");

async function CovidSelfCheck(utor, p) {
  let isChecked = "NO";
  try {
    var builder = new webdriver.Builder().forBrowser("firefox");
    driver = builder.build();
    await driver.get("https://ucheck.utoronto.ca/");

    // Full Screen
    await driver.manage().window().fullscreen();

    // Wait for page load
    await Promise.race([waitFor(driver, `.//input[@id='username']`)]).then(
      async () => {
        isChecked = await selfCheck(driver, utor, p);
        await driver.quit();
      }
    );

    return isChecked;
  } catch (e) {
    console.log("ERROR in CovidSelfCheck()", e);
    throw new Error(`ERROR: in CovidSelfCheck()`);
  }
}

async function selfCheck(driver, utor, p) {
  try {
    await Login(driver, utor, p);

    await waitFor(driver, `.//*[text()[contains(.,'New Self-Assessment')]]`);

    // Choose Time
    let newSelfCheck = await getElement(
      driver,
      `.//*[text()[contains(.,'New Self-Assessment')]]`
    );
    await driver.sleep(2000);
    await newSelfCheck.click();

    let staleSubmitButton =
      ".//button[@tabindex='-1']//span[text()[contains(.,'Submit')]]";

    while (await IsDisplayed(await getElements(driver, staleSubmitButton))) {
      let NoButtons = await getElements(
        driver,
        `.//label//span[text()[contains(.,'No')]]`
      );

      NoButtons.forEach(async (button) => {
        if (!(await button.isSelected())) {
          await button.click();
        }
      });
    }

    await driver.sleep(1000);

    const submitButton = await getElements(
      driver,
      ".//button//span[text()[contains(.,'Submit')]]"
    );
    await submitButton[0].click();

    await driver.sleep(1000);

    return "YES";
  } catch (e) {
    console.log("ERROR in selfCheck()", e);
    throw new Error(`Error in selfCheck()`);
  }
}

module.exports = CovidSelfCheck;
