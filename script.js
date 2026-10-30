// File: script.js
document.addEventListener("DOMContentLoaded", () => {
  // 1. Ambil elemen DOM
  const todoForm = document.querySelector("#todoForm");
  const taskInput = document.querySelector("#taskInput");
  const inputError = document.querySelector("#inputError");
  const inputMaks = document.querySelector("#inputMaks");
  const todoList = document.querySelector("#todoList");

  // FITUR 1: Membuat/mengambil elemen Task Counter di DOM
  let taskCounter = document.querySelector("#taskCounter");
  if (!taskCounter) {
    taskCounter = document.createElement("div");
    taskCounter.id = "taskCounter";
    taskCounter.style.marginBottom = "10px";
    taskCounter.style.fontSize = "14px";
    taskCounter.style.fontWeight = "bold";
    // Disisipkan sebelum todoList (di atas daftar tugas)
    todoList.parentNode.insertBefore(taskCounter, todoList);
  }

  // FITUR 2: Membuat/mengambil elemen tombol 'Bersihkan Tugas Selesai' di DOM
  let clearCompletedBtn = document.querySelector("#clearCompletedBtn");
  if (!clearCompletedBtn) {
    clearCompletedBtn = document.createElement("button");
    clearCompletedBtn.id = "clearCompletedBtn";
    clearCompletedBtn.textContent = "Bersihkan Tugas Selesai";
    clearCompletedBtn.className = "clear-btn";
    clearCompletedBtn.style.marginTop = "15px";
    // Disisipkan setelah todoList (di bawah daftar tugas)
    todoList.parentNode.insertBefore(clearCompletedBtn, todoList.nextSibling);
  }

  // 2. Fungsi membaca dan menyimpan ke LocalStorage
  const getTasks = () => JSON.parse(localStorage.getItem("todo_tasks")) || [];
  const saveTasks = (tasks) => localStorage.setItem("todo_tasks", JSON.stringify(tasks));

  // FITUR 1: Fungsi untuk memperbarui jumlah tugas secara dinamis
  const updateCounter = () => {
    const tasks = getTasks();
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const uncompleted = total - completed;

    taskCounter.textContent = `Total: ${total} Tugas | Selesai: ${completed} | Belum Selesai: ${uncompleted}`;
  };

  // 3. Fungsi menampilkan daftar tugas ke layar
  const renderTasks = () => {
    const tasks = getTasks();
    todoList.innerHTML = "";

    if (tasks.length === 0) {
      todoList.innerHTML =
        "<p style='text-align:center; color:#64748b; font-size:13px; padding:10px;'>Belum ada tugas tersimpan.</p>";
    } else {
      tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.className = `todo-item ${task.completed ? "completed" : ""}`;
        li.innerHTML = `
          <span class="todo-text">${task.text}</span>
          <div class="todo-actions">
            <button class="action-btn complete-btn" data-index="${index}">
              ${task.completed ? "Batal" : "Selesai"}
            </button>
            <button class="action-btn delete-btn" data-index="${index}">Hapus</button>
          </div>
        `;
        todoList.appendChild(li);
      });
    }

    // Selalu perbarui ringkasan counter setiap render
    updateCounter();
  };

  // Bersihkan error secara otomatis saat user mengetik
  taskInput.addEventListener("input", () => {
    if (taskInput.value.trim().length >= 3) {
      taskInput.classList.remove("error");
      if (inputError) inputError.style.display = "none";
    }
    if (getTasks().length < 5 && inputMaks) {
      inputMaks.style.display = "none";
    }
  });

  // 4. Tambah tugas saat formulir dikirim
  todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    const tasks = getTasks();

    // Validasi maksimal 5 tugas
    if (tasks.length >= 5) {
      taskInput.classList.add("error");
      if (inputMaks) {
        inputMaks.style.display = "block";
        inputMaks.textContent = "Maksimal Pesan 5";
      }
      return;
    }

    // Validasi minimal 3 karakter
    if (taskText.length < 3) {
      taskInput.classList.add("error");
      if (inputError) inputError.style.display = "block";
      return;
    }

    // Jika valid, hilangkan pesan error
    taskInput.classList.remove("error");
    if (inputError) inputError.style.display = "none";
    if (inputMaks) inputMaks.style.display = "none";

    // Simpan tugas baru ke array LocalStorage
    tasks.push({ text: taskText, completed: false });
    saveTasks(tasks);

    taskInput.value = "";
    renderTasks();
  });

  // 5. Tangani klik tombol Selesai dan Hapus
  todoList.addEventListener("click", (e) => {
    const index = e.target.dataset.index;
    if (index === undefined) return;

    const tasks = getTasks();

    if (e.target.classList.contains("complete-btn")) {
      tasks[index].completed = !tasks[index].completed;
      saveTasks(tasks);
      renderTasks();
    } else if (e.target.classList.contains("delete-btn")) {
      // FITUR 3: Konfirmasi sebelum menghapus tugas
      const isConfirmed = confirm("Apakah Anda yakin ingin menghapus tugas ini?");
      if (isConfirmed) {
        tasks.splice(index, 1);
        saveTasks(tasks);
        renderTasks();
      }
    }
  });

  // FITUR 2: Handler klik tombol 'Bersihkan Tugas Selesai'
  clearCompletedBtn.addEventListener("click", () => {
    const tasks = getTasks();
    // Menyaring tugas, hanya menyisakan yang belum selesai (completed === false)
    const activeTasks = tasks.filter((task) => !task.completed);
    
    saveTasks(activeTasks);
    renderTasks();
  });

  // Render pertama kali saat halaman selesai dimuat
  renderTasks();
});