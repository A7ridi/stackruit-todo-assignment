import React from "react";

interface Task {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  docId: string;
}

interface TaskListProps {
  tasks: Task[];
  onTaskComplete: (id: string, taskId: string, value: boolean) => void;
  onDeleteTask: (id: string) => void;
  updateTask: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onTaskComplete,
  onDeleteTask,
  updateTask,
}) => {
  return (
    <ul className="space-y-5">
      {tasks.map((task) => {
        const taskId = task.docId;
        return (
          <li
            key={task.id}
            className="flex items-center justify-between rounded-lg"
          >
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={(e) =>
                  onTaskComplete(task.id, taskId, e.target.checked)
                }
                className="h-6 w-6 border border-gray-400 rounded-md cursor-pointer"
              />
              <span className="font-bold">Name:</span>
              <span
                className={
                  task.completed
                    ? "line-through text-gray-400"
                    : "text-gray-800"
                }
              >
                {task.name},
              </span>
              <span className="font-bold">Description:</span>
              <span
                className={
                  task.completed
                    ? "line-through text-gray-400"
                    : "text-gray-800"
                }
              >
                {task.description}
              </span>
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => updateTask(task)}
                className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition duration-300"
              >
                Edit
              </button>
              <button
                onClick={() => onDeleteTask(taskId)}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition duration-300"
              >
                Delete
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default TaskList;
