const core = require('@actions/core');
const axios = require('axios');
const fs = require('fs');

async function main() {
  const messageDir = core.getInput('message');
  fs.readdir('./', function(err, items) {
    console.log(items);

    for (var i = 0; i < items.length; i++) {
      console.log(items[i]);
    }
  });
  const message = fs.readFileSync(messageDir);
  console.log(message);
  const response = await axios.post(process.env.SLACK_WEBHOOK, message);
  console.log(response);
}

try {
  main();
} catch (err) {
  core.setFailed(err.message);
}
