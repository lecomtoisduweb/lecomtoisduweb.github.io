const slugify = require("slugify");

function titleToPath(title) {
  return `/blog/${titleToSlug(title)}`;
}

function titleToSlug(title) {
  return slugify(title, {
    replacement: "-", // replace spaces with replacement
    remove: /[*+~.,()'"!:@]/g, // regex to remove characters
    lower: true, // result in lower case
  });
}

module.exports = { titleToPath, titleToSlug };
