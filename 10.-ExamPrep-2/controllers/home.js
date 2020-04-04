import extend from '../helpers/userState.js';

export default {
    get: {
        partials(ctx) {
            extend(ctx)
                .then(function () {
                    this.partial('../templates/home/home.hbs');
                });
        }
    }
}