# What's new, Doc? GitHub Action

This action checks changes in CHANGELOG.md file and sends it to the provided
webhook.

## Inputs

### `github-token`

**Required** Your GitHub Token.

### `webhook`

**Required** Webhhok URL that will be triggered.

### `changelog-path`

**Required** Path to your CHANGELOG.md file. Default value: `./CHANGELOG.md`.

### `always`

Run the action regardless of whether there are changes in the CHANGELOG.md or
not. Default value `false`.

## Outputs

### `json`

CHANGELOG in JSON

### `md`

CHANGELOG in Markdown syntax

## Example usage

```yaml
uses: actions/whats-new-doc@v1
with:
  github-token: ${{ secrets.GITHUB_TOKEN }}
  changelog-path: ./CHANGELOG.md
  webhook: 'https://your-api-server.com/changelog-webhook'
```
