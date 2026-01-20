// backend api

function getApiVersion() {
  const url = `${api_endpoint}/version`;
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      version = data["data"]["Version"]; //Author Version
      // chrome.storage.session.set({ "BackendApiVersion": version });
      chrome.storage.local.set({ BackendApiVersion: version });

      if (debug) {
        console.log(data["data"]);
      }
    })
    .catch((error) => console.error("Error:", error));

  return true; // Will respond asynchronously.
}
