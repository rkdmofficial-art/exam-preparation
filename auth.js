function showBox(box) {
  ['signupBox', 'loginBox', 'forgotBox'].forEach(id => document.getElementById(id).style.display = 'none');
  document.getElementById(box + 'Box').style.display = 'block';
}

async function authAction(type) {
  // 1. Gather data based on type (Signup/Login)
  // 2. Fetch the Apps Script Web App URL
  const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbygsfKjXMn1HxEXLP41MjWRg0linoOR3vqjUeR0wxJvF6XrzXfv-hnIO3108VTNkiaC/exec";
  
  // Example for Login
  if(type === 'login') {
    const payload = {
      action: 'login',
      email: document.getElementById('lEmail').value,
      password: document.getElementById('lPass').value
    };
    
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    
    const result = await response.json();
    if(result.success) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userName', result.firstName);
      window.location.href = 'pages/dashboard.html';
    } else {
      alert(result.msg);
    }
  }
}

// On page load, check if already logged in
window.onload = () => {
  if(localStorage.getItem('isLoggedIn') === 'true') {
     window.location.href = 'pages/dashboard.html';
  }
}
