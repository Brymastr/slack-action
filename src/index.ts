import { getInput, setFailed } from '@actions/core';
import { readFileSync } from 'fs';
import { getDefaultVariables, getInputVariables, hydrateTemplate, send } from './helpers';

async function main() {
  // get the slack block template
  const messageDir = getInput('template');
  const template = readFileSync(messageDir, 'utf8');

  // merge input parameters with default variables
  const inputVariables = getInputVariables();
  const defaultVariables = getDefaultVariables();
  const variables = inputVariables.concat(defaultVariables);

  // search and replace template hooks
  const message = hydrateTemplate(template, variables);

  // send the request
  const slackChannel = process.env.SLACK_WEBHOOK.match(/services\/(.*)/)[1];
  await send(message, slackChannel);
}

main().catch(({ message }) => setFailed(message));
