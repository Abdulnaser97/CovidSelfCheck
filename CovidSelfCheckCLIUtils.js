const util = require("util");
const exec = util.promisify(require("child_process").exec);

async function openSheet() {
  try {
    const { stdoutPKill } = await exec(`pkill -x 'Microsoft Excel'`);
  } catch (e) {}
  try {
    await sleep(2000);
    const { stdout } = await exec(
      `cd /Users/naser/Desktop/Projects/CovidSelfCheck && open checkInHistory.xls`
    );
    console.log(stdout);
  } catch (e) {
    console.log(`ERROR: openSheet(): ${e}`);
  }
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

module.exports = {
  openSheet,
};
