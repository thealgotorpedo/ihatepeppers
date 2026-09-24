document.addEventListener('DOMContentLoaded', () => {
    // 1. Verify the user is actually logged in
    const userId = sessionStorage.getItem("userId");
    const firstName = sessionStorage.getItem("firstName");

    if (!userId || userId === "0") {
        // Kick them back to the login page if there's no active session
        window.location.href = "index.html";
        return;
    }

    // 2. Personalize the dashboard
    document.getElementById('welcomeMessage').innerText = `${firstName}'s Contacts`;

    // 3. Handle Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        sessionStorage.clear(); // Wipe the session data
        window.location.href = "index.html";
    });

    // 4. Load contacts (Placeholder for your next API integration)
    loadContacts();
});

async function loadContacts() {
    const tbody = document.getElementById('contactsTableBody');
    tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 10px; color: #6b7280;">Loading contacts...</td></tr>`;
    
    // Once your teammate provides the search/read endpoint (e.g., api/search.php), 
    // you will write the fetch() call here and loop through the JSON response to build table rows.
}