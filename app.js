// ⚠️ Замени на свой токен и свой репозиторий
const token = "YOUR_PERSONAL_ACCESS_TOKEN";
const repo = "username/your-repo";
const path = "data.json";

let sha = "";

async function showMessage(text, isError = false) {
  const msgDiv = document.getElementById("message");
  msgDiv.textContent = text;
  msgDiv.className = isError ? "error" : "status";
}

async function loadData() {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
      headers: {
        "Accept": "application/vnd.github.v3+json",
      },
    });
    if (!res.ok) throw new Error("Не удалось загрузить файл: " + res.status);
    const data = await res.json();
    sha = data.sha;
    const content = atob(data.content);
    document.getElementById("content").value = content;
    showMessage("Файл загружен");
  } catch (e) {
    console.error(e);
    showMessage("Ошибка при загрузке: " + e.message, true);
  }
}

async function saveData() {
  try {
    const raw = document.getElementById("content").value;
    const encoded = btoa(raw);

    const body = {
      message: "Update via admin panel",
      content: encoded,
      sha: sha,
    };

    const res = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
      method: "PUT",
      headers: {
        "Authorization": `token ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/vnd.github.v3+json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(`Ошибка сохранения: ${res.status} — ${JSON.stringify(err)}`);
    }

    const result = await res.json();
    sha = result.content.sha;
    showMessage("Сохранено успешно ✅");
  } catch (e) {
    console.error(e);
    showMessage("Ошибка при сохранении: " + e.message, true);
  }
}

document.getElementById("save").addEventListener("click", saveData);

window.addEventListener("DOMContentLoaded", loadData);
