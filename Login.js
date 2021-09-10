const { getElement } = require("./Utils");

var webdriver = require("selenium-webdriver");
var until = webdriver.until;
var By = webdriver.By;
var Key = webdriver.Key;
var element = webdriver.WebElement;

async function Login(driver, utor, p) {
  let UNField = await getElement(driver, `.//input[@id="username"]`);
  await UNField.sendKeys(utor);

  let pwdField = await getElement(driver, `.//input[@id="password"]`);
  await pwdField.sendKeys(p);

  let loginButtons = await driver.findElements(
    By.xpath(`.//button[@type='submit']`)
  );

  let loginButton = loginButtons[0];
  await loginButton.click();
}

module.exports = Login;
