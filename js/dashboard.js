document.addEventListener('DOMContentLoaded', () => {
    const userId = sessionStorage.getItem("userId");
    const firstName = sessionStorage.getItem("firstName");
    const isAdmin = sessionStorage.getItem("isAdmin");

    if (!userId) {
        window.location.href = "index.html";
        return;
    }

    document.getElementById("welcomeMessage").innerText = `Welcome, ${firstName}!`;

    // Reveal admin tools if user logged in as admin
    if (isAdmin === "true") {
        document.getElementById("adminPanel").style.display = "block";
    }

    document.getElementById("logoutButton").addEventListener("click", () => {
        sessionStorage.clear();
        window.location.href = "index.html";
    });

    document.getElementById("addContactForm").addEventListener("submit", addContact);
    
    // Load initial contacts
    searchContacts();
});

// --- User Features ---

async function addContact(event) {
    event.preventDefault();
    const payload = {
        userId: sessionStorage.getItem("userId"),
        firstName: document.getElementById('contactFirst').value,
        lastName: document.getElementById('contactLast').value,
        phone: document.getElementById('contactPhone').value,
        email: document.getElementById('contactEmail').value,
        hatedPepper: document.getElementById('contactPepper').value
    };

    try {
        const response = await fetch('api/add.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        
        if (response.ok) {
            document.getElementById('addResult').style.color = "green";
            document.getElementById('addResult').innerText = "Contact Added!";
            document.getElementById('addContactForm').reset();
            searchContacts(); // Refresh list
        } else {
            document.getElementById('addResult').style.color = "red";
            document.getElementById('addResult').innerText = data.error;
        }
    } catch (err) {
        document.getElementById('addResult').innerText = "API Error.";
    }
}

async function searchContacts() {
    const searchVal = document.getElementById('searchInput') ? document.getElementById('searchInput').value : "";
    const payload = {
        userId: sessionStorage.getItem("userId"),
        search: searchVal
    };

    try {
        const response = await fetch('api/search.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        
        const list = document.getElementById('contactsList');
        list.innerHTML = "";

        if (data.results && data.results.length > 0) {
            data.results.forEach(contact => {
                list.innerHTML += `
                    <div class="contact-card" id="card-${contact.id}">
                        <p><strong>Name:</strong> ${contact.firstName} ${contact.lastName}</p>
                        <p><strong>Phone:</strong> ${contact.phone}</p>
                        <p><strong>Email:</strong> ${contact.email}</p>
                        <p style="color: #b91c1c;"><strong>Hates:</strong> ${contact.hatedPepper} Peppers</p>
                        <div style="margin-top: 10px; display: flex; gap: 10px;">
                            <button onclick="editContact(${contact.id})" style="background: #fbbf24; color: #000; padding: 6px 12px;">Edit</button>
                            <button onclick="deleteContact(${contact.id})" style="background: #ef4444; padding: 6px 12px;">Delete</button>
                        </div>
                    </div>
                `;
            });
        } else {
            list.innerHTML = `<p style="text-align: center; color: #6b7280;">No contacts found.</p>`;
        }
    } catch (err) {
        document.getElementById('contactsList').innerHTML = `<p style="text-align: center; color: red;">Failed to load contacts.</p>`;
    }
}

async function deleteContact(contactId) {
    if(!confirm("Are you sure you want to delete this contact?")) return;
    
    const payload = { id: contactId };
    await fetch('api/delete.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    searchContacts(); // Refresh list
}

async function editContact(contactId) {
    // For presentation demo purposes, prompts are the fastest way to showcase live editing
    const newFirst = prompt("Enter new First Name:");
    if (!newFirst) return; // Cancelled
    const newPepper = prompt("What pepper do they hate now?");
    
    const payload = {
        id: contactId,
        firstName: newFirst,
        hatedPepper: newPepper
    };

    await fetch('api/edit.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    searchContacts();
}

// --- Admin Features ---

async function suspendUser() {
    const targetUser = document.getElementById('suspendUsername').value;
    const payload = { adminId: sessionStorage.getItem("userId"), targetLogin: targetUser };

    const res = await fetch('api/suspend.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    document.getElementById('adminResult').innerText = res.ok ? `User ${targetUser} suspended.` : data.error;
}

async function changePassword() {
    const targetUser = document.getElementById('changePassUsername').value;
    const newPass = document.getElementById('changePassNew').value;
    const payload = { adminId: sessionStorage.getItem("userId"), targetLogin: targetUser, newPassword: newPass };

    const res = await fetch('api/admin_password.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    const data = await res.json();
    document.getElementById('adminResult').innerText = res.ok ? `Password updated for ${targetUser}.` : data.error;
}