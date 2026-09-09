const username =
    localStorage.getItem("username");

const role =
    localStorage.getItem("role");

// Revised version starts with no sample inventory data.
// This runs once to remove records left by earlier demo versions.
if (localStorage.getItem("inventorySystemDataVersion") !== "5") {
    localStorage.removeItem("items");
    localStorage.removeItem("rooms");
    localStorage.removeItem("inventory");
    localStorage.setItem("inventorySystemDataVersion", "5");
}


/*
    Protect pages from users
    who are not logged in.
*/
if (!username || !role) {

    window.location.href =
        "index.html";

}


/*
    Logout
*/
function logout() {

    localStorage.removeItem(
        "username"
    );

    localStorage.removeItem(
        "role"
    );

    localStorage.removeItem(
        "fullName"
    );


    window.location.href =
        "index.html";

}


/*
    Check page access
*/
function checkRole(allowedRoles) {

    if (!allowedRoles.includes(role)) {

        alert(
            "You are not authorized to access this page."
        );

        window.location.href =
            "dashboard.html";

    }

}