# slack-action

![Build](https://github.com/Brymastr/slack-action/workflows/Build/badge.svg)

Send custom slack messages given a slack block template

## Usage

```yaml
- uses: Brymastr/slack-action@v1
  name: Slack notification
  env:
    SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
  with:
    template: './template.json'
    example_key1: example value 1
    job_status: ${{ job.status }}
```

`template.json`

```json
{
  "blocks": [
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "Example: {{ example_key1 }} and {{ job_status }}"
      }
    }
  ]
}
```

Use of this action requires a GitHub secret called `SLACK_WEBHOOK`. The value should include the channel id and look something like one of these:

- `https://hooks.slack.com/services/11111ZZZZ/22222XXXX/1a2B3c4e5F6G7h8I9j0k`
- `11111ZZZZ/22222XXXX/1a2B3c4e5F6G7h8I9j0k`

See [Creating and using encrypted secrets](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets) for assistance with GitHub Secrets.

See [Sending messages using Incoming Webhooks](https://api.slack.com/messaging/webhooks) for assistance with Slack Webhooks.

### Required Arguments

- **`SLACK_WEBHOOK`** - provided as an `env` variable, this is the full webhook url for your bot channel.
- **`template`** - provided in the `with` args, is the path to the message template json file. This path should be relative from the project root.

### Optional Arguments

Any other custom arguments can be provided and will be included in the template. From the example above all occurrences of `{{ example_key1 }}` in the `template.json` file will be replace with `example value 1`.  
**NOTE:** template names in the json file must be lower case.

## Default and Computed Properties

Most `github` context properties are included by default without needing to pass them in through a `with` argument. Some properties have been renamed to make a bit more sense. See [Contexts](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/contexts-and-expression-syntax-for-github-actions#contexts) for more info.

| Property Name       | Replacement Variable |
| ------------------- |----------------------|
| `github.sha`        | `commit`             |
| `github.repository` | `repo`               |
| `github.ref`        | `ref`                |
| `github.ref_name`   | `ref_name`           |
| `github.head_ref`   | `head_ref`           |
| `github.base_ref`   | `base_ref`           |
| `github.actor`      | `actor`              |
| `github.event_name` | `event`              |
| `github.workflow`   | `workflow`           |

In addition to these github context properties there are 5 computed properties that could be useful

| Replacement Variable | Description                                               |
|----------------------|-----------------------------------------------------------|
| `repo_url`           | the URL of the github repo                                |
| `branch_url`         | the URL of the github repo with branch                    |
| `actions_url`        | the URL of the github actions workflow run for the commit |
| `run_url`            | the URL of the github actions workflow run                |
| `title`              | Notification title                                        |

## Notes

Check out the [examples](examples/) directory for some examples

Try the Slack [Block Kit Builder](https://api.slack.com/tools/block-kit-builder) for message template inspiration

## Motivation

Slack notifications are a common feature in automated build pipelines. There are already a few existing GitHub Actions that send slack messages but most use a predetermined format and only allow for title or subject customization. This action allows for full block customization. I would like this action to serve as a simple, solid, and customizable slack notification action with as few dependencies as possible.

## Alternatives

- [abinoda/slack-action](https://github.com/abinoda/slack-action) - works by providing the slack block body as stringified JSON directly in the workflow yaml (messy)
- [homoluctus/slatify](https://github.com/homoluctus/slatify)
- [rtCamp/action-slack-notify](https://github.com/rtCamp/action-slack-notify)
- [8398a7/action-slack](https://github.com/8398a7/action-slack)
- [pullreminders/slack-action](https://github.com/pullreminders/slack-action) - simpler, just provide json stringified message content
- [krider2010/slack-bot-action](https://github.com/krider2010/slack-bot-action) - using the old HCL syntax
- [apex/actions/slack](https://github.com/apex/actions/tree/master/slack) - using the old HCL syntax
- [ivanklee86/xunit-slack-reporter](https://github.com/ivanklee86/xunit-slack-reporter) - not exactly the same purpose
