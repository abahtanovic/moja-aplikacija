document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("taskForm");
    const taskList = document.getElementById("taskList");
  
    const loadTasks = async () => {
      const res = await fetch("/tasks");
      const tasks = await res.json();
      renderTasks(tasks);
    };
  
    const renderTasks = (tasks) => {
      taskList.innerHTML = "";
      tasks.forEach((task) => {
        const li = document.createElement("li");
        if (task.completed) li.classList.add("checked");
  
        li.innerHTML = `
          <div>
            <div class="task-details"><strong>${task.subject}</strong></div>
            <div class="task-details">Rok: ${task.deadline}</div>
            <div class="task-details">${task.description}</div>
          </div>
          <div>
            ${!task.completed ? `<button class="check-btn" onclick="markCompleted('${task.id}')">✔️</button>` : ""}
          </div>
        `;
        taskList.appendChild(li);
      });
    };
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const subject = document.getElementById("subject").value;
      const deadline = document.getElementById("deadline").value;
      const description = document.getElementById("description").value;
  
      await fetch("/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ subject, deadline, description })
      });
  
      form.reset();
      loadTasks();
    });
  
    window.markCompleted = async (id) => {
      await fetch(`/tasks/${id}/complete`, {
        method: "PUT"
      });
      loadTasks();
    };
  
    loadTasks();
  });
  