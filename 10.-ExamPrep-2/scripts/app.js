import allControllers from "../controllers/allControllers.js";


// initialize the application
const app = Sammy('#main', function () {

    // include a plugin (template engine)
    this.use('Handlebars', 'hbs');

    // define a 'route'

    //home load Templates
    this.get('#/', allControllers.home.get.partials);
    this.get('#/home', allControllers.home.get.partials);
    //user load Templates
    this.get('#/user/login', allControllers.user.get.login);
    this.get('#/user/register', allControllers.user.get.register);
    this.get('#/user/logout', allControllers.user.get.logout);
    //AllControllers with POST get inputData from Templates, 
    //AllModels fetch from AllControllers to DataBase, DataBase auth and return it as response,
    //AllControllers load response to Templates, Templates load HTML
    this.post('#/user/login', allControllers.user.post.login);
    this.post('#/user/register', allControllers.user.post.register);
    //cause load Templates
    this.get('#/cause/dashboard', allControllers.cause.get.dashboard);
    this.get('#/cause/create', allControllers.cause.get.create);

    this.get('#/cause/details/:causeId', allControllers.cause.get.details);

    //cause post
    this.post('#/cause/create', allControllers.cause.post.create);
    //cause donate
    this.get('#/cause/close/:causeId', allControllers.cause.del.close);
    this.post('#/cause/donate/:causeId', allControllers.cause.put.donate);

    //this.get - when button is clicked!
});
// start the application
app.run('#/');