import fs from 'node:fs/promises'
import { parse } from '../parse'
import { expectedSimpleChangelogJSON } from './mocks'

describe('"parse" module', () => {
  describe('should return CHANGELOG in JSON format', () => {
    it('with file as input', async () => {
      const file = await fs.readFile(
        `${__dirname}/../../changelogs-examples/simple/CHANGELOG.md`
      )
      const result = await parse(file)
      expect(result).toStrictEqual(expectedSimpleChangelogJSON)
    })

    it('with text as input', async () => {
      const file = await fs.readFile(
        `${__dirname}/../../changelogs-examples/simple/CHANGELOG.md`
      )
      const string = file.toString()
      const result = await parse(string)
      expect(result).toStrictEqual(expectedSimpleChangelogJSON)
    })
  })
})
