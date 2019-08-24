const ROOT = "https://api.unsplash.com";

class Unsplash {
  constructor({ apiKey }) {
    console.log("apiKey", apiKey);
    this.params = {};
    this.params.apiKey = apiKey;

    this.getPhotos = this.getPhotos.bind(this);
    this.searchPhotos = this.searchPhotos.bind(this);
  }

  getUrlById({ id }) {
    return `https://source.unsplash.com/${id}/2300x0`;
  }

  async getPhotos() {
    const url = `${ROOT}/photos?per_page=100&client_id=${this.params.apiKey}`;
    console.log("Unsplash#getPhotos url", url);
    const res = await fetch(url);
    const json = await res.json();
    return json;
  }

  async searchPhotos({ searchTerm = "" }) {
    if (searchTerm === "") {
      return;
    }
    const url = `${ROOT}/search/photos?query=${searchTerm}&per_page=100&client_id=${
      this.params.apiKey
    }`;
    console.log("Unsplash#searchPhotos url", url);
    const res = await fetch(url);
    const json = await res.json();
    return json.results;
  }
}
