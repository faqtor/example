const { seq, cmd, all } = require("faqtor")

// Factor produced by 'minify' will perform javascript minification:
const { minify } = require("faqtor-of-uglify");

// Factor produced by 'render' will run our HTML template:
const { render } = require("faqtor-of-handlebars");

// Factor to watch changes in files:
const { watch } = require("faqtor-of-watch");

// 'bs' can produce factors for usual browser-sync tasks, like 'reload' for example:
const bs = require("faqtor-of-browser-sync").create();

// In this block we create elementary blocks of our building process:
const
    // create 'dist' and 'dist/js' folders if they don't exist:
    makeDistFolder = cmd("mkdirp dist/js"),
    // create development version of 'index.html' using handlebars:
    devMakeIndexHtml = render("src/template.html", "src/index.html", {
            indexJS: "./index.js"
        }),
    // create production version of 'index.html' using handlebars:
    prodMakeIndexHtml = render("src/template.html", "dist/index.html", {
            indexJS: "js/index.js"
        }),
    // minify 'index.js' for production
    uglifyIndexJS = minify("src/index.js", "dist/js/index.js"),
    // reload browsers if something on page has changed
    reloadBrowserPage = bs.reload("src/index.*");

module.exports = {
    // entry 'build' to call from 'package.json/scripts': fqr build
    // 'seq' is sequence of tasks, analog of bash && operator
    build: seq(makeDistFolder, uglifyIndexJS, prodMakeIndexHtml),
    // entry 'serve' to call from 'package.json/scripts': fqr serve
    // watch for changes and reload page if necessary
    serve: seq(devMakeIndexHtml, all(
        bs.init({ server: { baseDir: "src" } }),
        watch([devMakeIndexHtml, reloadBrowserPage])
    )),
    // entry 'clean' to call from 'package.json/scripts': fqr clean
    clean: cmd("rimraf dist src/index.html")
}

