///// web worker for searching post

let searchStore = [];

/** event listener for the web worker */
onmessage = async e => {
  let { action, data } = e.data;
  if (typeof action === "string" && action.length) {
    action = action.toUpperCase().trim();
    switch (action) {
      case "INIT":
        // initialization
        // fetch posts' indexing file
        const response = await fetch(data);
        const content = await response.json();
        searchStore = content || [];
        break;
      case "SEARCH":
      case "QUERY":
      default:
        // perform search with user input keyword
        let value = (data || "").toLowerCase();
        if (value.length === 0) {
          return;
        }
        // TODO: implement advanced search algorithm
        // reference: https://stackoverflow.com/questions/5859561/getting-the-closest-string-match
        const matchedPosts = searchStore
          .filter(
            _ =>
              _.title.toLowerCase().includes(value) ||
              _.content.toLowerCase().includes(value)
          )
          .slice(0, 10);
        postMessage(matchedPosts);
        break;
    }
  } else {
    console.log("please specify action when invoking search web worker!");
  }
};
