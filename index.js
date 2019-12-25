const core = require('@actions/core');
const axios = require('axios');
const fs = require('fs');

console.log(Object.entries(process.env));
// async function main() {
//   const messageDir = core.getInput('message');
//   const message = fs.readFileSync(messageDir);
//   await axios.post(process.env.SLACK_WEBHOOK, message).catch(err => {
//     throw new Error(err);
//   });
// }

// try {
//   main();
// } catch (err) {
//   core.setFailed(err.message);
// }
