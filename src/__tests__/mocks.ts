export const expectedSimpleChangelogJSON = {
  versions: [
    {
      version: '1.3.0',
      title: '1.3.0',
      date: null,
      body: '### Bug Fixes\n\n- Fix bug 5\n- Fix bug 6\n\n### New Features\n\n- New Feature 5\n- New Feature 6',
      parsed: {
        _: ['Fix bug 5', 'Fix bug 6', 'New Feature 5', 'New Feature 6'],
        'Bug Fixes': ['Fix bug 5', 'Fix bug 6'],
        'New Features': ['New Feature 5', 'New Feature 6']
      }
    },
    {
      version: '1.2.0',
      title: '[1.2.0] - 2023-09-15',
      date: '2023-09-15',
      body: '### Bug Fixes\n\n- Fix bug 3\n- Fix bug 4\n\n### New Features\n\n- New Feature 3\n- New Feature 4',
      parsed: {
        _: ['Fix bug 3', 'Fix bug 4', 'New Feature 3', 'New Feature 4'],
        'Bug Fixes': ['Fix bug 3', 'Fix bug 4'],
        'New Features': ['New Feature 3', 'New Feature 4']
      }
    },
    {
      version: '1.1.5',
      title: '1.1.5 - 2023-05-25',
      date: '2023-05-25',
      body: '### Bug Fixes\n\n- Fix bug 1\n- Fix bug 2\n\n### New Features\n\n- New Feature 1\n- New Feature 2',
      parsed: {
        _: ['Fix bug 1', 'Fix bug 2', 'New Feature 1', 'New Feature 2'],
        'Bug Fixes': ['Fix bug 1', 'Fix bug 2'],
        'New Features': ['New Feature 1', 'New Feature 2']
      }
    }
  ],
  title: 'Test Library',
  description: 'Simple Changelog.md for unit test'
}
