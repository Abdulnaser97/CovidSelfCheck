#! /usr/local/bin node

const util = require("util");
const exec = util.promisify(require("child_process").exec);

// Specify script to run cron scheduler as well as its contaning folder path
const REPO_PATH = "/Users/naser/Desktop/Projects/CovidSelfCheck";
const SCRIPT = "CovidSelfCheckCLI";

const {} = require("./Utils");
const { utor, p } = require("./UserDetails");

async function cronCaller() {
  cmd = `1 0 * * * cd ${REPO_PATH} && /usr/local/bin/node ${SCRIPT} > /tmp/CovidSelfCheckCronLog.log`;

  const { stdout, stderr } = await exec(
    `(crontab -l 2>/dev/null; echo "${cmd}") | crontab -`
  );
  console.log(stdout);
  console.log(stderr);
}

cronCaller();
