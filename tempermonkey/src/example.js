const exampleBtn = createButton('exampleBtn', 'Example', {
    top: '50px',
    bottom: '',
    opacity: '0.5',
    backgroundColor: 'rgb(193 65 170 / 31%)',
}, 'rgb(193 65 170 / 31%)');

exampleBtn.addEventListener('click', () => {
    alert('Example button clicked!');
});

const example2Btn = createButton('example2Btn', 'Example 2', {
    top: '120px',
    bottom: '',
    opacity: '0.9',
    backgroundColor: "#17cbaaff",
}, '#8d1aacff');

let urls = ["https://example.com", "https://google.com"]

example2Btn.addEventListener('click', () => {
    Promise.all(urls.map((url) => window.makeRequest(url)))
        .then((responses) => {
            responses.forEach((response, idx) => {
                if (response.error) {
                    console.log(`${urls[idx]}: ${response.error}`);
                } else {
                    // Parse the HTML to extract the title
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');
                    const title = doc.querySelector('title')?.textContent || 'No title found';
                    console.log(`${urls[idx]}: ${title}`);
                }
            });
        })
        .catch((error) => {
            console.error('Error fetching URLs:', error);
        });
});