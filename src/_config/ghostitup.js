const sass = require('./src/_config/scss.js');
sass('./src/assets/styles/main.scss', './src/_includes/css/main.css');
const fs = require("fs");

const ghostContentAPI = require("@tryghost/content-api");
require("dotenv").config();
const api = new ghostContentAPI({
    url: process.env.GHOST_API_URL,
    key: process.env.GHOST_CONTENT_API_KEY,
    version: "v2"
  });  
  module.exports = eleventyConfig => {

    // Strip Ghost domain from urls
    const stripDomain = url => {
      return url.replace(process.env.GHOST_API_URL, "");
    };
    // Get all pages, called 'docs' to prevent
    // conflicting the eleventy page object
    eleventyConfig.addCollection("docs", async function(collection) {
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
      });
  
      return collection;
    });
  
    // Get all posts
    eleventyConfig.addCollection("posts", async function(collection) {
      collection = await api.posts
        .browse({
          include: "tags,authors",
          limit: "all"
        })
        .catch(err => {
          console.error(err);
        });
  
      collection.forEach(post => {
        post.url = stripDomain(post.url);
        post.primary_author.url = stripDomain(post.primary_author.url);
        post.tags.map(tag => (tag.url = stripDomain(tag.url)));
  
        // Convert publish date into a Date object
        post.published_at = new Date(post.published_at);
      });
  
      // Bring featured post to the top of the list
      collection.sort((post, nextPost) => nextPost.featured - post.featured);
  
      return collection;
    });
  
    // Get all authors
    eleventyConfig.addCollection("authors", async function(collection) {
      collection = await api.authors
        .browse({
          limit: "all"
        })
        .catch(err => {
          console.error(err);
        });
  
      // Get all posts with their authors attached
      const posts = await api.posts
        .browse({
          include: "authors",
          limit: "all"
        })
        .catch(err => {
          console.error(err);
        });
  
      // Attach posts to their respective authors
      collection.forEach(async author => {
        const authorsPosts = posts.filter(post => {
          post.url = stripDomain(post.url);
          return post.primary_author.id === author.id;
        });
        if (authorsPosts.length) author.posts = authorsPosts;
  
        author.url = stripDomain(author.url);
      });
  
      return collection;
    });
  
    // Get all tags
    eleventyConfig.addCollection("tags", async function(collection) {
      collection = await api.tags
        .browse({
          include: "count.posts",
          limit: "all"
        })
        .catch(err => {
          console.error(err);
        });
  
      // Get all posts with their tags attached
      const posts = await api.posts
        .browse({
          include: "tags,authors",
          limit: "all"
        })
        .catch(err => {
          console.error(err);
        });
  
      // Attach posts to their respective tags
      collection.forEach(async tag => {
        const taggedPosts = posts.filter(post => {
          post.url = stripDomain(post.url);
          return post.primary_tag && post.primary_tag.slug === tag.slug;
        });
        if (taggedPosts.length) tag.posts = taggedPosts;
  
        tag.url = stripDomain(tag.url);
      });
  
      return collection;
    });
  
    // Display 404 page in BrowserSnyc
    eleventyConfig.setBrowserSyncConfig({
      callbacks: {
        ready: (err, bs) => {
          const content_404 = fs.readFileSync("dist/404.html");
  
          bs.addMiddleware("*", (req, res) => {
            // Provides the 404 content without redirect.
            res.write(content_404);
            res.end();
          });
        }
      }
    }
    )};