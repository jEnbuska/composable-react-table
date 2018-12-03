module.exports = {
    testEnvironment: 'node',
    rootDir: '.',
    transform: {
        "^.+\\.ts$": "ts-jest"
    },
    testMatch: ["<rootDir>/src/**/*test.ts"],
    moduleFileExtensions: [
        "ts",
        "js"
    ],
};
