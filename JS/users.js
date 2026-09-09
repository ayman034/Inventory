let users = JSON.parse(
    localStorage.getItem("users") || "[]"
);


const userForm =
    document.getElementById("userForm");

const userTableBody =
    document.getElementById("userTableBody");


function saveUsers() {

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

}


// Display users
function displayUsers() {

    if (!userTableBody) return;

    userTableBody.innerHTML = "";


    if (users.length === 0) {

        userTableBody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    style="text-align:center;"
                >
                    No users created yet
                </td>

            </tr>

        `;

        return;
    }


    users.forEach(user => {

        const status =
            user.disabled
                ? "Disabled"
                : "Active";


        const action =
            user.disabled
                ? `
                    <button
                        class="btn btn-sm btn-success"
                        onclick="toggleUser(${user.id})"
                    >
                        Enable
                    </button>
                  `
                : `
                    <button
                        class="btn btn-sm btn-warning"
                        onclick="toggleUser(${user.id})"
                    >
                        Disable
                    </button>
                  `;


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${user.id}</td>

            <td>${user.fullName}</td>

            <td>${user.userName}</td>

            <td>${user.role}</td>

            <td>${status}</td>

            <td>

                <button
                    class="btn btn-sm btn-primary"
                    onclick="editUser(${user.id})"
                >
                    Edit
                </button>

                ${action}

            </td>

        `;


        userTableBody.appendChild(row);

    });

}


// Add user
if (userForm) {

    userForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const fullName =
                document.getElementById(
                    "fullName"
                ).value.trim();


            const userName =
                document.getElementById(
                    "userName"
                ).value.trim();


            const password =
                document.getElementById(
                    "userPassword"
                ).value;


            const role =
                document.getElementById(
                    "role"
                ).value;


            if (
                !fullName ||
                !userName ||
                !password ||
                !role
            ) {

                alert(
                    "Please fill all fields."
                );

                return;
            }


            const exists =
                users.some(user =>
                    user.userName.toLowerCase() ===
                    userName.toLowerCase()
                );


            if (exists) {

                alert(
                    "This username already exists."
                );

                return;
            }


            const newId =
                users.length > 0
                    ? Math.max(
                        ...users.map(user =>
                            Number(user.id)
                        )
                    ) + 1
                    : 1;


            users.push({

                id: newId,

                fullName: fullName,

                userName: userName,

                password: password,

                role: role,

                disabled: false

            });


            saveUsers();


            alert(
                "User created successfully."
            );


            userForm.reset();

            displayUsers();

        }
    );

}


// Edit user
function editUser(id) {

    const user =
        users.find(
            user =>
                Number(user.id) ===
                Number(id)
        );


    if (!user) return;


    const fullName =
        prompt(
            "Enter full name:",
            user.fullName
        );


    if (fullName === null) return;


    const role =
        prompt(
            "Enter role (ADMIN, STOREKEEPER, SUPERVISOR):",
            user.role
        );


    if (role === null) return;


    const newRole =
        role.trim().toUpperCase();


    if (
        ![
            "ADMIN",
            "STOREKEEPER",
            "SUPERVISOR"
        ].includes(newRole)
    ) {

        alert(
            "Invalid role."
        );

        return;
    }


    user.fullName =
        fullName.trim();

    user.role =
        newRole;


    const changePassword =
        confirm(
            "Do you want to change the password?"
        );


    if (changePassword) {

        const password =
            prompt(
                "Enter new password:"
            );


        if (password) {

            user.password =
                password;

        }

    }


    saveUsers();

    displayUsers();

}


// Enable / Disable user
function toggleUser(id) {

    const user =
        users.find(
            user =>
                Number(user.id) ===
                Number(id)
        );


    if (!user) return;


    user.disabled =
        !user.disabled;


    saveUsers();

    displayUsers();

}


displayUsers();