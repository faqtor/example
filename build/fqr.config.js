const { seq, cmd } = require("faqtor")

// Factor produced by 'minify' will perform javascript minification:
const { minify } = require("faqtor-of-uglify");

// Factor produced by 'render' will run our HTML template:
const { render } = require("faqtor-of-handlebars");

// Factor to watch changes in files:
const { watch } = require("faqtor-of-watch");

// 'bs' can produce factors for usual browser-sync tasks, like 'reload' for example:
const bs = require("faqtor-of-browser-sync").create();

const
    makeDistFolder = cmd("mkdirp dist/js"),
    devMakeIndexHtml = render("src/template.html", "src/index.html", {
            indexJS: "src/index.js"
        }),
    prodMakeIndexHtml = render("src/template.html", "dist/index.html", {
            indexJS: "js/index.js"
        }),
    uglifyIndexJS = minify("src/index.js", "dist/js/index.js"),
    reloadBrowserPage = bs.reload("src/**/*");

module.exports = {
    build: seq(makeDistFolder, uglifyIndexJS, prodMakeIndexHtml),
    serve: seq(devMakeIndexHtml, all(
        bs.init({baseDir: "src"}),
        watch([devMakeIndexHtml, reloadBrowserPage])
    )),
    clean: cmd("rimraf dist src/index.html")
}

