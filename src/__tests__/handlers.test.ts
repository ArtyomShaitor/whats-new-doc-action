import fs from 'node:fs/promises'
import { Context } from '@actions/github/lib/context'
import * as handlers from '../handlers'
import type { Octokit } from '../handlers'
import * as parse from '../parse'

const parseMock = jest.spyOn(parse, 'parse').mockImplementation(() =>
  Promise.resolve({
    version: '1.0.0',
    title: 'Title',
    description: 'Description',
    versions: []
  })
)

const readFileMock = jest
  .spyOn(fs, 'readFile')
  .mockImplementation(() => Promise.resolve(Buffer.from('some string')))

describe('"handlers" module', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env['GITHUB_EVENT_NAME'] = 'issue_comment'
    process.env['GITHUB_SHA'] = 'some sha'
    process.env['GITHUB_REF'] = 'refs/heads/main'
    process.env['GITHUB_WORKFLOW'] = 'Issue comments'
    process.env['GITHUB_REPOSITORY'] = 'artyomshaitor/whats-new-doc-action'
    process.env['GITHUB_ACTION'] = 'whats-new-doc'
    process.env['GITHUB_ACTOR'] = 'test-user'
  })

  describe('parseChangelogFile', () => {
    it('should return { json, md } ', async () => {
      const result = await handlers.parseChangelogFile('/some-path')
      expect(result).toStrictEqual({
        json: {
          version: '1.0.0',
          title: 'Title',
          description: 'Description',
          versions: []
        },
        md: 'some string'
      })

      expect(readFileMock).toHaveBeenCalledTimes(1)
      expect(parseMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('checkOnChanges', () => {
    it('Should return `true` if there are changes in octokit', async () => {
      const listCommitsMock = jest
        .fn()
        .mockImplementation(() => Promise.resolve({ data: [{}] }))
      const octokit = {
        rest: {
          repos: {
            listCommits: listCommitsMock
          }
        }
      }

      const result = await handlers.checkOnChanges(
        '/some-path',
        octokit as unknown as Octokit
      )

      expect(result).toBe(true)
      expect(listCommitsMock).toHaveBeenCalledTimes(1)
    })

    it('Should return `false` if there are changes in octokit', async () => {
      const listCommitsMock = jest
        .fn()
        .mockImplementation(() => Promise.resolve({ data: [] }))
      const octokit = {
        rest: {
          repos: {
            listCommits: listCommitsMock
          }
        }
      }

      const result = await handlers.checkOnChanges(
        '/some-path',
        octokit as unknown as Octokit
      )

      expect(result).toBe(false)
      expect(listCommitsMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('runWebhook', () => {
    it('Should send request', async () => {
      const request = jest
        .fn()
        .mockImplementation(requestOptions => Promise.resolve(requestOptions))

      const octokit = {
        request
      } as unknown as Octokit

      await handlers.runWebhook({}, 'https://example.com/webhook', octokit)
      expect(request).toBeCalledWith({
        method: 'POST',
        url: 'https://example.com/webhook',
        headers: {
          'X-Whats-New-Doc-Signature': 'sadasdsa'
        },
        body: {}
      })
    })
  })
})
