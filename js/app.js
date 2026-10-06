async function login() {
    const loginName = document.getElementById("loginName").value;
    const loginPassword = document.getElementById("loginPassword").value;
    const resultText = document.getElementById("loginResult");

    resultText.innerText = "";

    if (!loginName || !loginPassword) {
        resultText.innerText = "Please enter both username and password.";
        return;
    }

    const payload = {
        login: loginName,
        password: loginPassword
    };

    try {
        const response = await fetch("api/login.php", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();

        if (data.error) {
            resultText.innerText = data.error;
        } else {
            // Store variables in session, including the dynamic database admin flag
            sessionStorage.setItem("userId", data.id);
            sessionStorage.setItem("firstName", data.firstName);
            sessionStorage.setItem("lastName", data.lastName);
            sessionStorage.setItem("isAdmin", data.isAdmin);

            // Redirect to the dashboard
            window.location.href = "dashboard.html";
        }
    } catch (error) {
        resultText.innerText = "Connection error. Please try again.";
        console.error(error);
    }
}

async function register() {
    const first = document.getElementById("regFirst").value;
    const last = document.getElementById("regLast").value;
    const user = document.getElementById("regUser").value;
    const pass = document.getElementById("regPassword").value;
    const resultText = document.getElementById("regResult");

    resultText.style.color = "#ef4444"; 
    resultText.innerText = "";

    if (!first || !last || !user || !pass) {
        resultText.innerText = "Please fill out all registration fields.";
        return;
    }

    const payload = {
        firstName: first,
        lastName: last,
        login: user,
        password: pass
    };

    try {
        const response = await fetch("api/register.php", {
            method: "POST",
            body: JSON.stringify(payload),
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();

        if (data.error) {
            resultText.innerText = data.error;
        } else {
            resultText.style.color = "#10b981"; 
            resultText.innerText = "Account created! You may now log in.";
            
            document.getElementById("regFirst").value = "";
            document.getElementById("regLast").value = "";
            document.getElementById("regUser").value = "";
            document.getElementById("regPassword").value = "";
        }
    } catch (error) {
        resultText.innerText = "Connection error. Please try again.";
        console.error(error);
    }
}