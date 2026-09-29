document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginForm').addEventListener('submit', doLogin);
    document.getElementById('registerForm').addEventListener('submit', doRegister);
});

async function doLogin(event) {
    event.preventDefault();

    const payload = {
        login: document.getElementById('loginUsername').value,
        password: document.getElementById('loginPassword').value,
        isAdminRequest: document.getElementById('isAdmin').checked // Flags if user is trying to use Admin portal
    };

    try {
        const response = await fetch('api/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok && data.id > 0) {
            sessionStorage.setItem("userId", data.id);
            sessionStorage.setItem("firstName", data.firstName);
            sessionStorage.setItem("lastName", data.lastName);
            
            // Assume the API returns an 'isAdmin' boolean confirming their admin status
            sessionStorage.setItem("isAdmin", payload.isAdminRequest ? "true" : "false");

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
            document.getElementById('registerForm').reset();
        } else {
            document.getElementById('registerResult').style.color = "red";
            document.getElementById('registerResult').innerText = data.error || "Registration failed.";
        }
    } catch (err) {
        document.getElementById('registerResult').innerText = "Network error connecting to API.";
    }
}