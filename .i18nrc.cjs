module.exports = {
  markdown: {
    entry: ['./docs/**/!(*.*).md', './!(*.*).md'],
    entryLocale: 'zh-CN',
    entryExtension: '.md',
    outputLocales: ['en-US'],
    // outputExtensions: (locale, { getDefaultExtension }) => {
    //   if (locale === 'en-US') return '.md';
    //   return getDefaultExtension(locale);
    // },
  },
  modelName: 'gpt-4.1-nano'
};