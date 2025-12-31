const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbygsfKjXMn1HxEXLP41MjWRg0linoOR3vqjUeR0wxJvF6XrzXfv-hnIO3108VTNkiaC/exec";

function showBox(boxId) {
    document.getElementById('loginBox').style.display = 'none';
    document.getElementById('signupBox').style.display = 'none';
    document.getElementById('forgotBox').style.display = 'none';
    document.getElementById(boxId + 'Box').style.display = 'block';
}

async function authAction(actionType) {
    const loader = document.getElementById('globalLoader');
    loader.style.display = 'flex';
    
    let payload = { action: actionType };

    // Case 1: SIGNUP
    if (actionType === 'signup') {
        const p1 = document.getElementById('sPass').value;
        const p2 = document.getElementById('sPassConfirm').value;
        if (p1 !== p2) {
            loader.style.display = 'none';
            return alert("Passwords do not match");
        }
        payload = {
            ...payload,
            firstName: document.getElementById('fName').value,
            lastName: document.getElementById('lName').value,
            email: document.getElementById('sEmail').value,
            phone: document.getElementById('countryCode').value + document.getElementById('phone').value,
            password: p1
        };
    } 
    // Case 2: LOGIN
    else if (actionType === 'login') {
        payload.email = document.getElementById('lEmail').value;
        payload.password = document.getElementById('lPass').value;
    }
    // Case 3: SEND OTP (Forgot Password Step 1)
    else if (actionType === 'sendOTP') {
        payload.email = document.getElementById('fEmail').value;
    }
    // Case 4: RESET PASSWORD (Forgot Password Step 2)
    else if (actionType === 'reset') {
        payload.email = document.getElementById('fEmail').value;
        payload.otp = document.getElementById('otpInput').value;
        payload.newPassword = document.getElementById('newPass').value;
    }

    try {
        // Use 'follow' redirect to handle Google Apps Script's 302 redirect
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Important for Google Apps Script POST
            body: JSON.stringify(payload)
        });

        /* NOTE: 'no-cors' prevents us from reading the response body. 
           To actually read the 'Success' message, we must use a GET request 
           or a library. However, for a professional setup, we use this 
           workaround to get the result:
        */
        const resultResponse = await fetch(
  `${SCRIPT_URL}?action=checkStatus&email=${encodeURIComponent(payload.email || '')}`
);
        let result;
try {
    result = await resultResponse.json();
} catch (err) {
    throw new Error("Invalid JSON response from server");
}

        loader.style.display = 'none';

        if (result.success) {
            if (actionType === 'login') {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userName', result.firstName);
                window.location.href = 'pages/dashboard.html';
            } else if (actionType === 'sendOTP') {
                document.getElementById('step1').style.display = 'none';
                document.getElementById('otpSection').style.display = 'block';
                alert("OTP sent to your email!");
            } else if (actionType === 'reset') {
                alert("Password updated successfully!");
                showBox('login');
            } else {
                alert(result.msg);
                showBox('login');
            }
        } else {
            alert(result.msg);
        }
    } catch (e) {
        loader.style.display = 'none';
        console.error(e);
        alert("Action completed. If redirect failed, please try logging in.");
    }
}
