import { getDefaultVariables, getInputVariables, hydrateTemplate } from './helpers';

describe('getDefaultVariables', () => {
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
  };

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...props };
  });

  test('expected return values', () => {
    const expected = [
      ['commit', 'j8su904nyr4839'],
      ['repo', 'slack-action'],
      ['ref', 'refs/heads/dev'],
      ['ref_name', 'feature/test'],
      ['head_ref', 'refs/heads/dev'],
      ['base_ref', 'refs/heads/feature'],
      ['actor', 'brymastr'],
      ['workflow', 'Build and Deploy'],
      ['event', 'push'],
      ['run_number', 'ny7348d'],
      ['repo_url', 'https://github.com/slack-action'],
      ['branch_url', 'https://github.com/slack-action/tree/feature/test'],
      ['actions_url', 'https://github.com/slack-action/commit/j8su904nyr4839/checks'],
      ['run_url', 'https://github.com/slack-action/actions/runs/2062177805'],
      ['title', 'custom title'],
    ];

    const actual = getDefaultVariables();

    expect(actual).toStrictEqual(expected);
  });
});

describe('getInputVariables', () => {
  const props = {
    INPUT_VAR1: 'var1_value',
    INPUT_VAR2: 'var2_value',
    INPUT_VAR3: 'var3_value',
  };

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...props };
  });

  test('input values present', () => {
    const expected = [
      ['var1', 'var1_value'],
      ['var2', 'var2_value'],
      ['var3', 'var3_value'],
    ];

    const actual = getInputVariables();

    expect(actual).toStrictEqual(expected);
  });

  test('extra unrelated values not included', () => {
    process.env.UNRELATED_VAR4 = 'var4_value';

    const expected = [
      ['var1', 'var1_value'],
      ['var2', 'var2_value'],
      ['var3', 'var3_value'],
    ];

    const actual = getInputVariables();

    expect(actual).toStrictEqual(expected);
  });
});

describe('hydrateTemplate', () => {
  const templateString =
    '{"blocks":[{"type":"section","text":{"type":"mrkdwn","text":"*GitHub Actions Build* {{ job_status }}\\n_<{{ repo_url }}/commit/{{ commit }}|{{ commit }}>_"},"accessory":{"type":"button","text":{"type":"plain_text","text":"View workflow","emoji":true},"url":"{{ actions_url }}"}},"accessory":{"type":"button","text":{"type":"plain_text","text":"View run","emoji":true},"url":"{{ run_url }}"}},{"type":"divider"},{"type":"section","fields":[{"type":"mrkdwn","text":"*Repo:*\\n<{{ repo_url }}|{{ repo }}>"},{"type":"mrkdwn","text":"*Status:*\\n{{ job_status }}"},{"type":"mrkdwn","text":"*Ref:*\\n{{ ref }}"},{"type":"mrkdwn","text":"*Event:*\\n{{ event }}"}]}]}';

  test('template variables replaced', () => {
    const variables = [
      ['job_status', 'Success'],
      ['commit', 'j8su904nyr4839'],
      ['repo', 'slack-action'],
      ['ref', 'refs/heads/dev'],
      ['ref_name', 'feature/test'],
      ['head_ref', 'refs/heads/dev'],
      ['base_ref', 'refs/heads/feature'],
      ['actor', 'brymastr'],
      ['workflow', 'Build and Deploy'],
      ['event', 'push'],
      ['run_number', 'ny7348d'],
      ['repo_url', 'https://github.com/slack-action'],
      ['branch_url', 'https://github.com/slack-action/tree/feature/test'],
      ['actions_url', 'https://github.com/slack-action/commit/j8su904nyr4839/checks'],
      ['run_url', 'https://github.com/slack-action/actions/runs/2062177805'],
      ['title', 'custom title'],
    ];

    const expected =
      '{"blocks":[{"type":"section","text":{"type":"mrkdwn","text":"*GitHub Actions Build* Success\\n_<https://github.com/slack-action/commit/j8su904nyr4839|j8su904nyr4839>_"},"accessory":{"type":"button","text":{"type":"plain_text","text":"View workflow","emoji":true},"url":"https://github.com/slack-action/commit/j8su904nyr4839/checks"}},"accessory":{"type":"button","text":{"type":"plain_text","text":"View run","emoji":true},"url":"https://github.com/slack-action/actions/runs/2062177805"}},{"type":"divider"},{"type":"section","fields":[{"type":"mrkdwn","text":"*Repo:*\\n<https://github.com/slack-action|slack-action>"},{"type":"mrkdwn","text":"*Status:*\\nSuccess"},{"type":"mrkdwn","text":"*Ref:*\\nrefs/heads/dev"},{"type":"mrkdwn","text":"*Event:*\\npush"}]}]}';

    const actual = hydrateTemplate(templateString, variables);

    expect(actual).toEqual(expected);
  });
});
