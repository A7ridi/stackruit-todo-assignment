import React, { useEffect, useState } from "react";

interface TaskFormProps {
  onAddTask: (name: string, description: string) => void;
  loading: boolean;
  eachTask: any;
}

const TaskForm: React.FC<TaskFormProps> = ({
  onAddTask,
  loading,
  eachTask,
}) => {
  const [name, setName] = useState(eachTask?.name || "");
  const [description, setDescription] = useState(eachTask?.description || "");

  useEffect(() => {
    setName(eachTask?.name || "");
    setDescription(eachTask?.description || "");
  }, [eachTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() !== "" && description.trim() !== "") {
      onAddTask(name, description);
      setName("");
      setDescription("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex gap-x-2">
      <input
        type="text"
        placeholder="Task name"
        value={name}
        required
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 rounded-md border focus:outline-none focus:ring focus:border-blue-300"
      />
      <input
        placeholder="Description"
        value={description}
        required
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 rounded-md border focus:outline-none focus:ring focus:border-blue-300"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-4 w-64 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
      >
        {loading ? "Adding..." : eachTask ? "Update Task" : "Add Task"}
      </button>
    </form>
  );
};

export default TaskForm;
