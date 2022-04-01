module.exports = {
  presets: ['@expo/next-adapter/babel'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '^@app/(.+)': './src/\\1',
        },
      },
    ],
  ],
}
