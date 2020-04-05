import allControllers from "../controllers/allControllers.js";


// initialize the application
const app = Sammy('#root', function () {

    // include a plugin (template engine)
    this.use('Handlebars', 'hbs');

    // define a 'route'

    //home load Templates
    this.get('#/', allControllers.articles.get.home);
    this.get('#/home', allControllers.articles.get.home);
    //user load Templates
    this.get('#/user/login', allControllers.user.get.login);
    this.get('#/user/register', allControllers.user.get.register);
    this.get('#/user/logout', allControllers.user.get.logout);
    //AllControllers with POST get inputData from Templates, 
    //AllModels fetch from AllControllers to DataBase, DataBase auth and return it as response,
    //AllControllers load response to Templates, Templates load HTML
    this.post('#/user/login', allControllers.user.post.login);
    this.post('#/user/register', allControllers.user.post.register);
    //articles load Templates
    this.get('#/articles/home', allControllers.articles.get.home);
    this.get('#/articles/create', allControllers.articles.get.create);

    this.get('#/articles/details/:articleId', allControllers.articles.get.details);

    //articles post
    this.post('#/articles/create', allControllers.articles.post.create);
    //articles delete
    this.get('#/articles/close/:articleId', allControllers.articles.del.close);
    //articles edit
    this.get('#/articles/edit/:articleId', allControllers.articles.get.edit);
    this.post('#/articles/edit/:articleId', allControllers.articles.put.edit);

    //this.get - when button is clicked!
});
// start the application
app.run('#/');