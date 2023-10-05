/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as github from '@actions/github'
import * as main from '../main'
import * as handlers from '../handlers'

// Mock the GitHub Actions core library
const debugMock = jest.spyOn(core, 'debug')
const infoMock = jest.spyOn(core, 'info')
const errorMock = jest.spyOn(core, 'error')
const getInputMock = jest.spyOn(core, 'getInput')
const getBooleanInputMock = jest.spyOn(core, 'getBooleanInput')
const setFailedMock = jest.spyOn(core, 'setFailed')

// Handlers mock
const checkOnChangesMock = jest.spyOn(handlers, 'checkOnChanges')
const runWebhookMock = jest
  .spyOn(handlers, 'runWebhook')
  .mockImplementation(() => Promise.resolve())

const parseChangelogFileMock = jest
  .spyOn(handlers, 'parseChangelogFile')
  .mockImplementation(() =>
    Promise.resolve({
      json: { versions: [], version: '1.0.0', title: '', description: '' },
      md: 'markdown content'
    })
  )

const githubOctokitMock = jest
  .spyOn(github, 'getOctokit')
  .mockImplementation(() => ({}) as handlers.Octokit)

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('Should skip running if there are no changes in CHANGELOG.md', async () => {
    getInputMock.mockImplementation((name: string) => 'some value')
    getBooleanInputMock.mockImplementation((name: string) => false)
    checkOnChangesMock.mockImplementation(() => Promise.resolve(false))

    await main.run()
    expect(runWebhookMock).not.toHaveBeenCalled()
    expect(runMock).toHaveReturned()
  })

  it('Should skip running if there are not provided `github-token`', async () => {
    getInputMock.mockImplementation((name: string) => {
      if (name === 'github-token') {
        // according to core.getInput it throws an error if required value haven't provided
        throw new Error('error')
      }
      return 'some value'
    })
    checkOnChangesMock.mockImplementation(() => Promise.resolve(true))

    await main.run()
    expect(runMock).toHaveReturned()
    expect(runWebhookMock).not.toHaveBeenCalled()
    expect(checkOnChangesMock).not.toHaveBeenCalled()
    expect(setFailedMock).toHaveBeenCalled()
  })

  it('Should skip running if there are not provided `webhook`', async () => {
    getInputMock.mockImplementation((name: string) => {
      if (name === 'webhook') {
        // according to core.getInput it throws an error if required value haven't provided
        throw new Error('error')
      }
      return 'some value'
    })
    checkOnChangesMock.mockImplementation(() => Promise.resolve(true))

    await main.run()
    expect(runMock).toHaveReturned()
    expect(runWebhookMock).not.toHaveBeenCalled()
    expect(checkOnChangesMock).not.toHaveBeenCalled()
    expect(setFailedMock).toHaveBeenCalled()
  })

  it('Should run if there are changes in CHANGELOG.md', async () => {
    checkOnChangesMock.mockImplementation(() => Promise.resolve(true))
    getBooleanInputMock.mockImplementation((name: string) => {
      return name === 'always' ? false : true
    })
    getInputMock.mockImplementation((name: string): string => 'some value 1111')

    await main.run()
    expect(runWebhookMock).toHaveBeenCalled()
    expect(parseChangelogFileMock).toHaveBeenCalled()
    expect(setFailedMock).not.toHaveBeenCalled()
  })

  it('Should run if there are no any changes in CHANGELOG.md, but `always` = true', async () => {
    checkOnChangesMock.mockImplementation(() => Promise.resolve(false))
    getInputMock.mockImplementation((name: string): string => 'some value')
    getBooleanInputMock.mockImplementation((name: string) => {
      return name === 'always' ? true : true
    })

    await main.run()
    expect(runWebhookMock).toHaveBeenCalled()
    expect(parseChangelogFileMock).toHaveBeenCalled()
    expect(setFailedMock).not.toHaveBeenCalled()
  })
})
