export default {
    //data is obj with username and password from controllers
    register(email, password) {
        return firebase.auth().createUserWithEmailAndPassword(email, password);
    },
    login(email, password) {
        return firebase.auth().signInWithEmailAndPassword(email, password);
    },
    logout() {
        return firebase.auth().signOut();
    }
}