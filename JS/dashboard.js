document.addEventListener("DOMContentLoaded", function () {

    // Get logged-in user
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");

    // Get stored data
    const items = JSON.parse(
        localStorage.getItem("items") || "[]"
    );

    const rooms = JSON.parse(
        localStorage.getItem("rooms") || "[]"
    );

    const inventory = JSON.parse(
        localStorage.getItem("inventory") || "[]"
    );

    // Calculate total registered stock
    const totalStock = items.reduce(function (sum, item) {
        return sum + Number(item.quantity || 0);
    }, 0);

    // Calculate allocated stock
    const allocatedStock = inventory.reduce(function (sum, record) {
        return sum + Number(record.currentQuantity || 0);
    }, 0);

    // Calculate remaining stock
    const remainingStock = Math.max(
        0,
        totalStock - allocatedStock
    );

    // Display statistics
    const itemCount = document.getElementById("itemCount");
    const roomCount = document.getElementById("roomCount");
    const stockCount = document.getElementById("stockCount");
    const allocatedCount = document.getElementById("allocatedCount");

    if (itemCount) {
        itemCount.textContent = items.length;
    }

    if (roomCount) {
        roomCount.textContent = rooms.length;
    }

    if (stockCount) {
        stockCount.textContent = remainingStock;
    }

    if (allocatedCount) {
        allocatedCount.textContent = allocatedStock;
    }


    // Quick Actions
    const quickActions = document.getElementById("quickActions");

    if (quickActions) {

        let actions = "";

        if (role === "STOREKEEPER") {

            actions = `
                <a href="items.html" class="quick-action">
                    <span class="quick-icon"></span>
                    <strong>Manage Items</strong>
                    <small>Add or edit items</small>
                </a>

                <a href="rooms.html" class="quick-action">
                    <span class="quick-icon"></span>
                    <strong>Manage Rooms</strong>
                    <small>Add or edit rooms</small>
                </a>

                <a href="inventory.html" class="quick-action">
                    <span class="quick-icon"></span>
                    <strong>Manage Inventory</strong>
                    <small>Allocate stock to rooms</small>
                </a>

                <a href="reports.html" class="quick-action">
                    <span class="quick-icon"></span>
                    <strong>View Reports</strong>
                    <small>Check inventory reports</small>
                </a>
            `;

        } else if (role === "ADMIN") {

            actions = `
                <a href="users.html" class="quick-action">
                    <span class="quick-icon"></span>
                    <strong>Manage Users</strong>
                    <small>Create and manage users</small>
                </a>

                <a href="items.html" class="quick-action">
                    <span class="quick-icon"></span>
                    <strong>View Items</strong>
                    <small>Check registered items</small>
                </a>

                <a href="rooms.html" class="quick-action">
                    <span class="quick-icon"></span>
                    <strong>View Rooms</strong>
                    <small>Check registered rooms</small>
                </a>

                <a href="reports.html" class="quick-action">
                    <span class="quick-icon"></span>
                    <strong>View Reports</strong>
                    <small>Monitor system reports</small>
                </a>
            `;

        } else if (role === "SUPERVISOR") {

            actions = `
                <a href="items.html" class="quick-action">
                    <span class="quick-icon"></span>
                    <strong>View Items</strong>
                    <small>Check registered items</small>
                </a>

                <a href="rooms.html" class="quick-action">
                    <span class="quick-icon"></span>
                    <strong>View Rooms</strong>
                    <small>Check available rooms</small>
                </a>

                <a href="inventory.html" class="quick-action">
                    <span class="quick-icon"></span>
                    <strong>View Inventory</strong>
                    <small>Monitor stock allocation</small>
                </a>

                <a href="reports.html" class="quick-action">
                    <span class="quick-icon"></span>
                    <strong>View Reports</strong>
                    <small>Check inventory reports</small>
                </a>
            `;
        }

        quickActions.innerHTML = actions;
    }


    // System Overview
    const progressBox = document.getElementById("progressBox");

    if (progressBox) {

        const percentage = totalStock > 0
            ? Math.min(
                100,
                Math.round((allocatedStock / totalStock) * 100)
            )
            : 0;

        progressBox.innerHTML = `
            <div class="progress-info">
                <div>
                    <strong>Stock Allocation</strong>
                    <span>${percentage}% allocated</span>
                </div>

                <div class="progress-bar">
                    <div 
                        class="progress-fill"
                        style="width: ${percentage}%">
                    </div>
                </div>

                <div class="progress-details">
                    <span>
                        Total Stock: <strong>${totalStock}</strong>
                    </span>

                    <span>
                        Allocated: <strong>${allocatedStock}</strong>
                    </span>

                    <span>
                        Remaining: <strong>${remainingStock}</strong>
                    </span>
                </div>
            </div>
        `;
    }

});