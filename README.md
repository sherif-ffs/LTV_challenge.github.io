# LTV Front-end Challenge
### Responsive webpage to search for a user's information.

# Tools Used
### HTML5: using semantic elements
### CSS3: using flexbox for page layout and media queries for responsive design.
### JavaScript: using fetch for API calls.

# Code Snippits

### Conditionally call API depending on if value entered is a valid email address
```javascript
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
```

### API Call using async await
```javascript
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
```

# Screenshots
### screenshot desktop
<img width="1424" alt="screenshot-desktop" src="https://user-images.githubusercontent.com/46908343/103141227-aa03b680-46bf-11eb-93c2-6851bd714efa.png">

### screenshot desktop with error message
<img width="1425" alt="screenshot-desktop-error" src="https://user-images.githubusercontent.com/46908343/103141235-c1db3a80-46bf-11eb-89ab-316319a28eaf.png">

### screenshot desktop with search result returned
<img width="1422" alt="screenshot-desktop-result" src="https://user-images.githubusercontent.com/46908343/103141240-d0c1ed00-46bf-11eb-95d3-9bb7d931457f.png">

### screenshot desktop with no result returned
<img width="1422" alt="screenshot-desktop-no-result" src="https://user-images.githubusercontent.com/46908343/103141245-da4b5500-46bf-11eb-81e5-151c25ff35cf.png">
