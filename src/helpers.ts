import { IncomingMessage } from 'http';
import { RequestOptions, request } from 'https';

/**
 * Get all default environment variables provided by the github actions sdk
 * https://docs.github.com/en/actions/reference/environment-variables#default-environment-variables
 */
export function getDefaultVariables() {
  const commit = process.env.GITHUB_SHA;
  const repo = process.env.GITHUB_REPOSITORY;
  const ref = process.env.GITHUB_REF;
  const refName = process.env.GITHUB_REF_NAME;
  const headRef = process.env.GITHUB_HEAD_REF;
  const baseRef = process.env.GITHUB_BASE_REF;
  const actor = process.env.GITHUB_ACTOR;
  const workflowName = process.env.GITHUB_WORKFLOW;
  const eventName = process.env.GITHUB_EVENT_NAME;
  const runNumber = process.env.GITHUB_RUN_NUMBER;
  const runId = process.env.GITHUB_RUN_ID;
  const repoUrl = `https://github.com/${repo}`;
  const branchUrl = `https://github.com/${repo}/tree/${refName}`;
  const actionsUrl = `${repoUrl}/commit/${commit}/checks`;
  const runUrl = `${repoUrl}/actions/runs/${runId}`;
  const title = 'custom title';

  const defaultVariables: [string, string][] = [
    ['commit', commit],
    ['repo', repo],
    ['ref', ref],
    ['ref_name', refName],
    ['head_ref', headRef],
    ['base_ref', baseRef],
    ['actor', actor],
    ['workflow', workflowName],
    ['event', eventName],
    ['run_number', runNumber],
    ['repo_url', repoUrl],
    ['branch_url', branchUrl],
    ['actions_url', actionsUrl],
    ['run_url', runUrl],
    ['title', title],
  ];

  return defaultVariables;
}

/**
 * Get all variables provided by the github actions workflow job step
 * Input variables are those in the `with` section and are injected as environment
 * variables starting with `INPUT_`
 */
export function getInputVariables() {
  return Object.entries(process.env)
    .filter(x => x[0].startsWith('INPUT_'))
    .map(([k, v]) => [k.replace('INPUT_', '').toLowerCase(), v]);
}

/**
 * Search and replace template variables
 */
export function hydrateTemplate(template: string, variables: string[][]) {
  let message = template;
  for (const [k, v] of variables) {
    const regex = new RegExp('{{ *' + k + ' *}}', 'g');
    message = message.replace(regex, v);
  }
  return message;
}

/**
 * Send the slack message
 */
export function send(body: string, channel: string): Promise<string> {
  const options: RequestOptions = {
    hostname: 'hooks.slack.com',
    port: 443,
    method: 'POST',
    path: `/services/${channel}`,
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': body.length,
    },
  };

  return new Promise((resolve, reject) => {
    function handleResponse(response: IncomingMessage) {
      if (response.statusCode < 200 || response.statusCode >= 300) {
        return reject(new Error(`Status Code: ${response.statusCode}`));
      }

      const data: any[] = [];

      response.on('data', chunk => {
        data.push(chunk);
      });

      response.on('end', () => resolve(Buffer.concat(data).toString()));
    }

    const req = request(options, handleResponse);

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}
