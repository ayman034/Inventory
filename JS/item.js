(() => {
    const read = (key) => {
        try {
            const data = JSON.parse(localStorage.getItem(key) || "[]");
            return Array.isArray(data) ? data : [];
        } catch { return []; }
    };
    const save = (key, data) => localStorage.setItem(key, JSON.stringify(data));

    let items = read("items");
    let inventory = read("inventory");
    const role = String(localStorage.getItem("role") || "").toUpperCase();
    const canEdit = role === "STOREKEEPER";

    const form = document.getElementById("itemForm");
    const tbody = document.getElementById("itemTableBody");
    const search = document.getElementById("searchItem");
    const formBox = document.getElementById("itemFormContainer");
    const editBox = document.getElementById("editItemContainer");
    const editForm = document.getElementById("editItemForm");

    if (!canEdit && formBox) formBox.remove();
    if (!canEdit && editBox) editBox.remove();

    function allocated(id) {
        return inventory.filter(r => Number(r.itemId) === Number(id))
            .reduce((s,r) => s + Number(r.currentQuantity || 0), 0);
    }
    function remaining(item) { return Math.max(0, Number(item.quantity || 0) - allocated(item.id)); }

    function displayItems(term = "") {
        if (!tbody) return;
        inventory = read("inventory");
        const q = term.trim().toLowerCase();
        const filtered = items.filter(i => String(i.name||"").toLowerCase().includes(q) || String(i.category||"").toLowerCase().includes(q));
        tbody.innerHTML = filtered.length ? filtered.map(i => `
            <tr>
                <td>${i.id}</td><td><strong>${escapeHtml(i.name)}</strong></td><td>${escapeHtml(i.category)}</td>
                <td>${Number(i.quantity||0)}</td><td>${allocated(i.id)}</td><td><strong>${remaining(i)}</strong></td>
                <td>${canEdit ? `<button class="btn btn-sm btn-primary" onclick="editItem(${i.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteItem(${i.id})">Delete</button>` : `<span class="view-only">View Only</span>`}</td>
            </tr>`).join("") : `<tr><td colspan="7" class="empty-state">No items registered yet</td></tr>`;
    }

    function escapeHtml(v) { return String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
    function nextId(arr) { return arr.length ? Math.max(...arr.map(x => Number(x.id)||0)) + 1 : 1; }

    form?.addEventListener("submit", e => {
        e.preventDefault();
        if (!canEdit) return;
        const name = document.getElementById("itemName")?.value.trim();
        const category = document.getElementById("category")?.value.trim();
        const quantity = Number(document.getElementById("quantity")?.value);
        if (!name || !category || !Number.isInteger(quantity) || quantity < 0) {
            alert("Please enter a valid item name, category and quantity."); return;
        }
        if (items.some(i => String(i.name).toLowerCase() === name.toLowerCase())) {
            alert("This item already exists."); return;
        }
        items.push({id: nextId(items), name, category, quantity});
        save("items", items);
        form.reset();
        displayItems();
        alert("Item registered successfully.");
    });

    window.editItem = id => {
        if (!canEdit) return;
        const item = items.find(i => Number(i.id) === Number(id));
        if (!item || !editBox) return;
        document.getElementById("editItemId").value = item.id;
        document.getElementById("editItemName").value = item.name;
        document.getElementById("editCategory").value = item.category;
        document.getElementById("editQuantity").value = item.quantity;
        editBox.style.display = "block";
        editBox.scrollIntoView({behavior:"smooth", block:"start"});
    };

    editForm?.addEventListener("submit", e => {
        e.preventDefault();
        const id = Number(document.getElementById("editItemId").value);
        const item = items.find(i => Number(i.id) === id);
        const name = document.getElementById("editItemName").value.trim();
        const category = document.getElementById("editCategory").value.trim();
        const quantity = Number(document.getElementById("editQuantity").value);
        if (!item || !name || !category || !Number.isInteger(quantity) || quantity < 0) return alert("Please enter valid values.");
        if (quantity < allocated(id)) return alert(`Quantity cannot be less than allocated stock (${allocated(id)}).`);
        if (items.some(i => Number(i.id)!==id && String(i.name).toLowerCase()===name.toLowerCase())) return alert("Another item with this name already exists.");
        Object.assign(item,{name,category,quantity}); save("items",items); editBox.style.display="none"; displayItems();
    });
    document.getElementById("cancelEditBtn")?.addEventListener("click",()=>{editBox.style.display="none";editForm?.reset();});

    window.deleteItem = id => {
        if (!canEdit) return;
        if (allocated(id)>0) return alert("This item cannot be deleted because it has stock allocated to a room.");
        const item=items.find(i=>Number(i.id)===Number(id)); if(!item) return;
        if(!confirm(`Are you sure you want to delete "${item.name}"?`)) return;
        items=items.filter(i=>Number(i.id)!==Number(id)); save("items",items); displayItems();
    };
    search?.addEventListener("input",()=>displayItems(search.value));
    displayItems();
})();
