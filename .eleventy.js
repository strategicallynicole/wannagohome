const sass = require('./src/_config/scss.js');
sass('./src/assets/styles/main.scss', './src/_includes/css/main.css');
const cleanCSS = require("clean-css");
const fs = require("fs");
const pluginRSS = require("@11ty/eleventy-plugin-rss");
const localImages = require("eleventy-plugin-local-images");
const lazyImages = require("eleventy-plugin-lazyimages");
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
      }};