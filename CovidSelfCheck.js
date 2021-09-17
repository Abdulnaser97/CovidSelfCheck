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

    await Promise.race([
      waitFor(driver, `.//*[text()[contains(.,'Start health screening')]]`),
      waitFor(driver, `.//*[text()[contains(.,'New Self-Assessment')]]`),
    ]);

    // Choose Time
    let newSelfCheck = await getElements(
      driver,
      `.//*[text()[contains(.,'Start health screening')]]`
    );

    if (newSelfCheck.length === 0) {
      newSelfCheck = await getElements(
        driver,
        `.//*[text()[contains(.,'New Self-Assessment')]]`
      );
    }

    await driver.sleep(2000);
    await newSelfCheck[0].click();

    let submitButton = ".//button//span[text()[contains(.,'Submit')]]";

    //vaccinated

    //.//div[contains(@class,'MuiCollapse-container') and .//*[text()[contains(., 'I am fully vaccinated')]]]/following-sibling::div[position()=1][contains(@class,'MuiCollapse-container')]//input[contains(@id,'yes')]
    const fullyVaccinatedCard = `div[contains(@class,'MuiCollapse-container') and .//*[text()[contains(., 'I am fully vaccinated')]]]`;
    const yesButton = `div[position()=1][contains(@class,'MuiCollapse-container')]//input[contains(@id,'yes')]/..//span`;

    await waitFor(
      driver,
      `.//${fullyVaccinatedCard}/following-sibling::${yesButton}`
    );

    let yesButtons = await getElements(
      driver,
      `.//${fullyVaccinatedCard}/following-sibling::${yesButton}`
    );

    await yesButtons[0].click();

    const otherCards = `.//div[contains(@class,'MuiCollapse-container') and not(.//*[text()[contains(., 'I am fully vaccinated')]])]`;
    const ButtonsWrapper = `div[position()=1][contains(@class,'MuiCollapse-container') and .//input[contains(@id,'_yes')]]`;
    const clicked = {};
    do {
      // Get the no button whose parent doesnot have an immediate preceding sibling with text I am fully vaccinated
      let NoButtons = await getElements(
        driver,
        `${otherCards}/following-sibling::${ButtonsWrapper}//input[contains(@id,'no')]/..//span`
      );

      NoButtons.forEach(async (button) => {
        if (!clicked[button.getId()]) {
          await button.click();
          clicked[await button.getId()] = 1;
        }
      });

      const submitButton = await getElements(
        driver,
        ".//button//span[text()[contains(.,'Submit')]]"
      );
      await submitButton[0].click();
    } while (await IsDisplayed(await getElements(driver, submitButton)));
    await driver.sleep(2000);
    return "YES";
  } catch (e) {
    console.log("ERROR in selfCheck()", e);
    throw new Error(`Error in selfCheck()`);
  }
}

module.exports = CovidSelfCheck;
