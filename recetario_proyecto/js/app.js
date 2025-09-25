// app.js - Vanilla JS para SPA (sin recargar)
document.addEventListener('DOMContentLoaded', () => {
  const formColumn = document.getElementById('formColumn');
  const btnNuevo = document.getElementById('btnNuevo');
  const cancelBtn = document.getElementById('cancelBtn');
  const recipeForm = document.getElementById('recipeForm');
  const recipesTableBody = document.querySelector('#recipesTable tbody');

  let recipes = JSON.parse(localStorage.getItem('recipes') || '[]');

  function renderTable() {
    recipesTableBody.innerHTML = '';
    recipes.forEach((r) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${escapeHtml(r.title)}</td>
        <td>${escapeHtml(r.category)}</td>
        <td>${r.time} min</td>
        <td>${r.servings || ''}</td>
        <td>${escapeHtml(r.difficulty)}</td>
        <td>
          <div class="actions">
            <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${r.id}">Editar</button>
            <button class="btn btn-sm btn-outline-danger del-btn" data-id="${r.id}">Eliminar</button>
          </div>
        </td>
      `;
      recipesTableBody.appendChild(tr);
    });
  }

  function escapeHtml(str = '') {
    return String(str).replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  function openForm(editData) {
    formColumn.classList.remove('visually-hidden');
    if (editData) {
      document.getElementById('title').value = editData.title;
      document.getElementById('category').value = editData.category;
      document.getElementById('ingredients').value = editData.ingredients;
      document.getElementById('time').value = editData.time;
      document.getElementById('difficulty').value = editData.difficulty;
      document.getElementById('image').value = editData.image || '';
      document.getElementById('servings').value = editData.servings || '';
      document.getElementById('recipeId').value = editData.id;
    } else {
      recipeForm.reset();
      document.getElementById('recipeId').value = '';
    }
  }

  function closeForm() {
    formColumn.classList.add('visually-hidden');
    recipeForm.reset();
    document.getElementById('recipeId').value = '';
  }

  btnNuevo.addEventListener('click', () => openForm());
  cancelBtn.addEventListener('click', closeForm);

  recipeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!recipeForm.checkValidity()) {
      recipeForm.classList.add('was-validated');
      return;
    }

    const id = document.getElementById('recipeId').value;
    const item = {
      id: id || Date.now().toString(),
      title: document.getElementById('title').value.trim(),
      category: document.getElementById('category').value,
      ingredients: document.getElementById('ingredients').value.trim(),
      time: Number(document.getElementById('time').value),
      difficulty: document.getElementById('difficulty').value,
      image: document.getElementById('image').value.trim(),
      servings: Number(document.getElementById('servings').value) || 1
    };

    if (id) {
      recipes = recipes.map(r => r.id === id ? item : r);
    } else {
      recipes.push(item);
    }
    localStorage.setItem('recipes', JSON.stringify(recipes));
    renderTable();
    closeForm();
    recipeForm.classList.remove('was-validated');
  });

  recipesTableBody.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.edit-btn');
    const delBtn = e.target.closest('.del-btn');
    if (editBtn) {
      const id = editBtn.dataset.id;
      const rec = recipes.find(r => r.id === id);
      openForm(rec);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (delBtn) {
      const id = delBtn.dataset.id;
      if (confirm('¿Eliminar receta?')) {
        recipes = recipes.filter(r => r.id !== id);
        localStorage.setItem('recipes', JSON.stringify(recipes));
        renderTable();
      }
    }
  });

  // render inicial
  renderTable();
});
