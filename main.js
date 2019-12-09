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
    fetch(api, {
            credentials: 'same-origin'
        })
        .then(function (response) {
            return response.json();
        })
        .then((responseJSON) => {
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
                    <td data-label="📉 Total Supply">${ticker.tsupply} BTC</td>
                </tr>`;

// Update the UI based on current page
let updateTableBody = (data, startIndex = 0, endIndex = perPage) => {
    tableBody.innerHTML = ''; // Clear table body before loading page specific data
    data.slice(startIndex, endIndex).forEach(item => {
        tableBody.insertAdjacentHTML('beforeend', tableBodyRow(item));
    });
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
    // Update the currentpage value
    if (pageNavBtnID == 'nextBtn') {
        currentPage++;
    } else {
        currentPage--;
    }

    // Check if currpage is in boundary update the row
    if (perPage * currentPage > 0 && perPage * currentPage <= dataLength) {
        let sIndex = (perPage * currentPage) - perPage; // Compute starting index
        let eIndex = perPage * currentPage //  Compute ending index
        nextBtn.style.display = 'block'; // Show next button
        prevBtn.style.display = 'block'; // Show next button
        updateTableBody(responseData, sIndex, eIndex); // Load page specific data
    }
    if ((perPage * currentPage) - perPage == 0) {
        nextBtn.style.display = 'block';
        prevBtn.style.display = 'none';
    }
    if (perPage * currentPage > dataLength - 1) {
        nextBtn.style.display = 'none';
        prevBtn.style.display = 'block';
    }

    console.log(`sIndex:${(perPage * currentPage) - perPage} | eIndex:${perPage * currentPage}`)
};

(function () {
    // Onlanding, quickly grab coin data
    fetchCoinData();
})();