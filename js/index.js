const SearchEmail = (function(){

    elements = {
        searchBar: document.querySelector('.email-searchbar'),
        submitButton: document.querySelector('.submit-button'),
        errorFlag: document.querySelector('.error-flag'),
        resultsSection: document.querySelector('.results-section'),
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
        searchSectionSpan: document.querySelector('.search-section-span')
    }

    state = {
        searchResults: []
    }

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
        // elements.errorFlag.style.visibility = 'hidden';
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

    const modifySearchSectionText = () => {
        elements.searchSectionHeader.textContent = "Can't Find the Right Person?"
        elements.searchSectionSpan.textContent = "Try Again"
        elements.searchSectionSubHeader.innerHTML = "&nbsp;- Make a new search"
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
        console.log('searchResult: ', searchResult)
        elements.resultsSection.style.height = 'min-content'
        elements.resultWrapper.style.display = 'flex';
        elements.resultsSectionHeader.textContent = '1 Result'
        elements.resultsSectionSubHeader.textContent = "Look at the result below to see the details of the person you're searched for.";
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
        elements.resultsSection.style.display = 'flex';

        // remove existing relatives before creating and appending new ones
        document.querySelectorAll('.relatives-details').forEach(e => e.remove())
        relatives.forEach(relative => {
            let relativeElement = document.createElement('p')
            relativeElement.classList.add('relatives-details')
            relativeElement.textContent = relative
            elements.relativesHeader.appendChild(relativeElement)
        })

        modifySearchSectionText()
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

        if (searchResult === undefined || searchResult.length == 0) {
            renderNoResultsFound()
        } else {
            populateResultWrapper(searchResult)
        }
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