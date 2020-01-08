const core = require('@actions/core');
const https = require('https');
const fs = require('fs');

// Get all default environment variables
const commit = process.env.GITHUB_SHA;
const repo = process.env.GITHUB_REPOSITORY;
const ref = process.env.GITHUB_REF;
const headRef = process.env.GITHUB_HEAD_REF;
const baseRef = process.env.GITHUB_BASE_REF;
const actor = process.env.GITHUB_ACTOR;
const workflowName = process.env.GITHUB_WORKFLOW;
const eventName = process.env.GITHUB_EVENT_NAME;
const repoUrl = `https://github.com/${repo}`;
const actionsUrl = `${repoUrl}/commit/${commit}/checks`;

const defaultVariables = [
  ['commit', commit],
  ['repo', repo],
  ['ref', ref],
  ['head_ref', headRef],
  ['base_ref', baseRef],
  ['actor', actor],
  ['workflow', workflowName],
  ['event', eventName],
  ['repo_url', repoUrl],
  ['actions_url', actionsUrl],
];

// Get all sepecified `with` arguments
const inputVariables = Object.entries(process.env).filter(x => x[0].startsWith('INPUT_'));

async function main() {
  const messageDir = core.getInput('template');
  let message = fs.readFileSync(messageDir, 'utf8');

  // merge specified parameters with default variables
  const variables = [...inputVariables, ...defaultVariables];

  // search and replace template hooks
  for (const [k, v] of variables) {
    const key = k.replace('INPUT_', '').toLowerCase();
    const regex = new RegExp('{{ *' + key + ' *}}', 'g');
    message = message.replace(regex, v);
  }

  // send the request
  await send(JSON.parse(message)).catch(err => core.setFailed(err.message));
}

async function send(body) {
  const postData = JSON.stringify(body);
  const path = process.env.SLACK_WEBHOOK.match(/services\/(.*)/)[1];
  const options = {
    hostname: 'hooks.slack.com',
    port: 443,
    method: 'POST',
    path: `/services/${path}`,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': postData.length,
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error(`Status Code: ${res.statusCode}`));
      }

      const data = [];

      res.on('data', chunk => {
        data.push(chunk);
      });

      res.on('end', () => resolve(Buffer.concat(data).toString()));
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

try {
  main();
} catch (err) {
  core.setFailed(err.message);
}
