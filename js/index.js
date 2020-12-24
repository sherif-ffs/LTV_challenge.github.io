const SearchEmail = (function(){

    elements = {
        searchBar: document.querySelector('.email-searchbar'),
        submitButton: document.querySelector('.submit-button')
    }

    const callApi = (value) => {
        const proxyurl = "https://cors-anywhere.herokuapp.com/"; // use proxy to get around CORS issue
        const url = `https://ltv-data-api.herokuapp.com/api/v1/records.json?email=${value}`;
        fetch(proxyurl + url) 
        .then(response => response.json())
        .then(contents => console.log(contents))
        .catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"))
    }

    const submitSearch = () => {
        const value = elements.searchBar.value;
        callApi(value)
        console.log('value: ', value)
    }

    const init = () => {
        elements.submitButton.addEventListener('click', submitSearch)
    }

    window.onload = function() {
        console.log('asda')
        init()
      }

})();