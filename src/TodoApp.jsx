import { useState, useEffect } from "react";

const TodoApp = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, active: true }]);
      setNewTask("");
    }
  };

  const toggleTaskStatus = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, active: !task.active } : task
      )
    );
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const deleteAllCompleted = () => {
    setTasks(tasks.filter((task) => task.active));
    setMessage("All completed tasks have been deleted.");
    setTimeout(() => setMessage(""), 3000); // Hide message after 3 seconds
  };

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return task.active; // Show only active tasks
    if (activeTab === "completed") return !task.active; // Show only completed tasks
    return true;
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="flex flex-col items-center bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">#todo</h1>

        {/* Display feedback message */}
        {message && (
          <div className="bg-green-200 text-green-800 p-2 rounded mb-4 w-full text-center">
            {message}
          </div>
        )}

        {/* Tabs */}
        <nav className="flex space-x-4 mb-5 w-full justify-center">
          <button onClick={() => setActiveTab("all")} className={`py-2 px-4 rounded ${activeTab === "all" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800" }`}>
            All
          </button>
          <button onClick={() => setActiveTab("active")} className={`py-2 px-4 rounded ${activeTab === "active" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
            Active
          </button>
          <button onClick={() => setActiveTab("completed")} className={`py-2 px-4 rounded ${activeTab === "completed" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`} >
            Completed
          </button>
        </nav>

        {/* Form thêm công việc */}
        {(activeTab === "all" || activeTab === "active") && (
          <form onSubmit={handleAddTask} className="flex space-x-2 mb-4 w-full max-w-md">
            <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Add details" className="flex-grow p-2 border border-gray-300 rounded"/>
            <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded">
              Add
            </button>
          </form>
        )}

        {/* Danh sách công việc */}
        <ul className="w-full max-w-md bg-white rounded-lg shadow-md p-4 space-y-2">
          {filteredTasks.map((task) => (
            <li key={task.id} className={`flex items-center justify-between p-2 rounded ${!task.active ? "bg-gray-100 line-through text-gray-500" : ""}`} >
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={!task.active} onChange={() => toggleTaskStatus(task.id)} className="form-checkbox h-5 w-5 text-blue-600" aria-label={`Mark task "${task.text}" as ${task.active ? "completed" : "active"}`} />
                <span>{task.text}</span>
              </label>
              {activeTab === "completed" && (
                <button onClick={() => deleteTask(task.id)} className="text-red-500 hover:text-red-700" aria-label={`Delete task "${task.text}"`}>
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>

        {/* Nút xóa tất cả chỉ hiển thị ở tab Completed */}
        {activeTab === "completed" && (
          <button onClick={deleteAllCompleted} className="mt-4 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600">
            Delete All
          </button>
        )}
      </div>
    </div>
  );
};

export default TodoApp;
