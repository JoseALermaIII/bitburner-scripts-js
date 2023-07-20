From the [vscodium.com](https://vscodium.com/) page:

> VSCodium is a community-driven, freely-licensed binary distribution of Microsoft’s editor VS Code.

Not only that, but it also disables telemetry. This custom build also means that it lacks the online account and syncing feature, but it's a small price to pay for privacy.

It's also missing Microsoft's VS Code Marketplace (and their proprietary tools/extensions), but there are [ways around it](https://github.com/VSCodium/vscodium/blob/master/DOCS.md#howto-vscode-marketplace), albeit [legally questionable](https://github.com/microsoft/vscode/issues/31168).

Otherwise, it's exactly the same as VS Code, with an independent extension gallery and [process for migrating from VS Code](https://github.com/VSCodium/vscodium/blob/master/DOCS.md#migrating).

### Windows Setup
Similar to my [Python environment](https://josealermaiii.github.io/python-tutorials/getting_started/installation.html), I like to use [PortableApps.com Platform](https://portableapps.com/download), to create a portable base environment.

This necessitates going with [portable mode](https://github.com/VSCodium/vscodium/blob/master/DOCS.md#how-do-i-run-vscodium-in-portable-mode) in a subfolder like, `X:\PortableApps\VSCodium_x64`.

For Windows and Linux, it's the same as [VS Code's portable mode guide](https://code.visualstudio.com/docs/editor/portable). There's a note in VSCodium's guide for a file path difference for those wondering about macOS.

From there, we can keep up with the portable theme by installing embeddable versions of the software we need.

#### Node.js

Luckily, Node.js already offers a zip file on their [downloads page](https://nodejs.org/en/download/).

To integrate it with our portable platform, it's easy to extract it into a folder, like `X:\PortableApps\CommonFiles\node-v16.14.2-win-x64\`. If you want different versions of Node.js, you can make different folders e.g. `node-v8.17.0-win-x64`, `node-v16.14.2-win-x86`, `node-v17.7.2-win-x64`.

A great thing about VSCodium is that the `bitburner-scrips-js` repo already has the [settings.json file](https://github.com/JoseALermaIII/bitburner-scripts-js/blob/master/.vscode/settings.json) from the `.vscode` folder that shows how to get it to find the portable Node.js installation:

```
    "debug.javascript.defaultRuntimeExecutable": {
        "pwa-node": "X:\\PortableApps\\CommonFiles\\node-v16.14.2-win-x64\\node.exe"
    },
```

Now that we have a JavaScript runtime, some versioning would be nice.

#### Git
Believe it or not, Git does offer a *Portable ("thumbdrive edition")* on their [downloads page](https://git-scm.com/download/win), which can be installed somewhere like, `X:\PortableApps\CommonFiles\PortableGit\`.

Getting it to work with VSCodium requires a bit more effort. The [settings.json file](https://github.com/JoseALermaIII/bitburner-scripts-js/blob/master/.vscode/settings.json) already includes these lines to help when running a terminal from within VSCodium:

```
    "terminal.integrated.defaultProfile.windows": "Command Prompt",
    "terminal.integrated.env.windows":{
        "PATH":"${env:PATH};X:\\PortableApps\\CommonFiles\\node-v16.14.2-win-x64\\;X:\\PortableApps\\CommonFiles\\PortableGit\\bin\\",
    },
```

VSCodium has built-in git versioning extensions, so including the above also helps it find the git executable.

#### ESLint
ESLint is a JavaScript linter that does code analysis to fix syntax issues and provide suggestions following a predefined and customizable set of standards. It's a great start if a style guide hasn't been set.

I recommend installing the [vscode-eslint extension](https://open-vsx.org/extension/dbaeumer/vscode-eslint) for linting. It separately needs to know where node.js is. So, add the following to the `User/settings.json` file:

```
    "eslint.nodePath": "X:\\PortableApps\\CommonFiles\\node-v16.13.1-win-x64\\node.exe",
```

#### Bitburner VSCode Integration
Optionally, the [bitburner-vscode-integration extension](https://marketplace.visualstudio.com/items?itemName=bitburner.bitburner-vscode-integration) is a helper extension that automatically uploads scripts to the running Bitburner instance after editing them on the computer, bypassing the in-game editor.

The GitHub repo has additional instructions for [getting the authentication token](https://github.com/bitburner-official/bitburner-vscode#authentication) and adding it to the extension.

For the purposes of this guide, the extension needs to know the directory containing the bitburner scripts. Again, the included [settings.json file](https://github.com/JoseALermaIII/bitburner-scripts-js/blob/master/.vscode/settings.json) from the `.vscode` folder already has the repo's directory:

```
    "bitburner.scriptRoot": "./src/",
```