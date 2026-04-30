module.exports = function (api) {
  const isJest = api.env('test');
  api.cache(isJest ? false : true);

  if (isJest) {
    return {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        ['@babel/preset-react', { runtime: 'automatic' }],
        ['@babel/preset-typescript', { allowDeclareFields: true }],
      ],
      plugins: [
        '@babel/plugin-transform-flow-strip-types',
        ['@babel/plugin-transform-private-methods', { loose: true }],
      ],
    };
  }

  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: ['react-native-reanimated/plugin'],
  };
};
