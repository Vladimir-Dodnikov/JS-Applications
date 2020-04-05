export default function (ctx) {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            // console.log(user);
            ctx.isLoggedIn = true;
            ctx.username = user.email;
            ctx.userId = user.uid;
            
            localStorage.setItem('userId', user.uid);
            localStorage.setItem('userEmail', user.email);
            // ...
        } else {
            // User is signed out.
            ctx.isLoggedIn = false;
            ctx.username = null;
            ctx.userId = null;
           
            localStorage.removeItem('userId');
            localStorage.removeItem('userEmail');
        }
    });

    return ctx.loadPartials({
        // notifications: '../templates/common/notifications.hbs',
        header: '../templates/common/header.hbs',
        footer: '../templates/common/footer.hbs'
    });
}