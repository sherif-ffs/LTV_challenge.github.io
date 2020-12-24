const SearchEmail = (function(){

    elements = {
        searchBar: document.querySelector('.email-searchbar'),
        submitButton: document.querySelector('.submit-button'),
        errorFlag: document.querySelector('.error-flag'),
        resultsSection: document.querySelector('.results-section'),
        addressDetails: document.querySelector('.address-details'),
        emailDetails: document.querySelector('.email-details'),
        phoneHeader: document.querySelector('.phone-header'),
        relativesHeader: document.querySelector('.relatives-header'),
        nameAndAge: document.querySelector('.name-age'),
        userDetails: document.querySelector('.user-details'),
        resultsSection: document.querySelector('.results-section'),
        resultsSectionHeader: document.querySelector('.results-section-header'),
        resultsSectionSubHeader: document.querySelector('.results-section-sub-header'),
        resultWrapper: document.querySelector('.result')
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

    const renderNoResultsFound = () => {
        elements.resultWrapper.style.display = 'none';
        elements.resultsSectionHeader.textContent = '0 Results'
        elements.resultsSectionSubHeader.textContent = 'Try starting a new search below';
        elements.resultsSection.style.display = 'flex'
    }

    const populateResultWrapper = (searchResult) => {
        console.log('searchResult: ', searchResult)
        elements.resultWrapper.style.display = 'flex';
        const name = searchResult.first_name + ' ' + searchResult.last_name
        const description = searchResult.description
        const email = searchResult.email
        const address = searchResult.address
        const phoneNumbers = searchResult.phone_numbers
        const relatives = searchResult.relatives

        elements.nameAndAge.textContent = name;
        elements.userDetails.textContent = description
        elements.addressDetails.textContent = address
        elements.emailDetails.textContent = email

        // remove existing phone numbers before creating and appending new ones
        document.querySelectorAll('.phone-details').forEach(e => e.remove())

        phoneNumbers.forEach(number => {
            let numberElement = document.createElement('p')
            numberElement.classList.add('phone-details')
            numberElement.textContent = `(${number.substring(0,3)}) ${number.substring(3,6)}-${number.substring(6,9)}`
            elements.phoneHeader.appendChild(numberElement)
        })

        // remove existing relatives before creating and appending new ones
        document.querySelectorAll('.relatives-details').forEach(e => e.remove())
        relatives.forEach(relative => {
            let relativeElement = document.createElement('p')
            relativeElement.classList.add('phone-details')
            relativeElement.textContent = relative
            elements.relativesHeader.appendChild(relativeElement)
        })

        elements.resultsSection.style.display = 'flex'
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
        }
        const searchResult = await callApi(value);
        console.log('searchResult: ', searchResult)
        if (searchResult != []) {
            console.log('if hits')
            populateResultWrapper(searchResult)
        } else {
            console.log('else hits')
            renderNoResultsFound()
        }
        // populateResultWrapper(searchResult)
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