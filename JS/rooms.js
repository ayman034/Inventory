(() => {
    const read = k => { try { const v = JSON.parse(localStorage.getItem(k) || "[]"); return Array.isArray(v) ? v : []; } catch { return []; } };
    const save = (k,v) => localStorage.setItem(k, JSON.stringify(v));
    let rooms = read("rooms"), inventory = read("inventory"), items = read("items");
    const role = String(localStorage.getItem("role") || "").toUpperCase();
    const canEdit = role === "STOREKEEPER";
    const form = document.getElementById("roomForm"), box = document.getElementById("roomFormContainer"), body = document.getElementById("roomTableBody"), search = document.getElementById("searchRoom"), contents = document.getElementById("roomContents");
    if (!canEdit && box) box.remove();
    const allocated = id => { inventory = read("inventory"); return inventory.filter(r => Number(r.roomId) === Number(id)).reduce((s,r) => s + Number(r.currentQuantity || 0), 0); };
    const nextId = arr => arr.length ? Math.max(...arr.map(x => Number(x.id) || 0)) + 1 : 1;
    const esc = v => String(v ?? "").replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c] || c));
    const itemName = id => items.find(i => Number(i.id) === Number(id))?.name || "Unknown Item";

    function display(term="") {
        rooms = read("rooms"); inventory = read("inventory"); items = read("items");
        const q = term.trim().toLowerCase();
        const list = rooms.filter(r => String(r.name || "").toLowerCase().includes(q));
        if (body) body.innerHTML = list.length ? list.map(r => `<tr><td>${r.id}</td><td><strong>${esc(r.name)}</strong></td><td>${allocated(r.id)}</td><td>${canEdit ? `<button class="btn btn-sm btn-primary" onclick="editRoom(${r.id})">Edit</button> <button class="btn btn-sm btn-danger" onclick="deleteRoom(${r.id})">Delete</button>` : `<span class="view-only">View Only</span>`}</td></tr>`).join("") : `<tr><td colspan="4" class="empty-state">No rooms registered yet</td></tr>`;
        if (contents) contents.innerHTML = list.length ? list.map(r => {
            const rows = inventory.filter(x => Number(x.roomId) === Number(r.id) && Number(x.currentQuantity || 0) > 0);
            const total = rows.reduce((sum,x)=>sum+Number(x.currentQuantity||0),0);
            return `<div class="room-content-box"><div class="room-content-title"><strong>${esc(r.name)}</strong><span>Total quantity: ${total}</span></div>${rows.length ? `<div class="room-item-list">${rows.map(x=>`<div class="room-item"><span>${esc(itemName(x.itemId))}</span><strong>${Number(x.currentQuantity||0)}</strong></div>`).join("")}</div>` : `<div class="room-empty">No items have been placed in this room yet.</div>`}</div>`;
        }).join("") : `<div class="room-empty">No rooms registered yet.</div>`;
    }
    form?.addEventListener("submit", e => { e.preventDefault(); if(!canEdit)return; rooms=read("rooms"); const name=document.getElementById("roomName")?.value.trim(); if(!name)return alert("Please enter room name."); if(rooms.some(r=>String(r.name).toLowerCase()===name.toLowerCase()))return alert("This room already exists."); rooms.push({id:nextId(rooms),name}); save("rooms",rooms); form.reset(); display(); alert("Room added successfully."); });
    window.editRoom=id=>{if(!canEdit)return;rooms=read("rooms");const r=rooms.find(x=>Number(x.id)===Number(id));if(!r)return;const n=prompt("Enter new room name:",r.name);if(n===null)return;const name=n.trim();if(!name)return alert("Room name cannot be empty.");if(rooms.some(x=>Number(x.id)!==Number(id)&&String(x.name).toLowerCase()===name.toLowerCase()))return alert("Another room with this name already exists.");r.name=name;save("rooms",rooms);display();};
    window.deleteRoom=id=>{if(!canEdit)return;if(allocated(id)>0)return alert("This room cannot be deleted because it contains allocated stock.");rooms=read("rooms");const r=rooms.find(x=>Number(x.id)===Number(id));if(!r||!confirm(`Are you sure you want to delete "${r.name}"?`))return;rooms=rooms.filter(x=>Number(x.id)!==Number(id));save("rooms",rooms);display();};
    search?.addEventListener("input",()=>display(search.value)); display();
})();