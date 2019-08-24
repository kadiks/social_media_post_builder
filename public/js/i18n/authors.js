class Authors {
  constructor() {
    this.authors = {};
  }

  async getAll() {
    const res = await fetch("/authors");
    const json = await res.json();
    this.authors = json;
  }

  getTranslatedAuthor({ language = null, author }) {
    const lcAuthor = author.toLowerCase();
    if (this.authors.hasOwnProperty(lcAuthor)) {
      if (this.authors[lcAuthor].hasOwnProperty(language) === true) {
        return this.authors[lcAuthor][language];
      }
    }
    return author;
  }
}
