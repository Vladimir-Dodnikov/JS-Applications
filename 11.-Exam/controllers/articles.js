import extend from '../helpers/userState.js';
import allModels from '../models/allModels.js'
import objModifier from '../helpers/objModifier.js';
import fillFormWithData from '../helpers/form-helper.js';
import sortTable from '../helpers/sortTable.js';
export default {
    get: {
        home(ctx) {
            allModels.articles.getAll().then((resp) => {
                const articles = resp.docs.map(objModifier);
                // console.log(articles);
                ctx.articles = articles;
                
                ctx.javascript = articles.filter(x=> x.category.toLowerCase() === "javascript").sort(sortTable);
                ctx.cSharp = articles.filter(x=> x.category.toLowerCase() === "c#").sort(sortTable);
                ctx.java = articles.filter(x=> x.category.toLowerCase() === "java").sort(sortTable);
                ctx.python = articles.filter(x=> x.category.toLowerCase() === "python").sort(sortTable);

                extend(ctx).then(function () {
                    this.partial('../templates/articles/home.hbs')
                })
            })

        },
        create(ctx) {
            extend(ctx).then(function () {
                this.partial('../templates/articles/create.hbs')
            })
        },
        details(ctx) {
            // console.log(ctx);
            const {
                articleId
            } = ctx.params;
            // console.log(articleId);

            allModels.articles.getById(articleId)
                .then((resp) => {
                    // console.log(resp);
                    const article = objModifier(resp);
                    // console.log(article);
                    ctx.article = article;

                    Object.keys(article).forEach((key) => {
                        ctx[key] = article[key];
                    })

                    //canDonate form init
                    // console.log(localStorage.getItem('userId'));
                    // console.log(article.userId);
                    ctx.isCreator = article.userId === localStorage.getItem('userId');

                    extend(ctx).then(function () {
                        this.partial('../templates/articles/details.hbs')
                    })

                })
                .catch((e) => console.error(e));
        },
        edit(ctx) {
            // console.log(ctx);
            ctx.id = ctx.params.articleId;
            extend(ctx).then(function () {
                this.partial('../templates/articles/edit.hbs');
            });
            // // console.log(ctx.params);
            const {
                articleId
            } = ctx.params;

            allModels.articles.getById(articleId).then(response => {
                const formValues = response.data();
                // console.log(formValues);
                const formRef = document.querySelector('form');
                fillFormWithData(formRef, formValues);
            });

        }
    },
    post: {
        create(ctx) {
            // console.log(ctx.params);
            //{ ...ctx.params } - destruct Sammy.Object to object
            const data = {
                ...ctx.params,
                userEmail: localStorage.getItem('userEmail'),
                userId: localStorage.getItem('userId')
            };
            // console.log(data);
            const staticCategories = ["javascript", "c#", "java", "python"];

            if (staticCategories.includes(data.category.toLowerCase())) {
                allModels.articles.create(data).then((resp) => {
                   ctx.redirect('#/articles/home');
                })
                .catch((e) => console.error(e));
            }
            else {
                console.error("Тhere is no such category!");
            }



            // allModels.articles.create(data)
            //     .then((resp) => {
            //         // console.log(resp);
            //         ctx.redirect('#/articles/home')
            //     })
            //     .catch((e) => console.log(e));
        }
    },
    del: {
        close(ctx) {
            // console.log(ctx);
            const {
                articleId
            } = ctx.params;
            //from article model
            allModels.articles.close(articleId).then((resp) => {
                ctx.redirect('#/articles/home');
            })

        }
    },
    put: {
        edit(ctx) {
            // console.log(ctx);
            const article = {
                ...ctx.params
            };
            //    console.log(article);
            allModels.articles.edit(article.articleId, article)
                .then((resp) => {
                    ctx.redirect(`#/articles/details/${article.articleId}`);
                })
        }
    }
}