const sass = require('./src/_config/scss.js');
sass('./src/assets/styles/main.scss', './src/_includes/css/main.css');
const cleanCSS = require("clean-css");
const fs = require("fs");
const pluginRSS = require("@11ty/eleventy-plugin-rss");
const localImages = require("eleventy-plugin-local-images");
const lazyImages = require("eleventy-plugin-lazyimages");

const sass = require('./config/sass-process.js');


var moment = require('moment-timezone');

module.exports = (function(eleventyConfig) {

    eleventyConfig.addPassthroughCopy("src/js");
    eleventyConfig.addPassthroughCopy("src/css");

    eleventyConfig.addFilter("decorate", function(text) {
        return "***"+text+"***";
    });

    eleventyConfig.addFilter("dateformat", function(dateIn) {
        return moment(dateIn).tz('GMT').format('YYYY MMMM DD, dddd, HH:MM:SS z');
    });

    return {

        dir: {
            output: "dist",
            input: "src",
            data: "jsondata",
            includes: "partials_layouts"
        },

        templateFormats: ["njk", "md"]
    };

});

module.exports = config => {
    //Watching for modificaions in style directory
    sass('./assets/_scss/main.scss', './assets/styles/main.css');
}

const htmlMinTransform = require("./src/transforms/html-min-transform.js");
const inputDir = './src';
const outputDir = './dist';
const ghostItUp = require('./src/_config/ghostitup.js');
ghostItUp();

<<<<<<< HEAD
  module.exports = eleventyConfig => {
    eleventyConfig.addWatchTarget("./src/assets/_scss/");
  };
    // copy everything in `./src/_assets` to `./public/assets`
    eleventyConfig.addPassthroughCopy(`${inputDir}/assets`, 'assets');
    eleventyConfig.addTransform("htmlmin", htmlMinTransform);
    eleventyConfig.addPlugin(pluginRSS);
      // Inline CSS
      eleventyConfig.addFilter("cssmin", code => {
      return new cleanCSS({}).minify(code).styles;
=======
// Init Ghost API
const api = new ghostContentAPI({
  url: process.env.GHOST_API_URL,
  key: process.env.GHOST_CONTENT_API_KEY,
  version: "v2"
});

// Strip Ghost domain from urls
const stripDomain = url => {
  return url.replace(process.env.GHOST_API_URL, "");
};

module.exports = function(config) {
  // Minify HTML
  config.addTransform("htmlmin", htmlMinTransform);

  // Assist RSS feed template
  config.addPlugin(pluginRSS);

  // Apply performance attributes to images


  // Copy images over from Ghost
  config.addPlugin(localImages, {
    distPath: "dist",
    assetPath: "/assets/images",
    selector: "img",
    attribute: "data-src", // Lazy images attribute
    verbose: false
  });

  // Inline CSS
  config.addFilter("cssmin", code => {
    return new cleanCSS({}).minify(code).styles;
  });

  config.addFilter("getReadingTime", text => {
    const wordsPerMinute = 200;
    const numberOfWords = text.split(/\s/g).length;
    return Math.ceil(numberOfWords / wordsPerMinute);
  });

  // Date formatting filter
  config.addFilter("htmlDateString", dateObj => {
    return new Date(dateObj).toISOString().split("T")[0];
  });

  // Don't ignore the same files ignored in the git repo
  config.setUseGitIgnore(false);

  // Get all pages, called 'docs' to prevent
  // conflicting the eleventy page object
  config.addCollection("docs", async function(collection) {
    collection = await api.pages
      .browse({
        include: "authors",
        limit: "all"
      })
      .catch(err => {
        console.error(err);
      });

    collection.map(doc => {
      doc.url = stripDomain(doc.url);
      doc.primary_author.url = stripDomain(doc.primary_author.url);

      // Convert publish date into a Date object
      doc.published_at = new Date(doc.published_at);
      return doc;
>>>>>>> f39daca1d4e9ed3fa718e495b1d565189a228f23
    });
    eleventyConfig.addFilter("getReadingTime", text => {
      const wordsPerMinute = 200;
      const numberOfWords = text.split(/\s/g).length;
      return Math.ceil(numberOfWords / wordsPerMinute);
    });
    // Date formatting filter
    eleventyConfig.addFilter("htmlDateString", dateObj => {
      return new Date(dateObj).toISOString().split("T")[0];
    });
    // Apply performance attributes to images
    eleventyConfig.addPlugin(lazyImages, {
      cacheFile: ""
    });
  // Copy images over from Ghost
  eleventyConfig.addPlugin(localImages, {
      distPath: "dist",
      assetPath: "/assets/images",
      selector: "img",
      attribute: "data-src", // Lazy images attribute
      verbose: false
    });
    // Don't ignore the same files ignored in the git repo
    eleventyConfig.setUseGitIgnore(false);
    return {
      dir: {
        input: src,
        output: dist,
        templateFormats: ["css", "njk", "md", "txt", "pug", "liquid"],
        htmlTemplateEngine: ["pug", "njk", "hbs", "liquid"],
        markdownTemplateEngine: "njk",
        passthroughFileCopy: true
      }
<<<<<<< HEAD
    };
=======
    }
  });

  // Eleventy configuration
  return {
    dir: {
      input: "src",
      output: "dist"
    },

    // Files read by Eleventy, add as needed
    templateFormats: ["css", "njk", "hbs", "md", "txt"],
    htmlTemplateEngine: ["njk", "hbs", "pug"],
    markdownTemplateEngine: "njk",
    passthroughFileCopy: true
  };
};
>>>>>>> f39daca1d4e9ed3fa718e495b1d565189a228f23
