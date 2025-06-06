const API_BASE = "https://localhost:7017/api";

async function cargarSelect(endpoint, selectId, textField = "name") {
    const response = await fetch(`${API_BASE}/${endpoint}`);
    const data = await response.json();

    const select = document.getElementById(selectId);
    data.forEach(item => {
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = item[textField];
        select.appendChild(option);
    });
}

window.onload = async () => {
    await cargarSelect("area", "area");
    await cargarSelect("user", "user");
    await cargarSelect("projecttype", "type");
};

document.getElementById("project-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const proyecto = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        amount: parseFloat(document.getElementById("amount").value),
        duration: parseInt(document.getElementById("duration").value),
        area: parseInt(document.getElementById("area").value),
        user: parseInt(document.getElementById("user").value),
        type: parseInt(document.getElementById("type").value)
    };

    try {
        const response = await fetch(`${API_BASE}/project`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(proyecto)
        });

        if (!response.ok) throw new Error("Error al crear proyecto");

        document.getElementById("form-message").textContent = "Proyecto creado con exito. Redirigiendo...";
        document.getElementById("project-form").reset();
        setTimeout(() => {
            window.location.href = "index.html";
        }, 7000);
    } catch (error) {
        document.getElementById("form-message").textContent = "Error: " + error.message;
    }
});
