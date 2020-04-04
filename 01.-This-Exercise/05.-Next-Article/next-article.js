function getArticleGenerator(articles) {

    let copyOfArticles = [...articles];

    let contentRef = document.querySelector('#content');

    return function(){

        if (copyOfArticles.length === 0) {
            return
        }

        let result = copyOfArticles[0];

        copyOfArticles = copyOfArticles.slice(1);

        let resultElement = document.createElement('article');
        resultElement.innerHTML = result;

        contentRef.appendChild(resultElement);
        
    }
}
