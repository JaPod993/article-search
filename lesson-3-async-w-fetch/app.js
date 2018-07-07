(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        fetch(`https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`, {
            headers: {
                Authorization: 'Client-ID 5e4b203665fbe0f006dd6bc31752418d60a8c302a2bf99115479ca42a05af77c'
            }
        }).then(response => response.json())
            .then(addImage)
            .catch(e => requestError(e, 'image'));

        fetch(`http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=afb784673bdd476b9d54ed771d7d085d`, {
        }).then(response => response.json())
            .then(addArticles)
            .catch(e => requestError(e, 'articles'));

        function addImage(data) {
            let htmlContent = '';

            if(data && data.results && data.results[0]){
                const firstImage = data.results[0];
                htmlContent = `<figure>
                        <img src="${firstImage.urls.regular}" alt="${searchedForText}">
                        <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
                    </figure>`;
            } else {
                htmlContent = 'Unfortunately, no image was returned for your search.'
            }

            responseContainer.insertAdjacentHTML('afterBegin', htmlContent);
        }
        
        function addArticles(data) {
            let htmlContent = '';

            if(data.response && data.response.docs && data.response.docs.length > 1){
                const articles = data.response.docs;
                htmlContent = '<ul>' + articles.map(article => `<li class="article">
                <h2><<a href="${article.web_url}">${article.headline.main}</a></h2>
                <p>${article.snippet}</p>
                </li>`
                ).join('') +'</ul>';

            }else {
                htmlContent = '<div class="error-no-articles">No articles available</div>';
            }
            responseContainer.insertAdjacentHTML('beforeEnd', htmlContent);
        }

        function requestError(e, part) {
            console.log(e);
            responseContainer.insertAdjacentHTML('beforeEnd', `<p class="network-warning">Oh no! There was an error making a request for the ${part}.</p>`);
        }
    });
})();
