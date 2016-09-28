## newsrollup-webpart

### Pre reqs
If testing on SharePoint then create a list in your site called "News" and add 2 columns - ImageUrl (Hyperlink) and Byline (Single line of text)
After that add a couple of items for testing

### Building the code

```bash
git clone the repo
npm i
npm i -g gulp
gulp
```

This package produces the following:

* lib/* commonjs components - this allows this package to be reused from other packages.
* dist/* - a single bundle containing the components used for uploading to a cdn pointing a registered Sharepoint webpart library to.
* example/* a test page that hosts all components in this package.

### Build options

gulp nuke - TODO
gulp test - TODO
gulp watch - TODO
gulp build - TODO
gulp deploy - TODO
