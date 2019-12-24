const core = require('@actions/core');
const axios = require('axios');
const fs = require('fs');

async function main() {
  const messageDir = core.getInput('message');
  const message = fs.readFileSync(messageDir);
  const response = await axios.post(process.env.SLACK_WEBHOOK, message);
  // console.log(response);
}

try {
  main();
} catch (err) {
  core.setFailed(err.message);
}
