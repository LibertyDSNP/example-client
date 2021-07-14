module.exports = {
    globals: {
      "ts-jest": {
        tsconfig: "tsconfig.json",
      },
    },
    moduleFileExtensions: ["ts", "js"],
    testMatch: ["**/test/**/*.test.(ts|js)"],
    testEnvironment: "node",
  };
  