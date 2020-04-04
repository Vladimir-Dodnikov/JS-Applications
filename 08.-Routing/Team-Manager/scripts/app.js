import {
    createFormEntity
} from "./form-helpers.js";
import {
    fireBaseRequestFactory
} from "./firebase-requests.js";

const NO_VALUE = 'no_value_placeholder';


async function addHeaderFooter() {
    //if is loggedIn
    this.username = sessionStorage.getItem('username');
    this.loggedIn = !!sessionStorage.getItem('token');
    const firebaseUserMeta = fireBaseRequestFactory('https://exam-20187.firebaseio.com/', 'userMeta', sessionStorage.getItem('token'));

    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs')
    }

    if (sessionStorage.getItem('userId')) {
        this.hasNoTeam = await firebaseUserMeta
            .getById(sessionStorage.getItem('userId'))
            .then(res => {
                return !res || (res && res.team == NO_VALUE);
            });
    }
}

async function homeTabHandler() {
    // .call(this) return context of addHeaderFooter
    await addHeaderFooter.call(this);
    this.partial('./templates/home/home.hbs');
}
async function aboutTabHandler() {
    await addHeaderFooter.call(this);
    this.partial('./templates/about/about.hbs');
}
async function loginTabHandler() {
    await addHeaderFooter.call(this);
    this.partials.loginForm = await this.load('./templates/login/loginForm.hbs');

    await this.partial('./templates/login/loginPage.hbs');
    // console.log(document.querySelector('#login-form'));

    let formRef = document.querySelector('#login-form');
    formRef.addEventListener('submit', async e => {
        e.preventDefault();

        let form = createFormEntity(formRef, ['username', 'password']);
        let formValue = form.getValue();

        /**
         * Authenticates a user with email and password
         */
        const loggedInUser = await firebase.auth().signInWithEmailAndPassword(formValue.username, formValue.password);
        const userToken = await firebase.auth().currentUser.getIdToken();
        sessionStorage.setItem('username', loggedInUser.user.email);
        sessionStorage.setItem('userId', firebase.auth().currentUser.uid);

        sessionStorage.setItem('token', userToken);

        this.redirect(['#/home']);
    });
}
async function registerTabHandler() {
    await addHeaderFooter.call(this);
    this.partials.registerForm = await this.load('./templates/register/registerForm.hbs');

    await this.partial('./templates/register/registerPage.hbs');

    const formRef = document.querySelector("#register-form");
    // console.log(formRef);

    formRef.addEventListener('submit', async (e) => {
        e.preventDefault();

        let form = createFormEntity(formRef, ['username', 'password', 'repeatPassword']);
        let formValue = form.getValue();

        if (formValue.password !== formValue.repeatPassword) {
            throw new Error('Password and Repeat Password must be equal!');
        }

        const newUser = await firebase.auth().createUserWithEmailAndPassword(formValue.username, formValue.password);
        // console.log(newUser); //return firebase user

        //check if it works in window console:
        //1. firebase.auth().currentUser;
        //2. firebase.auth().currentUser.getIdToken().then(k=>console.log(k));
        let userToken = await firebase.auth().currentUser.getIdToken();
        //from sessionStorage
        sessionStorage.setItem('username', newUser.user.email);
        sessionStorage.setItem('userId', firebase.auth().currentUser.uid);

        sessionStorage.setItem('token', userToken);

        this.redirect(['#/home']);
    })
}
async function logoutHandler() {
    sessionStorage.clear();
    firebase.auth().signOut();
    this.redirect(['#/home']);
}
async function catalogHandler() {
    //firebase authentication
    // const token = sessionStorage.getItem('token');
    // console.log(token);
    // fetch('https://exam-20187.firebaseio.com/.json?auth=' + token).then(r => r.json())
    //     .then(response => console.log(response))
    const firebaseTeams = fireBaseRequestFactory('https://exam-20187.firebaseio.com/', 'teams', sessionStorage.getItem('token'));
    this.teams = Object.entries(await firebaseTeams.getAll().then(x => x || {})).map(([ id, value]) => ({ _id: id, ...value }));
    
    await addHeaderFooter.call(this);
    this.partials.team = await this.load('./templates/catalog/team.hbs');
    await this.partial('./templates/catalog/teamCatalog.hbs');
}
async function createTeamHandler() {
    await addHeaderFooter.call(this);
    this.partials.createForm = await this.load('./templates/create/createForm.hbs');

    await this.partial('./templates/create/createPage.hbs');

    const firebaseTeams = fireBaseRequestFactory('https://exam-20187.firebaseio.com/', 'teams', sessionStorage.getItem('token'));
    const firebaseUserMeta = fireBaseRequestFactory('https://exam-20187.firebaseio.com/', 'userMeta', sessionStorage.getItem('token'));

    let formRef = document.querySelector('#create-form');
    formRef.addEventListener('submit', async e => {
        e.preventDefault();

        let form = createFormEntity(formRef, ['name', 'comment']);
        let formValue = form.getValue();
        formValue.teamMembers = [{
            id: sessionStorage.getItem('userId'),
            name: sessionStorage.getItem('username')
        }];
        formValue.createdBy = sessionStorage.getItem('userId');

        let createdTeam = await firebaseTeams.createEntity(formValue);

        await firebaseUserMeta.patchEntity({
            createdTeams: createdTeam.name,
            team: createdTeam.name,
        }, sessionStorage.getItem('userId'));

        this.redirect('#/catalog');
    });
}
async function catalogIdHandler() {
    const firebaseTeams = fireBaseRequestFactory('https://exam-20187.firebaseio.com/', 'teams', sessionStorage.getItem('token'));
    /**
     * Gets one team from the db and map it to the expected by the template value + add it to the template context
     * 
     * -- this.params comes from the navigation url!!
     */
    this.teamId = this.params.id;
    
    let { name, comment, teamMembers, createdBy } = await firebaseTeams.getById(this.params.id);
    this.name = name;
    this.comment = comment;
    this.members = (teamMembers || []).map(member => ({ username: member.name }));
    this.isAuthor = createdBy === sessionStorage.getItem('userId');
    this.isOnTeam = (teamMembers || []).find(x => x.id === sessionStorage.getItem('userId'));
    
    await addHeaderFooter.call(this);
    this.partials.teamMember = await this.load('./templates/catalog/teamMember.hbs');
    this.partials.teamControls = await this.load('./templates/catalog/teamControls.hbs');
    this.partial('./templates/catalog/details.hbs');
}
async function joinTeamHandler() {
    /**
     * Get data about the team the user wants to join
     * -- this.params comes from the url
     */
    const firebaseTeams = fireBaseRequestFactory('https://exam-20187.firebaseio.com/', 'teams', sessionStorage.getItem('token'));
    const firebaseUserMeta = fireBaseRequestFactory('https://exam-20187.firebaseio.com/', 'userMeta', sessionStorage.getItem('token'));
    let team = await firebaseTeams.getById(this.params.id);
    /** 
     * Updates the user meta data with the id of the team he/she joins 
     * Updates the teamsData with the id and the name of the user that is joining
     */
    await firebaseUserMeta.patchEntity({ team: this.params.id }, sessionStorage.getItem('userId'));
    await firebaseTeams.patchEntity(
        {
            teamMembers: [...(team.teamMembers || []),
            {
                name: sessionStorage.getItem('username'),
                id: sessionStorage.getItem('userId')
            }
            ]
        },
        this.params.id
    );
    /** 
     * Navigates back to the catalog details
     */
    this.redirect(`#/catalog/${this.params.id}`);
}
async function leaveTeamHandler() {
    /**
     * Get data about the team the user wants to leave
     * -- this.params comes from the url
     */
    const firebaseTeams = fireBaseRequestFactory('https://exam-20187.firebaseio.com/', 'teams', sessionStorage.getItem('token'));
    const firebaseUserMeta = fireBaseRequestFactory('https://exam-20187.firebaseio.com/', 'userMeta', sessionStorage.getItem('token'));
    let team = await firebaseTeams.getById(this.params.id);

    /** 
     * Updates the user meta data with the id of the team he/she leave 
     * Removes from teamsData the leaving user
     */
    await firebaseUserMeta.patchEntity({ team: NO_VALUE, createdTeams: NO_VALUE }, sessionStorage.getItem('userId'));
    await firebaseTeams.patchEntity(
        {
            teamMembers: [
                ...(team.teamMembers || [])
                    .filter(teamMember => teamMember.id !== sessionStorage.getItem('userId'))
            ]
        },
        this.params.id
    );
    /** 
     * Navigates back to the catalog details
     */
    this.redirect(`#/catalog/${this.params.id}`);
}
async function editTeamHandler() {
    /**
     * Load hbs templates
     */
    await addHeaderFooter.call(this);
    this.partials.editForm = await this.load('./templates/edit/editForm.hbs');
    await this.partial('./templates/edit/editPage.hbs');

    const firebaseTeams = fireBaseRequestFactory('https://exam-20187.firebaseio.com/', 'teams', sessionStorage.getItem('token'));
    /**
     * Handling form events part
     */
    let formRef = document.querySelector('#edit-form');
    let form = createFormEntity(formRef, ['name', 'comment']);

    /**
     * Load and set the initial form value for edit
     */
    const teamToEdit = await firebaseTeams.getById(this.params.id);
    form.setValue(teamToEdit);

    formRef.addEventListener('submit', async e => {
        e.preventDefault();
        let form = createFormEntity(formRef, ['name', 'comment']);
        let formValue = form.getValue();

        await firebaseTeams.patchEntity(formValue, this.params.id);

        /** 
         * Navigates back to the catalog details
         */
        this.redirect(`#/catalog/${this.params.id}`);
    });
}
// initialize the application
const app = Sammy('#main', function () {
    // include a plugin
    this.use('Handlebars', 'hbs');
    // define a 'route'
    //home
    this.get('#/', homeTabHandler);
    this.get('#/home', homeTabHandler);
    //about
    this.get('#/about', aboutTabHandler);
    //login
    this.get('#/login', loginTabHandler);
    this.post('#/login', false);
    //register 
    this.get('#/register', registerTabHandler);
    this.post('#/register', false);
    //logout
    this.get('#/logout', logoutHandler);
    //catalogue
    this.get('#/catalog', catalogHandler);
    this.post('#/catalog', false);
    //catalogue ID
    this.get('#/catalog/:id', catalogIdHandler);
    //create Team
    this.get('#/create', createTeamHandler);
    this.post('#/create', false);
    //join Team
    this.get('#/join/:id', joinTeamHandler);
    //leave Team
    this.get('#/leave/:id', leaveTeamHandler);
    //edit Team
    this.get('#/edit/:id', editTeamHandler);
    this.post('#/edit/:id', () => false);
});


// start the application
app.run('#/');