const core = require('@actions/core');
const axios = require('axios');
const fs = require('fs');

const commit = process.env['GITHUB_SHA'];
const repo = process.env['GITHUB_REPOSITORY'];
const ref = process.env['GITHUB_REF'];
const workflow = process.env['GITHUB_WORKFLOW'];
const event = process.env['GITHUB_EVENT_NAME'];
const url = `https://github.com/${repo}/commit/${commit}/checks`;

const variables = Object.entries(process.env).filter(x => x[0].startsWith('INPUT_'));

console.log(url);
console.log(variables);

async function main() {
  const messageDir = core.getInput('template');
  let message = fs.readFileSync(messageDir, 'utf8');
  for (const [key, value] of variables) {
    const regex = new RegExp('{{ *' + key.toLowerCase() + ' *}}', 'g');
    message = message.replace(regex, value);
  }
  await axios.post(process.env.SLACK_WEBHOOK, message).catch(err => {
    throw new Error(err);
  });
}

try {
  main();
} catch (err) {
  core.setFailed(err.message);
}
