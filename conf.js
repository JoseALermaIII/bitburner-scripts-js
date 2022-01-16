'use strict';

module.exports = {
    plugins: ['plugins/markdown'],
    recurseDepth: 10,
    source: {
        "include": ["./src/legacy","./src/bin"],
        "includePattern": ".+\\.js(doc|x)?$",
        "excludePattern": "(^|\\/|\\\\)_|scrap.*\.js"
    },
    sourceType: "module",
    tags: {
        "allowUnknownTags": true,
        "dictionaries": ["jsdoc","closure"]
    },
    templates: {
        "cleverLinks": false,
        "monospaceLinks": false
    },
    opts: {
        "destination": "../bitburner-scripts-js-docs/html/",
        "recurse": true,
        "readme": "./README.md",
    }
};