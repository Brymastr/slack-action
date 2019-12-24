const core = require('@actions/core');
const github = require('@actions/github');

const message = {
  blocks: [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: 'This is a plain text section block.',
      },
    },
    {
      type: 'divider',
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text:
          'This is a mrkdwn section block :ghost: *this is bold*, and ~this is crossed out~, and <https://google.com|this is a link>',
      },
    },
  ],
};

async function main() {
  const response = await axios.post(process.env.SLACK_WEBHOOK, message);
  console.log(response);
}

try {
  main();
} catch (err) {
  core.setFailed(err.message);
}
