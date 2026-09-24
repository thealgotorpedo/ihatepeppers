// Attach event listeners when the DOM loads
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm').addEventListener('submit', doLogin);
    document.getElementById('registerForm').addEventListener('submit', doRegister);
});

async function doLogin(event) {
    event.preventDefault(); // Prevent standard page reload

    // 1. Gather inputs
    const loginVal = document.getElementById('loginUsername').value;
    const passwordVal = document.getElementById('loginPassword').value;

    // 2. Format JSON exactly as login.php expects
    const payload = {
        login: loginVal,
        password: passwordVal
    };

    try {
        // 3. Send the POST request
        const response = await fetch('api/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        // 4. Parse JSON response
        const data = await response.json();

        // 5. Handle the result
        if (response.ok && data.id > 0) {
            document.getElementById('loginResult').style.color = "green";
            document.getElementById('loginResult').innerText = `Welcome back, ${data.firstName}!`;
            
            // Save user info to sessionStorage so the dashboard knows who is logged in
            sessionStorage.setItem("userId", data.id);
            sessionStorage.setItem("firstName", data.firstName);
            sessionStorage.setItem("lastName", data.lastName);

            // Redirect to dashboard page (to be created)
            window.location.href = "dashboard.html"; 
        } else {
            document.getElementById('loginResult').style.color = "red";
            document.getElementById('loginResult').innerText = data.error || "Login failed.";
        }
    } catch (err) {
        document.getElementById('loginResult').innerText = "Network error connecting to API.";
    }
}

async function doRegister(event) {
    event.preventDefault();

    const payload = {
        firstName: document.getElementById('regFirstName').value,
        lastName: document.getElementById('regLastName').value,
        login: document.getElementById('regUsername').value,
        password: document.getElementById('regPassword').value
    };

    try {
        const response = await fetch('api/register.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.status === 201) {
            document.getElementById('registerResult').style.color = "green";
            document.getElementById('registerResult').innerText = data.message;
            document.getElementById('registerForm').reset(); // Clear the form
        } else {
            document.getElementById('registerResult').style.color = "red";
            document.getElementById('registerResult').innerText = data.error || "Registration failed.";
        }
    } catch (err) {
        document.getElementById('registerResult').innerText = "Network error connecting to API.";
    }
}
