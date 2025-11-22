// Wrapper function for GM_xmlhttpRequest
window.makeRequest = function (url, method = "GET", data = null) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: method,
      url: url,
      data: data ? JSON.stringify(data) : null,
      headers: data ? { "Content-Type": "application/json" } : {},
      onload: function (response) {
        if (response.status !== 200) {
          console.error("Error:", response.statusText);
          resolve({
            error: `Request failed with status ${response.status}: ${response.statusText}`,
            url,
          });
        } else {
          console.log("Request successful:", response);
          resolve(response);
        }
      },
      onerror: function (error) {
        console.log("Error:", error);
        resolve({ error: "Network error occurred", url });
      },
    });
  });
};