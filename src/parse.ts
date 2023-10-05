import parseChangelog from 'changelog-parser'

/**
 *
 * @param input file or file content
 * @returns
 */
export const parse = async (input: Buffer | string) => {
  const content = input instanceof Buffer ? input.toString() : input

  const parsedFile = await parseChangelog({
    text: content
  })

  return parsedFile
}
