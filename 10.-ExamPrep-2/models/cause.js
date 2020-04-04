export default {
        create(data) {
           
            //Cloudstore Firebase method                   or {...data}
            return firebase.firestore().collection('causes').add(data)
            // 'causes' is manually created i DB in Firebase!!!
            
        },
        getAll() {
            return firebase.firestore().collection('causes').get()
        },
        getById(id) {
            return firebase.firestore().collection("causes").doc(id).get();
        },
        close(id) {
            return firebase.firestore().collection('causes').doc(id).delete();
        },
        donate(id, data) {
            return firebase.firestore().collection('causes').doc(id).update(data);
        }
};