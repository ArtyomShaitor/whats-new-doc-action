import fs from 'node:fs/promises'
import * as github from '@actions/github'
import * as core from '@actions/core'
import { parse } from './parse'

export type Octokit = ReturnType<typeof github.getOctokit>

export const parseChangelogFile = async (changelogPath: string) => {
  const file = await fs.readFile(changelogPath)

  const md = file.toString()
  const json = await parse(file)

  return { json, md }
}

export const checkOnChanges = async (
  changelogPath: string,
  octokit: Octokit
) => {
  const commits = await octokit.rest.repos.listCommits({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    path: changelogPath
  })

  const isFileChanged = commits.data.length > 0

  return isFileChanged
}

export const runWebhook = async (
  changeLogJson: any,
  webhook: string,
  octokit: Octokit
) => {
  core.info(`Sending request: \`POST ${webhook}\` ...`)

  await octokit.request({
    method: 'POST',
    url: webhook,
    headers: {
      'X-Whats-New-Doc-Signature': 'sadasdsa'
    },
    body: {
      changelog: changeLogJson
    }
  })
}
