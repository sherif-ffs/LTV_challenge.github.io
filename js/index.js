const SearchEmail = (function(){

    elements = {
        searchBar: document.querySelector('.email-searchbar'),
        submitButton: document.querySelector('.submit-button'),
        errorFlag: document.querySelector('.error-flag'),
        resultsSection: document.querySelector('.results-section')
    }

    state = {
        searchResults: []
    }

    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const renderErrorMessage = () => {
        elements.errorFlag.style.visibility = 'visible';
        elements.searchBar.style.border = '3px solid #DC0015';
    }

    const removeErrorMessage = () => {
        elements.errorFlag.style.visibility = 'hidden';
        elements.searchBar.style.border = 'none';
    }

    const callApi = async (value) => {
        const proxyurl = "https://cors-anywhere.herokuapp.com/"; // use proxy to get around CORS issue
        const url = `https://ltv-data-api.herokuapp.com/api/v1/records.json?email=${value}`;

        try {
            const response = await fetch(proxyurl + url)
            const result = await response.json();
            console.log('result: ', result)
            return result;
        } catch (error) {
            console.error(error);
        }
    }

    const submitSearch = async () => {
        const value = elements.searchBar.value;
        if (!validateEmail(value)) {
            console.log('email is not valid')
            renderErrorMessage()
            return
        } else {
            removeErrorMessage()
            document.querySelector('.reverse-email-lookup').style.display = 'none';
            elements.resultsSection.style.display = 'flex'
        }
        const searchResult = await callApi(value);
        state.searchResults = searchResult;
    }

    const init = () => {
        elements.submitButton.addEventListener('click', submitSearch)
    }

    window.onload = function() {
        console.log('asda')
        init()
      }

})();