require('@babel/register')({
  ignore: [ /(node_modules)/ ],
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    // ["@babel/preset-typescript", { isTSX: true, allExtensions: true }]
  ],
  plugins: ['dynamic-import-node'],
  cache: true,
});

require('./index');