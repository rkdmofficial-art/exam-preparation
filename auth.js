const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbygsfKjXMn1HxEXLP41MjWRg0linoOR3vqjUeR0wxJvF6XrzXfv-hnIO3108VTNkiaC/exec"; // PASTE URL HERE

function showBox(boxId) {
    document.getElementById('loginBox').style.display = 'none';
    document.getElementById('signupBox').style.display = 'none';
    document.getElementById('forgotBox').style.display = 'none';
    document.getElementById(boxId + 'Box').style.display = 'block';
}

async function authAction(actionType) {
    let payload = { action: actionType };

    if (actionType === 'signup') {
        const p1 = document.getElementById('sPass').value;
        const p2 = document.getElementById('sPassConfirm').value;
        if (p1 !== p2) return alert("Passwords do not match");

        payload = {
            ...payload,
            firstName: document.getElementById('fName').value,
            lastName: document.getElementById('lName').value,
            email: document.getElementById('sEmail').value,
            phone: document.getElementById('countryCode').value + document.getElementById('phone').value,
            password: p1
        };
    } else if (actionType === 'login') {
        payload.email = document.getElementById('lEmail').value;
        payload.password = document.getElementById('lPass').value;
    }

    // Call Apps Script
    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: JSON.stringify(payload)
        });
        const result = await response.json();

        if (result.success) {
            if (actionType === 'login') {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userName', result.firstName);
                window.location.href = 'pages/dashboard.html';
            } else {
                alert(result.msg);
                showBox('login');
            }
        } else {
            alert(result.msg);
        }
    } catch (e) {
        alert("Server connection failed.");
    }
}
