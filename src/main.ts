import * as core from '@actions/core'
import * as github from '@actions/github'
import { checkOnChanges, parseChangelogFile, runWebhook } from './handlers'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const token = core.getInput('github-token', { required: true })
    const webhook = core.getInput('webhook', { required: true })
    const changelogPath = core.getInput('changelog-path', { required: false })
    const isAlways = core.getBooleanInput('always', { required: false })

    const octokit = github.getOctokit(token)

    const isRunWebhook = isAlways
      ? true
      : await checkOnChanges(changelogPath, octokit)

    if (!isRunWebhook) {
      core.info('CHANGELOG.md was not changed, finishing...')
      return
    }

    const { json, md } = await parseChangelogFile(changelogPath)

    console.log(JSON.stringify(json, null, '  '))

    await runWebhook(json, webhook, octokit)

    core.setOutput('json', json)
    core.setOutput('md', md)

    core.info('Done ✅')
  } catch (error) {
    core.error('Something went wrong:')
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
