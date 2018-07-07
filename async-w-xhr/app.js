(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        function addImage(){
            let htmlContent ='';
            const data = JSON.parse( this.responseText );

            if (data && data.results && data.results[0]) {
                const firstImage = data.results[0];
                htmlContent = `<figure>
                        <img src="${firstImage.urls.regular}" alt="${searchedForText}">
                        <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
                    </figure>`;
            } else {
                htmlContent = '<div class="error-no-image">No images available</div>';
            }
            responseContainer.insertAdjacentHTML('afterbegin', htmlContent);

        }

        searchedForText = searchField.value;
        const unsplashRequest = new XMLHttpRequest();
        unsplashRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
        unsplashRequest.onload = addImage;
        unsplashRequest.setRequestHeader('Authorization', 'Client-ID 5e4b203665fbe0f006dd6bc31752418d60a8c302a2bf99115479ca42a05af77c');
        unsplashRequest.send();

        function addArticles () {
            let htmlContent ='';
            const data = JSON.parse( this.responseText );

            if (data.response && data.response.docs && data.response.docs.length > 1) {
                htmlContent = '<ul>' + data.response.docs.map(article => `<li class="article">
                                <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
                                <p>${article.snippet}</p>
                            </li>`
                ).join('') + '</ul>'
            } else {
                htmlContent = '<div class="error-no-image">No articles available</div>';
            }
            responseContainer.insertAdjacentHTML("beforeend", htmlContent);

        }
        const articleRequest = new XMLHttpRequest();
        articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=afb784673bdd476b9d54ed771d7d085d`)
        articleRequest.onload = addArticles;
        articleRequest.send();
    });
})();
