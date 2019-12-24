const core = require('@actions/core');
const axios = require('axios');

async function main() {
  const message = core.getInput('message');
  console.log(message);
  const response = await axios.post(process.env.SLACK_WEBHOOK, message);
  console.log(response);
}

try {
  main();
} catch (err) {
  core.setFailed(err.message);
}
