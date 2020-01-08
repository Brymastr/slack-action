# slack-action

Send fully custom slack messages

## Usage

### Example

```yaml
name: Build

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1

      - uses: Brymastr/slack-action@v0.0.1
        name: Slack notification
        env:
          SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
        with:
          template: './.github/workflows/message-template.json'
          job_status: ${{ job.status }}
          commit: ${{ github.sha }}
          ref: ${{ github.ref }}
          event: ${{ github.event_name }}
          repo: ${{ github.repository }}
```
