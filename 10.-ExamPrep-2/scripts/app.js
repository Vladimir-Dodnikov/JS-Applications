import allControllers from "../controllers/allControllers.js";


// initialize the application
const app = Sammy('#main', function () {

    // include a plugin (template engine)
    this.use('Handlebars', 'hbs');

    // define a 'route'

    //home
    this.get('#/', allControllers.home.get.partials);
    this.get('#/home', allControllers.home.get.partials);
    //user get
    this.get('#/user/login', allControllers.user.get.login);
    this.get('#/user/register', allControllers.user.get.register);
    this.get('#/user/logout', allControllers.user.get.logout);
    //user post
    this.post('#/user/login', allControllers.user.post.login);
    this.post('#/user/register', allControllers.user.post.register);
    //cause get
    this.get('#/cause/dashboard', allControllers.cause.get.dashboard);
    this.get('#/cause/create', allControllers.cause.get.create);

    this.get('#/cause/details/:causeId', allControllers.cause.get.details);

    //cause post
    this.post('#/cause/create', allControllers.cause.post.create);
    //cause donate
    this.get('#/cause/close/:causeId', allControllers.cause.del.close);
    this.post('#/cause/donate/:causeId', allControllers.cause.put.donate);
});
// start the application
app.run('#/');