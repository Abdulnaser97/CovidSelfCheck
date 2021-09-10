const CovidSelfCheck = require("./CovidSelfCheck");
const { switchOutputAudio, changeVolume } = require("./MacAudio");
const { logToSheet } = require("./sheetUtils");
const { openSheet } = require("./CovidSelfCheckCLIUtils");
const UserDetails = require("./UserDetails");

let properties = [
  {
    ask: "Enter UTORID: ",
    name: "utor",
    value: "",
  },
  {
    ask: "Enter Password",
    name: "p",
    value: "",
  },
];

// print process.argv
process.argv.forEach((val, index) => {
  //console.log(`${index}: ${val}`);
  if (val.includes("utor=")) {
    properties[0].value = val.substr("utor=".length + 2);
  } else if (val.includes("p=")) {
    properties[1].value = val.substr("p=".length + 2);
  }
});

async function CovidSelfCheckCLI(utor, p) {
  // Mute volume
  switchOutputAudio("MacBook Pro Speakers");
  changeVolume("MacBook Pro Speakers", 0);

  let repeatCounter = 0;
  const maxRepeats = 3;
  let err = false;

  let selfCheckSummary = {
    isChecked: "",
  };

  const UTORID = utor ? utor : UserDetails.utor;
  const PWD = p ? p : UserDetails.p;

  do {
    try {
      const isChecked = await CovidSelfCheck(UTORID, PWD);

      selfCheckSummary.isChecked = isChecked;
    } catch (e) {
      console.log("ERROR: CovidSelfCheckCLI: ", e);
      repeatCounter++;
      err = true;
    }
  } while (repeatCounter < maxRepeats && err == true);

  // Unmute volume
  changeVolume("MacBook Pro Speakers", 0.6);
  switchOutputAudio("USB Audio Device");

  // Store results in excelsheet
  logToSheet(selfCheckSummary);
  await openSheet();
}

CovidSelfCheckCLI(properties[0].value, properties[1].value);
