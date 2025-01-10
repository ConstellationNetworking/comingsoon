let db = firebase.firestore();

function smoothScrollAboveElement(elementId, offset) {
    const element = document.getElementById(elementId);
    if (element) {
        const elementRect = element.getBoundingClientRect();
        const elementTop = elementRect.top + window.pageYOffset;
        window.scrollTo({
            top: elementTop - offset,
            behavior: 'smooth'
        });
    }
}

function submitForm() {
    email = document.getElementById('email').value;

    if (!email) {
        document.getElementById('email').placeholder = 'Please enter a valid email address';
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('email').value = '';
        document.getElementById('email').placeholder = 'Please enter a valid email address';
        return;
    }

    db.collection('ComingSoonSubscribers').add({
        email: email,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        browserInfo: navigator.userAgent
    })
    .then((docRef) => {
        document.getElementById('email').value = '';
        document.getElementById('email').placeholder = 'Thank you for subscribing!';
        document.getElementById('submitBtn').innerHTML = 'Done!';
    })
}

document.addEventListener('DOMContentLoaded', (event) => {
    const db = firebase.firestore();
    const tableBody = document.getElementById('positions-table-body');

    db.collection('Open_Volunteer').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();

            const row = document.createElement('tr');

            const titleCell = document.createElement('td');
            titleCell.className = 'pr-6 py-4 whitespace-nowrap'
            titleCell.textContent = data.title;
            row.appendChild(titleCell);

            const aboutCell = document.createElement('td');
            aboutCell.textContent = data.about;
            row.appendChild(aboutCell);

            const hoursCell = document.createElement('td');
            hoursCell.textContent = data.hours;
            row.appendChild(hoursCell);

            const locationCell = document.createElement('td');
            locationCell.textContent = data.location;
            row.appendChild(locationCell);

            const actionCell = document.createElement('td');
            const actionLink = document.createElement('a');
            actionLink.href = data.url;
            const actionSpan = document.createElement('span');
            actionSpan.textContent = data.action;
            actionSpan.className = `px-3 py-2 rounded-full font-semibold text-xs ${data.action === 'Active' ? 'text-green-600 bg-green-50' : 'text-blue-600 bg-blue-50'}`;
            actionLink.appendChild(actionSpan);
            actionCell.appendChild(actionLink);
            row.appendChild(actionCell);

            tableBody.appendChild(row);
        });
    });
});