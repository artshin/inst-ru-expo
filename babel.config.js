module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
          alias: {
            "@/navigation": "./src/Navigation",
            "@/components": "./src/Components",
            "@/containers": "./src/Containers",
            "@/contexts": "./src/Contexts",
            "@/utils": "./src/Utils",
            "@/api": "./src/API",
            "@/hooks": "./src/Hooks",
          },
        },
      ],
    ],
  };
};
