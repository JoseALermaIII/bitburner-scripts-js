There are many ways to install and use Node.js depending on the platform and IDE (Integrated Development Environment) — if any. These docs cover the methods I frequently use.

### Windows
For Windows, I ended up going with {@tutorial vscodium_setup} because it's more updated; however, I give [Atom.io](https://atom.io/) an honorable mention.

Atom is similar to VSCodium, but it's not as focused on JavaScript programming. There are packages to help with this, but VSCodium's extension gallery is more updated and extensive. Regardless, they're both light and have a portable configuration available.

I'm sure [WebStorm](https://www.jetbrains.com/webstorm/) would be even more extensible and full-featured than VSCodium, but I'm equally confident it'll be far more resource-heavy.

After Node.js and your IDE of choice are installed, run `npm install --production` in the `bitburner-scripts-js` folder.

### Building Documentation
**Note:**
> Building the documentation is **not needed or recommended** unless contributing to the documentation.
> 
> The latest version of the documentation is available at [josealermaiii@github.io/bitburner-scripts-js](https://github.com/JoseALermaIII/bitburner-scripts-js).
> 
> You have been warned.

Building the docs requires a few more npm packages that are installed with `npm install`:

* @babel/eslint-parser
* jsdoc

Now, we can build the docs in HTML format:

```
    npx jsdoc -c ./conf.js
```

This will save the docs website in `../../bitburner-scripts-js-docs/`.

**Tip:**
> If you followed [[vscodium_setup|VSCodium Setup]], this can be run as the `npm: doc` task under **Terminal > Run Task...**.

### Disclaimer
Though covered by the MIT License, I reiterate: executable programs written from code on the Internet can end up doing bad things.

> Read and understand all code you copy and paste before running it.