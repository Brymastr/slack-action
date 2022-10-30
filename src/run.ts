const props = {
  GITHUB_SHA: 'j8su904nyr4839',
  GITHUB_REPOSITORY: 'slack-action',
  GITHUB_REF: 'refs/heads/dev',
  GITHUB_REF_NAME: 'feature/test',
  GITHUB_HEAD_REF: 'refs/heads/dev',
  GITHUB_BASE_REF: 'refs/heads/feature',
  GITHUB_ACTOR: 'brymastr',
  GITHUB_WORKFLOW: 'Build and Deploy',
  GITHUB_EVENT_NAME: 'push',
  GITHUB_RUN_NUMBER: 'ny7348d',
  GITHUB_RUN_ID: '2062177805',

  INPUT_KEY1: 'key1 value',

  INPUT_TEMPLATE: './examples/simple/message-template.json',
  SLACK_WEBHOOK: process.env.SLACK_WEBHOOK,
};

process.env = { ...props };

import main from './index';
main;
