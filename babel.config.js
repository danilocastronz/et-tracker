module.exports = function (api) {
  const isJest = api.env('test');
  api.cache(isJest ? false : true);

  return {
    presets: [
      isJest
        ? ['@babel/preset-env', { targets: { node: 'current' } }]
        : ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      '@babel/preset-react',
      '@babel/preset-typescript',
    ],
    plugins: [
      !isJest && 'react-native-reanimated/plugin',
      isJest && '@babel/plugin-transform-flow-strip-types',
    ].filter(Boolean),
  };
};
