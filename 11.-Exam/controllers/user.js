import allModels from '../models/allModels.js';
import extend from '../helpers/userState.js';
// import { displaySuccess, displayError } from '../helpers/notifications.js';

export default {
    get: {
        login(ctx) {
            extend(ctx)
                .then(function () {
                    this.partial('../templates/user/login.hbs');
                });
                
                // ctx.redirect('#/articles/home');
        },
        register(ctx) {
            extend(ctx)
                .then(function () {
                    this.partial('../templates/user/register.hbs');
                });
                
        },
        logout(ctx) {
            allModels.user.logout()
            .then((resp)=> {
                ctx.redirect('#/user/login');
                // displaySuccess("You have logged out.")
                // sessionStorage.clear();
            })
            
        }
    },
    post: {
        login(ctx) {
            const {
                email,
                password
            } = ctx.params;

            allModels.user.login(email, password)
                .then((resp) => {
                    ctx.user = resp;
                    ctx.email = resp.email;
                    ctx.isLoggedIn = true;
                    ctx.redirect('#/articles/home');
                    // displaySuccess("You have successfully logged in.")
                })
                .catch(e => console.log(e));
        },
        register(ctx) {
            const {
                email,
                password,
                rePassword = document.getElementById('rep-pass').value
            } = ctx.params;
            // console.log(rePassword);
            // console.log(ctx.params);
            if (password !== rePassword) {
                
                ctx.redirect('#/user/register');
                // displayError("Both passwords must be the same!");
                throw Error('Password and rePassword must be equal!');
            }
            //fetch data from db
            allModels.user.register(email, password)
                .then((resp) => {
                    ctx.redirect('#/user/login');
                })
                .catch(e => console.log(e));

        }
    }
}