import allModels from '../models/allModels.js';
import extend from '../helpers/userState.js';
import { displaySuccess, displayError } from '../helpers/notifications.js';

export default {
    get: {
        login(ctx) {
            extend(ctx)
                .then(function () {
                    this.partial('../templates/user/login.hbs');
                });
                
                ctx.redirect('#/home');
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
                ctx.redirect('#/home');
                displaySuccess("You have logged out.")
            })
            
        }
    },
    post: {
        login(ctx) {
            const {
                username,
                password
            } = ctx.params;

            allModels.user.login(username, password)
                .then((resp) => {
                    ctx.user = resp;
                    ctx.username = resp.email;
                    ctx.isLoggedIn = true;
                    ctx.redirect('#/home');
                    displaySuccess("You have successfully logged in.")
                })
                .catch(e => console.log(e));
        },
        register(ctx) {
            const {
                username,
                password,
                rePassword
            } = ctx.params;

            if (password !== rePassword) {
                
                ctx.redirect('#/user/login');
                displayError("Both passwords must be the same!");
                throw Error('Password and rePassword must be equal!');
            }
            //fetch data from db
            allModels.user.register(username, password)
                .then((resp) => {
                    ctx.redirect('#/user/login');
                })
                .catch(e => console.log(e));

        }
    }
}