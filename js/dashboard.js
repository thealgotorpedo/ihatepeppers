document.addEventListener('DOMContentLoaded', () => {
    const userId = sessionStorage.getItem("userId");
    const firstName = sessionStorage.getItem("firstName");
    const isAdmin = sessionStorage.getItem("isAdmin");

    if (!userId) {
        window.location.href = "index.html";
        return;
    }

    document.getElementById("welcomeMessage").innerText = `Welcome, ${firstName}!`;

    document.getElementById("logoutButton").addEventListener("click", () => {
        sessionStorage.clear();
        window.location.href = "index.html";
    });

    // Toggle Views based on Role
    if (isAdmin === "true") {
        document.getElementById("adminView").style.display = "block";
        loadAllUsers();
    } else {
        document.getElementById("userView").style.display = "block";
        document.getElementById("addContactForm").addEventListener("submit", addContact);
        searchContacts();
    }
});

// ---------- STANDARD USER LOGIC ----------

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

    const res = await fetch('api/add.php', { method: 'POST', body: JSON.stringify(payload) });
    if (res.ok) {
        document.getElementById('addContactForm').reset();
        searchContacts(); 
    }
}

async function searchContacts() {
    const searchVal = document.getElementById('searchInput') ? document.getElementById('searchInput').value : "";
    const payload = { userId: sessionStorage.getItem("userId"), search: searchVal };

    const res = await fetch('api/search.php', { method: 'POST', body: JSON.stringify(payload) });
    const data = await res.json();
    const list = document.getElementById('contactsList');
    list.innerHTML = "";

    data.results.forEach(contact => {
        list.innerHTML += `
            <div class="contact-card" id="card-${contact.id}">
                <div id="view-${contact.id}">
                    <p><strong>Name:</strong> ${contact.firstName} ${contact.lastName}</p>
                    <p><strong>Phone:</strong> ${contact.phone} | <strong>Email:</strong> ${contact.email}</p>
                    <p style="color: #b91c1c;"><strong>Hates:</strong> ${contact.hated_pepper} Peppers</p>
                    <div style="margin-top: 10px; display: flex; gap: 10px;">
                        <button onclick="enableEdit(${contact.id})" style="background: #fbbf24; color: #000; padding: 6px 12px;">Edit</button>
                        <button onclick="deleteContact(${contact.id})" style="background: #ef4444; padding: 6px 12px;">Delete</button>
                    </div>
                </div>
                <div id="edit-${contact.id}" style="display: none; flex-direction: column; gap: 8px;">
                    <input type="text" id="editFirst-${contact.id}" value="${contact.firstName}">
                    <input type="text" id="editLast-${contact.id}" value="${contact.lastName}">
                    <input type="tel" id="editPhone-${contact.id}" value="${contact.phone}">
                    <input type="email" id="editEmail-${contact.id}" value="${contact.email}">
                    <input type="text" id="editPepper-${contact.id}" value="${contact.hated_pepper}">
                    <div style="margin-top: 10px; display: flex; gap: 10px;">
                        <button onclick="saveContact(${contact.id})" style="background: #10b981; color: #fff; padding: 6px 12px;">Save</button>
                        <button onclick="cancelEdit(${contact.id})" style="background: #6b7280; padding: 6px 12px;">Cancel</button>
                    </div>
                </div>
            </div>`;
    });
}

function enableEdit(id) {
    document.getElementById(`view-${id}`).style.display = 'none';
    document.getElementById(`edit-${id}`).style.display = 'flex';
}

function cancelEdit(id) {
    document.getElementById(`view-${id}`).style.display = 'block';
    document.getElementById(`edit-${id}`).style.display = 'none';
}

async function saveContact(id) {
    const payload = {
        id: id,
        firstName: document.getElementById(`editFirst-${id}`).value,
        lastName: document.getElementById(`editLast-${id}`).value,
        phone: document.getElementById(`editPhone-${id}`).value,
        email: document.getElementById(`editEmail-${id}`).value,
        hatedPepper: document.getElementById(`editPepper-${id}`).value
    };
    await fetch('api/edit.php', { method: 'POST', body: JSON.stringify(payload) });
    searchContacts();
}

async function deleteContact(id) {
    if(!confirm("Delete contact?")) return;
    await fetch('api/delete.php', { method: 'POST', body: JSON.stringify({ id }) });
    searchContacts(); 
}

// ---------- ADMIN LOGIC ----------

async function createAdmin() {
    const payload = {
        firstName: document.getElementById('newAdminFirst').value,
        lastName: document.getElementById('newAdminLast').value,
        login: document.getElementById('newAdminUser').value,
        password: document.getElementById('newAdminPass').value
    };
    const res = await fetch('api/admin_create.php', { method: 'POST', body: JSON.stringify(payload) });
    if (res.ok) {
        document.getElementById('adminCreateResult').innerText = "Admin created successfully.";
        loadAllUsers(); // Refresh the list
    }
}

async function adminGlobalSearch() {
    const payload = { search: document.getElementById('adminContactSearch').value };
    const res = await fetch('api/admin_search_all.php', { method: 'POST', body: JSON.stringify(payload) });
    const data = await res.json();
    const list = document.getElementById('adminContactsList');
    list.innerHTML = "";
    
    if (data.results.length === 0) list.innerHTML = "<p>No entries found.</p>";
    data.results.forEach(c => {
        list.innerHTML += `
            <div class="contact-card" style="border-left: 4px solid #4f46e5;">
                <p><strong>Owner:</strong> ${c.owner} | <strong>Contact:</strong> ${c.firstName} ${c.lastName}</p>
                <p><strong>Phone:</strong> ${c.phone} | <strong>Email:</strong> ${c.email}</p>
                <p style="color: #b91c1c;"><strong>Hates:</strong> ${c.hated_pepper}</p>
            </div>`;
    });
}

async function loadAllUsers() {
    const res = await fetch('api/admin_get_users.php');
    const data = await res.json();
    const list = document.getElementById('usersList');
    list.innerHTML = "";

    data.results.forEach(u => {
        const role = u.isAdmin ? "Admin" : "Standard User";
        const status = u.isSuspended ? "Suspended" : "Active";
        const statusColor = u.isSuspended ? "#ef4444" : "#10b981";
        const toggleAction = u.isSuspended ? 0 : 1;
        const toggleText = u.isSuspended ? "Unsuspend" : "Suspend";

        list.innerHTML += `
            <div class="contact-card" style="background: #f3f4f6;">
                <p><strong>${u.login}</strong> (${u.firstName} ${u.lastName})</p>
                <p>Role: ${role} | Status: <strong style="color: ${statusColor};">${status}</strong></p>
                <div style="display: flex; gap: 10px; margin-top: 10px;">
                    <input type="password" id="pass-${u.login}" placeholder="New Password" style="padding: 6px;">
                    <button onclick="changePassword('${u.login}')" style="background: #fbbf24; color: #000; padding: 6px 12px; margin: 0;">Update Pass</button>
                    <button onclick="toggleSuspend('${u.login}', ${toggleAction})" style="background: #ef4444; padding: 6px 12px; margin: 0;">${toggleText}</button>
                </div>
            </div>`;
    });
}

async function toggleSuspend(targetLogin, newState) {
    const payload = { targetLogin: targetLogin, state: newState };
    await fetch('api/suspend.php', { method: 'POST', body: JSON.stringify(payload) });
    loadAllUsers();
}

async function changePassword(targetLogin) {
    const newPass = document.getElementById(`pass-${targetLogin}`).value;
    if (!newPass) return alert("Enter a new password first.");
    const payload = { targetLogin: targetLogin, newPassword: newPass };
    await fetch('api/admin_password.php', { method: 'POST', body: JSON.stringify(payload) });
    alert(`Password updated for ${targetLogin}`);
}