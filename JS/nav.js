(function () {

    const page =
        window.location.pathname
            .split("/")
            .pop() ||
        "dashboard.html";


    const currentRole =
        localStorage.getItem("role");


    const currentUsername =
        localStorage.getItem("username");


    const sidebarMenu =
        document.getElementById(
            "sidebarMenu"
        );


    const userInfo =
        document.getElementById(
            "userInfo"
        );


    /*
        Page permissions
    */
    const access = {

        ADMIN: [
            "dashboard",
            "users",
            "items",
            "rooms",
            "reports"
        ],

        STOREKEEPER: [
            "dashboard",
            "items",
            "rooms",
            "inventory",
            "reports"
        ],

        SUPERVISOR: [
            "dashboard",
            "items",
            "rooms",
            "inventory",
            "reports"
        ]

    };


    /*
        Sidebar links
    */
    const links = [

        {
            id: "dashboard",
            page: "dashboard.html",
            icon: "📊",
            name: "Dashboard"
        },

        {
            id: "items",
            page: "items.html",
            icon: "📦",
            name: "Items"
        },

        {
            id: "rooms",
            page: "rooms.html",
            icon: "🏢",
            name: "Rooms"
        },

        {
            id: "inventory",
            page: "inventory.html",
            icon: "📋",
            name: "Inventory"
        },

        {
            id: "reports",
            page: "reports.html",
            icon: "📈",
            name: "Reports"
        },

        {
            id: "users",
            page: "users.html",
            icon: "👥",
            name: "Users Management"
        }

    ];


    const allowed =
        access[currentRole] || [];


    /*
        Create sidebar
    */
    if (sidebarMenu) {

        sidebarMenu.className =
            "sidebar-nav";


        const menu =
            links
                .filter(link =>
                    allowed.includes(
                        link.id
                    )
                )
                .map(link => {

                    const active =
                        page === link.page
                            ? "active"
                            : "";


                    return `

                        <a
                            href="${link.page}"
                            class="${active}"
                        >

                            <span
                                class="nav-icon"
                            >
                                ${link.icon}
                            </span>

                            <span>
                                ${link.name}
                            </span>

                        </a>

                    `;

                })
                .join("");


        sidebarMenu.innerHTML =
            menu +

            `

                <div
                    class="sidebar-spacer"
                ></div>


                <a
                    href="index.html"
                    class="logout-link"
                    onclick="logout()"
                >

                    <span class="nav-icon">
                        🚪
                    </span>

                    <span>
                        Logout
                    </span>

                </a>

            `;

    }


    /*
        User information
    */
    if (
        userInfo &&
        currentUsername &&
        currentRole
    ) {

        const roleNames = {
            ADMIN: "System Administrator",
            STOREKEEPER: "Storekeeper",
            SUPERVISOR: "Supervisor"
        };

        const roleName = roleNames[currentRole] || currentRole;

        userInfo.innerHTML = `

            <div class="user-details">

                <strong>
                    ${currentUsername}
                </strong>

                <span class="role-pill">
                    ${roleName}
                </span>

            </div>

        `;

    }


    /*
        Check access to a section
    */
    window.hasAccess =
        function(section) {

            return allowed.includes(
                section
            );

        };


    /*
        Protect section
    */
    window.protectSection =
        function(section) {

            if (
                !window.hasAccess(
                    section
                )
            ) {

                alert(
                    "You do not have access to this section."
                );

                window.location.href =
                    "dashboard.html";

            }

        };

})();