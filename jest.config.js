module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    roots: [
        "./src"
    ],
    transform: {
        '^.+\\.(ts|tsx)?$': 'ts-jest',
        '^.+\\.(js|jsx)$': 'babel-jest',
        ".(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "./jest-config/file-mock.js",
        '.(css|less)$': './jest-config/style-mock.js'
    }
};