export default {
    create(data) {
        //Cloudstore Firebase method                   or {...data}
        return firebase.firestore().collection('articles').add(data)
        // 'articles' is manually created i DB in Firebase!!!
    },
    getAll() {
        return firebase.firestore().collection('articles').get()
    },
    getById(id) {
        return firebase.firestore().collection("articles").doc(id).get();
    },
    close(id) {
        return firebase.firestore().collection('articles').doc(id).delete();
    },
    edit(id, data) {
        return firebase.firestore().collection('articles').doc(id).update(data);
    }
};