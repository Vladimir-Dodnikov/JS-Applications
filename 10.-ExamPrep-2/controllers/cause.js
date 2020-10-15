import extend from '../helpers/userState.js';
import allModels from '../models/allModels.js'
import objModifier from '../helpers/objModifier.js';

export default {
    get: {
        dashboard(ctx) {
            allModels.cause.getAll().then((resp) => {
                // console.log(resp);
                // console.log(resp.docs);
                // 'resp' is object, 'docs' is prop of resp, 'docs' is arr
                // 'data' is elem of arr, 'data' is object
                const causes = resp.docs.map(objModifier);
                ctx.causes = causes;

                extend(ctx).then(function () {
                    this.partial('../templates/cause/dashboard.hbs')
                })
            })

        },
        create(ctx) {
            extend(ctx).then(function () {
                this.partial('../templates/cause/create.hbs')
            })
        },
        details(ctx) {
            console.log(ctx);
            const {
                causeId
            } = ctx.params;
            console.log(causeId);

            // allModels.cause.getById(causeId)
            //     .then((resp) => {
            //         console.log(resp);
            //         const cause = objModifier(resp);
            //         console.log(cause);
            //         // // ctx.cause = cause;

            //         Object.keys(cause).forEach((key)=>{
            //             ctx[key] = cause[key];
            //         })

            //         //canDonate form init
            //         // console.log(localeStorage.getItem('userId'));
            //         ctx.canDonate = cause.uid !== localStorage.getItem('userId');

            //         extend(ctx).then(function () {
            //             this.partial('../templates/cause/details.hbs')
            //         })
                
            //     })
            //     .catch((e) => console.error(e));
        }
    },
    post: {
        create(ctx) {
            // console.log(ctx.params);
            //{ ...ctx.params } - destruct Sammy.Object to object
            const data = { ...ctx.params, uid:localStorage.getItem('userId'), collectedFunds: 0, donors: [] };
            // console.log(data);

            allModels.cause.create(data)
                .then((resp) => {
                    // console.log(resp);
                    ctx.redirect('#/cause/dashboard')
                })
                .catch((e) => console.log(e));
        }
    },
    del: {
        close(ctx) {
            const { causeId } = ctx.params;
            //from cause model
            allModels.cause.close(causeId).then((resp)=>{ 
                ctx.redirect('#/cause/dashboard');
            }) 

        }
    },
    put: {
        donate(ctx) {
            const { causeId, currentDonation } = ctx.params;
            
            allModels.cause.getById(causeId).then((resp)=>{
                const cause = objModifier(resp);
                
                cause.collectedFunds += Number(currentDonation);
                cause.donors.push(localStorage.getItem('userEmail'));
                return allModels.cause.donate(causeId, cause);
            })
            .then((resp)=>{
                ctx.redirect('#/cause/dashboard');
            })
        }
    }
}