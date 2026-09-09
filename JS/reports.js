document.addEventListener(
    "DOMContentLoaded",
    function() {

        const items =
            JSON.parse(
                localStorage.getItem("items") || "[]"
            );

        const rooms =
            JSON.parse(
                localStorage.getItem("rooms") || "[]"
            );

        const inventory =
            JSON.parse(
                localStorage.getItem("inventory") || "[]"
            );


        // Total stock
        const totalStock =
            items.reduce(
                (sum, item) =>
                    sum +
                    Number(item.quantity || 0),
                0
            );


        // Allocated stock
        const allocatedStock =
            inventory.reduce(
                (sum, record) =>
                    sum +
                    Number(
                        record.currentQuantity || 0
                    ),
                0
            );


        // Remaining stock
        const remainingStock =
            Math.max(
                0,
                totalStock -
                allocatedStock
            );


        // Cards
        document.getElementById(
            "totalItemsReport"
        ).textContent =
            items.length;


        document.getElementById(
            "totalRoomsReport"
        ).textContent =
            rooms.length;


        document.getElementById(
            "currentStockReport"
        ).textContent =
            remainingStock;


        document.getElementById(
            "allocatedStockReport"
        ).textContent =
            allocatedStock;


        // Stock summary
        const reportTableBody =
            document.getElementById(
                "reportTableBody"
            );


        items.forEach(item => {

            const total =
                Number(item.quantity || 0);


            const allocated =
                inventory
                    .filter(record =>
                        Number(record.itemId) ===
                        Number(item.id)
                    )
                    .reduce(
                        (sum, record) =>
                            sum +
                            Number(
                                record.currentQuantity || 0
                            ),
                        0
                    );


            const remaining =
                Math.max(
                    0,
                    total -
                    allocated
                );


            let status = "Available";


            if (remaining === 0) {

                status = "Out of Stock";

            } else if (remaining <= 5) {

                status = "Low Stock";

            }


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>${item.id}</td>

                <td>
                    <strong>${item.name}</strong>
                </td>

                <td>${item.category}</td>

                <td>${total}</td>

                <td>${allocated}</td>

                <td>${remaining}</td>

                <td>${status}</td>

            `;


            reportTableBody.appendChild(row);

        });


        // Low stock
        const lowStockTableBody =
            document.getElementById(
                "lowStockTableBody"
            );


        const lowStockItems =
            items.filter(item => {

                const allocated =
                    inventory
                        .filter(record =>
                            Number(record.itemId) ===
                            Number(item.id)
                        )
                        .reduce(
                            (sum, record) =>
                                sum +
                                Number(
                                    record.currentQuantity || 0
                                ),
                            0
                        );


                const remaining =
                    Math.max(
                        0,
                        Number(item.quantity || 0) -
                        allocated
                    );


                return remaining <= 5;

            });


        if (lowStockItems.length === 0) {

            lowStockTableBody.innerHTML = `

                <tr>

                    <td
                        colspan="5"
                        style="text-align:center;"
                    >
                        No low stock items
                    </td>

                </tr>

            `;

        } else {

            lowStockItems.forEach(item => {

                const total =
                    Number(item.quantity || 0);


                const allocated =
                    inventory
                        .filter(record =>
                            Number(record.itemId) ===
                            Number(item.id)
                        )
                        .reduce(
                            (sum, record) =>
                                sum +
                                Number(
                                    record.currentQuantity || 0
                                ),
                            0
                        );


                const remaining =
                    Math.max(
                        0,
                        total -
                        allocated
                    );


                const status =
                    remaining === 0
                        ? "Out of Stock"
                        : "Low Stock";


                const row =
                    document.createElement("tr");


                row.innerHTML = `

                    <td>${item.name}</td>

                    <td>${total}</td>

                    <td>${allocated}</td>

                    <td>${remaining}</td>

                    <td>${status}</td>

                `;


                lowStockTableBody.appendChild(row);

            });

        }


        // Progress
        const progress =
            totalStock > 0
                ? Math.round(
                    (allocatedStock /
                        totalStock) * 100
                )
                : 0;


        const reportProgress =
            document.getElementById(
                "reportProgress"
            );


        reportProgress.innerHTML = `

            <div class="progress-info">

                <div>

                    <strong>
                        Stock Allocation
                    </strong>

                    <span>
                        ${progress}% allocated
                    </span>

                </div>


                <div class="progress-bar">

                    <div
                        class="progress-fill"
                        style="width:${progress}%"
                    ></div>

                </div>


                <div class="progress-details">

                    <span>
                        Total:
                        <strong>${totalStock}</strong>
                    </span>

                    <span>
                        Allocated:
                        <strong>${allocatedStock}</strong>
                    </span>

                    <span>
                        Remaining:
                        <strong>${remainingStock}</strong>
                    </span>

                </div>

            </div>

        `;

    }
);

// Report printing: Admin and Supervisor only.
(function setupReportPrinting() {
    const btn = document.getElementById("printReportBtn");
    if (!btn) return;
    const role = String(localStorage.getItem("role") || "").toUpperCase();
    if (role !== "SUPERVISOR") {
        btn.remove();
        return;
    }
    btn.addEventListener("click", function () {
        const now = new Date();
        const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        const pad = n => String(n).padStart(2,"0");
        const name = localStorage.getItem("fullName") || localStorage.getItem("username") || "Unknown User";
        document.getElementById("printDay").textContent = days[now.getDay()];
        document.getElementById("printDate").textContent = `${pad(now.getDate())}/${pad(now.getMonth()+1)}/${now.getFullYear()}`;
        document.getElementById("printTime").textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
        document.getElementById("printUser").textContent = name;
        window.print();
    });
})();
