var firebaseConfig = {
    apiKey: "AIzaSyA66iAwhXocKb_CkWcaYldiThXQNfg_CWg",
    authDomain: "constellation-41c9f.firebaseapp.com",
    projectId: "constellation-41c9f",
    storageBucket: "constellation-41c9f.appspot.com"
};

// Initialize Firebase
try {
    firebase.initializeApp(firebaseConfig);

    firebase.firestore().collection('Statistics').doc('website-views').set({
        views: firebase.firestore.FieldValue.increment(1)
    }, { merge: true })
} catch {
    console.error('[ERROR] Unable to initialize firebase.')
}

function loadScript(url, callback) {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = url;
    script.onload = callback;
    document.head.appendChild(script);
}

loadScript('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js', function () {
    window.onload = function () {
        console.log("%cYOU SHOULDN'T MESS AROUND HERE.", 'color:red; font-size: 28px;')
        console.log("If you know what you are doing, come volunteer with us!\nhttps://constellation.iamjerryhu.info/volunteer_positions.html")
    }

    window.resetApp = function resetApp() {
        if (firebase.auth().currentUser) {
            firebase.firestore().collection('Users').doc(firebase.auth().currentUser.uid).get().then((userDoc) => {
                if (userDoc.exists && userDoc.data().isAdmin) {
                    if (confirm('Are you sure you want to reset Constellation?')) {
                        if (CryptoJS.MD5(prompt('Please enter your password')).toString() === userDoc.data().hashed_password) {
                            if (confirm('Are you sure?')) {
                                firebase.firestore().collection('Users').get().then((users) => {
                                    users.forEach((user) => {
                                        firebase.firestore().collection('Users').doc(user.id).delete()
                                    })
                                })
                                firebase.firestore().collection('ReceivesNewsletter').get().then((statistics) => {
                                    statistics.forEach((statistic) => {
                                        firebase.firestore().collection('ReceivesNewsletter').doc(statistic.id).delete()
                                    })
                                })
                                firebase.firestore().collection('Statistics').get().then((events) => {
                                    events.forEach((event) => {
                                        firebase.firestore().collection('Statistics').doc(event.id).delete()
                                    })
                                })
                                firebase.auth().signOut()
                            }
                        } else {
                            console.error('Incorrect credentials. Access denied.')
                        }
                    }
                } else if (userDoc.exists && !userDoc.data().isAdmin) {
                    console.error('You are not an admin. Access denied.')
                }
            })
                .catch((error) => {
                    console.error(error)
                })
        }
    }
})