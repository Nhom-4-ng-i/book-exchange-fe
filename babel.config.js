module.exports = function (api) {
  const isTest = api.env('test');
  
  // Enable caching for better performance
  api.cache(true);
  
  const presets = [
    'babel-preset-expo',
    '@babel/preset-typescript',
    '@babel/preset-react',
  ];

  // Only add @babel/preset-env for test environment
  if (isTest) {
    presets.unshift([
      '@babel/preset-env',
      {
        targets: { node: 'current' },
        modules: 'commonjs',
      },
    ]);
  }

  const plugins = [];

  return {
    presets,
    plugins,
  };
};