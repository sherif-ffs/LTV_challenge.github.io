const SearchEmail = (function(){

    // cache all DOM elements we will be using in this file
    elements = {
        logo: document.querySelector('.navigation-bar-logo'),
        searchBar: document.querySelector('.email-searchbar'),
        submitButton: document.querySelector('.submit-button'),
        errorFlag: document.querySelector('.error-flag'),
        resultsSection: document.querySelector('.results-section'),
        searchSection: document.querySelector('.search-section'),
        reverseEmailSection: document.querySelector('.reverse-email-lookup'),
        addressDetails: document.querySelector('.address-details'),
        emailDetails: document.querySelector('.email-details'),
        emailHeader: document.querySelector('.email-header'),
        phoneHeader: document.querySelector('.phone-header'),
        relativesHeader: document.querySelector('.relatives-header'),
        nameAndAge: document.querySelector('.name-age'),
        userDetails: document.querySelector('.user-details'),
        resultsSection: document.querySelector('.results-section'),
        resultsSectionHeader: document.querySelector('.results-section-header'),
        resultsSectionSubHeader: document.querySelector('.results-section-sub-header'),
        resultWrapper: document.querySelector('.result'),
        searchSectionHeader: document.querySelector('.search-section-header'),
        searchSectionSubHeader: document.querySelector('.search-section-subheader'),
        searchSectionSpan: document.querySelector('.search-section-span'),
        loadingSpinnerWrapper: document.querySelector('#loading')
    }

    const clearSearchField = () => {
        elements.searchBar.value = ''
    }
    const reloadPage = () => {
        location.reload()
    }

    // hide all HTML sections except for navigation bar and footer while spinner is active
    const showSpinner = () => {
        elements.loadingSpinnerWrapper.style.display = 'flex';
        elements.resultsSection.style.display = 'none'
        elements.searchSection.style.display = 'none'
        elements.reverseEmailSection.style.display = 'none'
    }

    const hideSpinner = () => {
        elements.loadingSpinnerWrapper.style.display = 'none';
        elements.resultsSection.style.display = 'flex'
        elements.searchSection.style.display = 'flex'
        elements.reverseEmailSection.style.display = 'none'
    }

    // regex function to check whether input value is a valid email address
    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    const renderErrorMessage = () => {
        document.querySelector('.email-input-wrapper').style.height = '135px'
        elements.errorFlag.style.display = 'block';
        elements.searchBar.style.border = '3px solid #DC0015';
    }

    const removeErrorMessage = () => {
        document.querySelector('.email-input-wrapper').style.height = '100px'
        elements.errorFlag.style.display = 'none';
        elements.searchBar.style.border = 'none';
    }

    const callApi = async (value) => {
        const proxyurl = "https://cors-anywhere.herokuapp.com/"; // use proxy to get around CORS issue
        const url = `https://ltv-data-api.herokuapp.com/api/v1/records.json?email=${value}`;

        try {
            showSpinner()
            const response = await fetch(proxyurl + url)
            const result = await response.json();
            hideSpinner()
            return result;
        } catch (error) {
            console.error(error);
        }
    }

    const modifySearchSectionText = () => {
        elements.searchSectionHeader.textContent = "Can't Find the Right Person?"
        elements.searchSectionSubHeader.innerHTML = "<span class='search-section-span'>Try Again</span>&nbsp;- Make a new search"
    }
    const renderNoResultsFound = () => {
        elements.resultWrapper.style.display = 'none';
        elements.resultsSectionHeader.textContent = '0 Results'
        elements.resultsSectionSubHeader.textContent = 'Try starting a new search below';
        elements.resultsSection.style.display = 'flex';
        elements.resultsSection.style.height = '50vh'
        modifySearchSectionText()
    }

    const populateResultWrapper = (searchResult) => {
        elements.resultsSection.style.height = 'min-content'
        elements.resultWrapper.style.display = 'flex';
        elements.resultsSectionHeader.textContent = '1 Result'
        elements.resultsSectionSubHeader.textContent = "Look at the result below to see the details of the person you're searched for.";

        // store all of the content from searchResults in variables
        const name = searchResult.first_name + ' ' + searchResult.last_name
        const description = searchResult.description
        const email = searchResult.email
        const address = searchResult.address
        const phoneNumbers = searchResult.phone_numbers
        const relatives = searchResult.relatives

        // update result html with data returned from the api
        elements.nameAndAge.textContent = name;
        elements.userDetails.textContent = description
        elements.addressDetails.textContent = address
        elements.emailDetails.textContent = email

        // remove existing phone numbers before creating and appending new ones
        document.querySelectorAll('.phone-details').forEach(e => e.remove())

        // now that existing phone numbers have been removed I looped through the new phone numbers returned from the API and created and appended new phone numbers.
        phoneNumbers.forEach(number => {
            let numberElement = document.createElement('p')
            numberElement.classList.add('phone-details')
            // format string to number
            numberElement.textContent = `(${number.substring(0,3)}) ${number.substring(3,6)}-${number.substring(6,9)}`
            elements.phoneHeader.appendChild(numberElement)
        })
        elements.resultsSection.style.display = 'flex';

        // remove existing relatives before creating and appending new ones
        document.querySelectorAll('.relatives-details').forEach(e => e.remove())
        // now that existing relatives have been removed I looped through the new relatives returned from the API and created and appended new relative elements.

        relatives.forEach(relative => {
            let relativeElement = document.createElement('p') 
            relativeElement.classList.add('relatives-details')
            relativeElement.textContent = relative
            elements.relativesHeader.appendChild(relativeElement)
        })

        modifySearchSectionText()
    }

    const submitSearch = async () => {
        const value = elements.searchBar.value; // get input value from searchbar
        if (!validateEmail(value)) { // check if input value is a valid email address
            renderErrorMessage()
            return // if value is not a valid email address end the function
        } else {
            removeErrorMessage()
        }

        const searchResult = await callApi(value); // if input value is an email address await response from API

        if (searchResult === undefined || searchResult.length == 0) { // make sure that the result returned is not undefined or an empty array
            renderNoResultsFound()
        } else {
            populateResultWrapper(searchResult)
        }
        clearSearchField() // reset search field input
    }

    const init = () => {
        elements.submitButton.addEventListener('click', submitSearch)
    }

    window.onload = function() {
        init()
      }

})();