import extend from '../helpers/userState.js';
import allModels from '../models/allModels.js';
import objModifier from '../helpers/objModifier.js';

export default {
    get: {
        partials(ctx) {
            allModels.articles.getAll()
            .then((resp)=>{
                const articles = resp.docs.map(objModifier);
                console.log(articles);
                function currSort (a, b) {
                    var titleA = a.title.toUpperCase();
                    var titleB = b.title.toUpperCase();
                    if (titleA < titleB) {
                      return -1;
                    }
                    if (titleA > titleB) {
                      return 1;
                    }
                    return 0;
                  };

                ctx.articles = articles;
                
                ctx.javascript = articles.filter(x=> x.category.toLowerCase() === "javascript").sort(currSort);
                console.log(ctx.javascript);
                ctx.cSharp = articles.filter(x=> x.category.toLowerCase() === "c#").sort(currSort);
                ctx.java = articles.filter(x=> x.category.toLowerCase() === "java").sort(currSort);
                ctx.python = articles.filter(x=> x.category.toLowerCase() === "python").sort(currSort);

                extend(ctx).then(function () {
                    this.partial('../templates/articles/home.hbs');
                });
            })


            
        }
    }
}