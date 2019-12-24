const core = require('@actions/core');
const github = require('@actions/github');
const axios = require('axios');

async function main() {
  const message = github.core.getInput('message');
  const response = await axios.post(process.env.SLACK_WEBHOOK, message);
  console.log(response);
}

try {
  main();
} catch (err) {
  core.setFailed(err.message);
}
