document
    .getElementById("loginForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const username =
                document
                    .getElementById("username")
                    .value
                    .trim();


            const password =
                document
                    .getElementById("password")
                    .value;


            const message =
                document.getElementById(
                    "message"
                );


            // Default accounts
            const builtInUsers = {

                admin: {
                    role: "ADMIN",
                    fullName:
                        "System Administrator"
                },

                store: {
                    role: "STOREKEEPER",
                    fullName:
                        "Storekeeper"
                },

                supervisor: {
                    role: "SUPERVISOR",
                    fullName:
                        "Supervisor"
                }

            };


            let loggedUser = null;


            // Get registered users
            const users =
                JSON.parse(
                    localStorage.getItem(
                        "users"
                    ) || "[]"
                );


            // Check created users
            const found =
                users.find(user =>
                    user.userName === username &&
                    user.password === password &&
                    !user.disabled
                );


            if (found) {

                loggedUser = found;

            }


            // Check built-in users
            else if (
                builtInUsers[username] &&
                password === "1234"
            ) {

                loggedUser = {

                    userName:
                        username,

                    fullName:
                        builtInUsers[
                            username
                        ].fullName,

                    role:
                        builtInUsers[
                            username
                        ].role

                };

            }


            // Invalid login
            if (!loggedUser) {

                message.textContent =
                    "Invalid username or password.";

                message.style.color =
                    "red";

                return;
            }


            // Save login
            localStorage.setItem(
                "username",
                loggedUser.userName
            );


            localStorage.setItem(
                "role",
                loggedUser.role
            );


            localStorage.setItem(
                "fullName",
                loggedUser.fullName || ""
            );


            // Open dashboard
            window.location.href =
                "dashboard.html";

        }
    );