// Quick boilerplate to shorten the long querySelector and querySelectorall functions ['qS' for short] 😎
let qS = (el, all = false) => {
    return all ? document.querySelectorAll(el) : document.querySelector(el);
}

// Grab the table body element for global use
const tableBody = qS('table tbody');

// Grab the next/prev button element for global use
const nextBtn = qS('#nextBtn');
const prevBtn = qS('#prevBtn');

// Set the number of items per page, currentPage and responseData, dataLength instance
const perPage = 10;
let currentPage = 0;
let responseData = null;
let dataLength = 0;

// Boilerplate to grab coin data
let fetchCoinData = () => {
    const api = 'https://api.coinlore.com/api/tickers/';
    fetch(api)
        .then(function (response) {
            return response.json();
        })
        .then((responseJSON) => {
            // Store the data/length in global variable
            responseData = responseJSON.data;
            dataLength = responseData.length;
            updatePage();
        })
        .catch(function (error) {
            console.log(error);
        });
}

// Set the table body row instance
let tableBodyRow = (ticker) => `<tr data-id="${ticker.id}">
                    <td data-label="💰 Coin">${ticker.name}</td>
                    <td data-label="📄 Code">${ticker.symbol}</td>
                    <td data-label="🤑 Price">$ ${ticker.price_usd}</td>
                    <td data-label="📉 Total Supply">${ticker.tsupply} ${ticker.symbol}</td>
                </tr>`;

// Update the UI based on current page
let updateTableBody = (startIndex = 0, endIndex = perPage) => {
    tableBody.innerHTML = ''; // Clear table body before loading page specific data
    for (let i = startIndex; i < endIndex; i++) {
        tableBody.insertAdjacentHTML('beforeend', tableBodyRow(responseData[i]));
    }
}

// Next/Prev plage click event
prevBtn.addEventListener('click', () => {
    updatePage(prevBtn.id);
});
nextBtn.addEventListener('click', () => {
    updatePage(nextBtn.id);
});


// Update pagination values, based on page nav click and on landing
let updatePage = (pageNavBtnID = 'nextBtn') => {
    // Reset the starting and ending index
    let sIndex = 0;
    let eIndex = 0;
    // Reset navigation display
    nextBtn.style.display = prevBtn.style.display = 'block';
    
    // Update the currentpage value
    if (pageNavBtnID == 'nextBtn') {
        currentPage++;
    } else {
        currentPage--;
    }

    // Compute starting index
    sIndex = (perPage * currentPage) - perPage;
    // Compute ending index
    eIndex = perPage * currentPage > dataLength ? dataLength : perPage * currentPage;
    updateTableBody(sIndex, eIndex); // Load page specific data

    if (sIndex == 0) {
        nextBtn.style.display = 'block';
        prevBtn.style.display = 'none';
    }
    if (eIndex == dataLength) {
        nextBtn.style.display = 'none';
        prevBtn.style.display = 'block';
    }
};

(() => {
    // Onlanding, quickly grab coin data
    fetchCoinData();
})();