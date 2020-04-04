import { createFormEntity } from "./form-helpers.js";
import { fireBaseRequestFactory } from "./firebase-requests.js";
import { requester } from "./requester.js";
import { displayError, displaySuccess } from "./notifications.js";

const NO_VALUE = 'no_value_placeholder';

const apiKey = 'https://exam-20187.firebaseio.com/';
requester.init(apiKey, sessionStorage.getItem('token'));

async function addHeaderFooter() {
    //if is loggedIn
    this.email = sessionStorage.getItem('email');
    this.loggedIn = !!sessionStorage.getItem('token');
    
    // const firebaseUserMeta = fireBaseRequestFactory('https://exam-20187.firebaseio.com/', 'userMeta', sessionStorage.getItem('token'));

    this.partials = {
        header: await this.load('./templates/common/header.hbs'),

        footer: await this.load('./templates/common/footer.hbs')
    }

    // if (sessionStorage.getItem('userId')) {
    //     this.hasNoTeam = await firebaseUserMeta
    //         .getById(sessionStorage.getItem('userId'))
    //         .then(res => {
    //             return !res || (res && res.team == NO_VALUE);
    //         });
    // }
}
async function homeTabHandler() {
    // .call(this) return context of addHeaderFooter
    await addHeaderFooter.call(this);

    const treks = await requester.treks.getAll();
    this.treks = treks;
    // console.log(treks)
    this.treks = Object.entries(treks || {}).map(([trekId, trek]) => ({
        ...trek,
        trekId
    })).sort(((a, b) => b.likes - a.likes));

    this.loggedInWithTreks = sessionStorage.getItem('token') && this.treks.length > 0;
    this.loggedInWithNoTreks = sessionStorage.getItem('token') && this.treks.length === 0;
    this.partial('./templates/home/home.hbs');

}
async function registerTabHandler() {
    await addHeaderFooter.call(this);

    await this.partial('./templates/register/registerPage.hbs');

    const formRef = document.querySelector("form");
    // console.log(formRef);

    formRef.addEventListener('submit', async (e) => {
        e.preventDefault();

        let form = createFormEntity(formRef, ['email', 'password', 'rePassword']);

        let formValue = form.getValue();

        if (formValue.password !== formValue.rePassword) {
            throw Error('Password and RePassword must be equal!');
        }

        const newUser = await firebase.auth().createUserWithEmailAndPassword(formValue.email, formValue.password);
        // console.log(newUser); //return firebase user

        //check if it works in window console:
        //1. firebase.auth().currentUser;
        //2. firebase.auth().currentUser.getIdToken().then(k=>console.log(k));
        let userToken = await firebase.auth().currentUser.getIdToken();
        //from sessionStorage
        sessionStorage.setItem('email', newUser.user.email);
        sessionStorage.setItem('userId', firebase.auth().currentUser.uid);

        sessionStorage.setItem('token', userToken);

        displaySuccess("Successfully registered user!");

        this.redirect(['#/home']);
    })
}
async function loginTabHandler() {
    await addHeaderFooter.call(this);
    await this.partial('./templates/login/loginPage.hbs');
    // console.log(document.querySelector('#login-form'));

    let formRef = document.querySelector('form');
    formRef.addEventListener('submit', async (e) => {
        e.preventDefault();

        let form = createFormEntity(formRef, ['email', 'password']);
        let formValue = form.getValue();

        //firebase ajax
        const loggedInUser = await firebase.auth().signInWithEmailAndPassword(formValue.email, formValue.password);
        if (!loggedInUser) {
            displayError();
        }
        const userToken = await firebase.auth().currentUser.getIdToken();
        sessionStorage.setItem('email', loggedInUser.user.email);
        sessionStorage.setItem('userId', firebase.auth().currentUser.uid);

        sessionStorage.setItem('token', userToken);

        displaySuccess("Successfully logged user!");

        this.redirect(['#/home']);
    });

}
async function logoutHandler() {
    sessionStorage.clear();
    firebase.auth().signOut();
    displaySuccess("Logout successful!");
    this.redirect(['#/home']);
}
async function createTrekHandler() {
    await addHeaderFooter.call(this);

    await this.partial('./templates/create/createPage.hbs');

    // const firebaseTeams = fireBaseRequestFactory('https://exam-20187.firebaseio.com/', 'teams', sessionStorage.getItem('token'));
    // const firebaseUserMeta = fireBaseRequestFactory('https://exam-20187.firebaseio.com/', 'userMeta', sessionStorage.getItem('token'));

    let formRef = document.querySelector('form');
    formRef.addEventListener('submit', async e => {
        e.preventDefault();

        // let form = createFormEntity(formRef, ['name', 'comment']);
        let form = createFormEntity(formRef, ['location', 'dateTime', 'description', 'imageURL']);
       
        let formValue = form.getValue();
        // formValue.teamMembers = [{
        //     id: sessionStorage.getItem('userId'),
        //     name: sessionStorage.getItem('username')
        // }];
        formValue.createdById = sessionStorage.getItem('userId');
        formValue.createdByName = sessionStorage.getItem('email');
        formValue.likes = 0;

        // let createdTeam = 
        // await firebaseTeams.createEntity(formValue);
        await requester.treks.createEntity(formValue);
        // await firebaseUserMeta.patchEntity({
        //     createdTeams: createdTeam.name,
        //     team: createdTeam.name,
        // }, sessionStorage.getItem('userId'));

        // this.redirect('#/home');
        form.clear();
        // formRef.reset();
    });
    displaySuccess("Trek created successfully.");
}
async function detailsHandler() {
    // const firebaseTeams = fireBaseRequestFactory('https://exam-20187.firebaseio.com/', 'treks', sessionStorage.getItem('token'));

    //get 1 trek from database then added it to template
    //-- this.params comes from the navigation url!!
    this.teamId = this.params.id;

    // let { name, comment, teamMembers, createdBy } = await firebaseTeams.getById(this.params.id);
    let trek = await requester.treks.getById(this.params.id);
    // let trek = await firebaseTeams.getById(this.params.id);
    // console.log(trek);

    // this.name = name;
    // this.comment = comment;
    // this.members = (teamMembers || []).map(member => ({ username: member.name }));
    // this.isAuthor = createdBy === sessionStorage.getItem('userId');
    // this.isOnTeam = (teamMembers || []).find(x => x.id === sessionStorage.getItem('userId'));
    let {
        createdByName,
        dateTime,
        description,
        imageURL,
        likes,
        location,
        createdById
    } = await requester.treks.getById(this.params.id);
    //from database to template
    this.trekId = this.params.id;
    this.dateTime = dateTime;
    this.description = description;
    this.imageURL = imageURL;
    this.likes = likes;
    this.location = location;
    this.createdByName = createdByName;
    this.userIsCreator = sessionStorage.getItem('userId') === createdById;

    await addHeaderFooter.call(this);
    // this.partials.teamMember = await this.load('./templates/catalog/teamMember.hbs');
    // this.partials.teamControls = await this.load('./templates/catalog/teamControls.hbs');
    this.partial('./templates/details/details.hbs');
}
async function likesHandler() {
    await requester.treks.patchEntity({
        likes: Number(this.params.currentLikes) +1
    }, this.params.id)

    this.redirect(`#/details/${this.params.id}`)
    return false;

}
async function editTrekHandler() {
    /**
     * Load hbs templates
     */
    await addHeaderFooter.call(this);
    // this.partials.editForm = await this.load('./templates/edit/editForm.hbs');
    await this.partial('./templates/edit/editPage.hbs');

    // const firebaseTeams = fireBaseRequestFactory('https://exam-20187.firebaseio.com/', 'teams', sessionStorage.getItem('token'));
    /**
     * Handling form events part
     */
    let formRef = document.querySelector('form');
    // let form = createFormEntity(formRef, ['name', 'comment']);
    let form = createFormEntity(formRef, ['location', 'dateTime', 'description', 'imageURL']);
    /**
     * Load and set the initial form value for edit
     */
    // const teamToEdit = await firebaseTeams.getById(this.params.id);
    const trekToEdit = await requester.treks.getById(this.params.id);
    form.setValue(trekToEdit);

    formRef.addEventListener('submit', async e => {
        e.preventDefault();
        // let form = createFormEntity(formRef, ['name', 'comment']);
        let form = createFormEntity(formRef, ['location', 'dateTime', 'description', 'imageURL']);
        let formValue = form.getValue();

        // await firebaseTeams.patchEntity(formValue, this.params.id);
        await requester.treks.patchEntity(formValue, this.params.id);

        /** 
         * Navigates back to the catalog details
         */
        // this.redirect(`#/catalog/${this.params.id}`);
        displaySuccess("Trek edited successfully.");
        this.redirect(['#/home']);
    });
}
async function deleteTrekHandler() {
    //this.params.id === Entity ID
    await requester.treks.deleteEntity(this.params.id);
    displaySuccess("You closed the trek successfully.");
    this.redirect(['#/home']);
}
async function profileHandler() {
    let allTreks = await requester.treks.getAll();
    // console.log(allTreks);
    let currUserTreks = Object.values(allTreks).reduce((acc, x)=>{
        if(x.createdByName === sessionStorage.getItem('email')){
            acc.push(x);
        }
        return acc;
    }, []) //.filter(t=>t.createdByName === sessionStorage.getItem('email'));
    // console.log(currUserTreks);
    this.createdByName = sessionStorage.getItem('email');
    this.treksCount = currUserTreks.length;
    this.treks = currUserTreks.map(x=>x.location);
    await addHeaderFooter.call(this);
    this.partial('./templates/profile/profile.hbs');
}

// initialize the application
const app = Sammy('#main', function () {
    // include a plugin
    this.use('Handlebars', 'hbs');
    // define a 'route'
    //home
    this.get('#/', homeTabHandler);
    this.get('#/home', homeTabHandler);
    //register
    this.get('#/register', registerTabHandler);
    this.post('#/register', false);
    //logout
    this.get('#/logout', logoutHandler);
    //login
    this.get('#/login', loginTabHandler);
    this.post('#/login', false);
    //create Trek
    this.get('#/create', createTrekHandler);
    this.post('#/create', false);
    //details ID
    this.get('#/details/:id', detailsHandler);
    //likes
    this.get('#/likes/:currentLikes/:id', likesHandler);
    //edit Trek
    this.get('#/edit/:id', editTrekHandler);
    this.post('#/edit/:id', () => false);
    //delete Trek
    this.get('#/delete/:id', deleteTrekHandler);
    //profile
    this.get('#/profile', profileHandler);

});
// start the application
app.run('#/');