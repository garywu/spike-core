const test = require('ava')
const {compileFixture} = require('./_helpers')

test('uses app.js configuration', (t) => {
  return compileFixture(t, 'app_config').then(({res}) => {
    t.truthy(res.stats.compilation.options.entry.foo[0] === 'override')
  })
})

test('API config overrides app.js config', (t) => {
  return compileFixture(t, 'app_config', { entry: { foo: 'double override' } }).then(({res}) => {
    t.truthy(res.stats.compilation.options.entry.foo[0] === 'double override')
  })
})

test('API config merges properly with app.js config', (t) => {
  return compileFixture(t, 'app_config', { entry: { bar: 'double override' } }).then(({res}) => {
    t.truthy(res.stats.compilation.options.entry.baz[0] === 'override')
    t.truthy(res.stats.compilation.options.entry.bar[0] === 'double override')
  })
})

test('throws error for invalid app.js syntax', (t) => {
  return t.throws(() => compileFixture(t, 'app_config_error'), /Error: wow/)
})

test('does not allow certain options to be configured', (t) => {
  return compileFixture(t, 'app_config', { context: 'override!' })
    .then(({res}) => {
      t.truthy(res.stats.compilation.options.context !== 'override!')
    })
})

test('passing options to loaders', (t) => {
  return compileFixture(t, 'app_config', {
    postcss: { plugins: ['wow'], foo: 'bar' }
  }).then(({res}) => {
    const opts = res.stats.compilation.options
    const cssLoader = opts.module.rules.find((r) => r._core === 'css')
    t.is(cssLoader.use[1].options.foo, 'bar')
  })
})

test('allows typeof string for entry object\'s value', (t) => {
  return compileFixture(t, 'app_config', { entry: { 'js/main': './js/index.js' } })
    .then(({res}) => {
      t.truthy(Array.isArray(res.stats.compilation.options.entry['js/main']))
    })
})
