import React, { useEffect, useState } from "react";
import TaskList from "./TaskList";
import TaskForm from "./TaskForm";
import { getAuth, signOut } from "firebase/auth";
import app, { db } from "../../firebase";
import { User } from "firebase/auth";
import { addDoc, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { collection } from "firebase/firestore";
import { useRouter } from "next/router";

interface Task {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  userId: string;
  docId: string;
}

interface UserProfileProps {
  user: User;
}

const Dashboard: React.FC<UserProfileProps> = ({ user }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [eachTask, setEachTask] = useState<any>(null);
  const auth = getAuth(app);
  const router = useRouter();
  const handleRefresh = () => {
    router.reload();
  };

  const fetchTasks = async () => {
    let data: any = [];
    const querySnapshot = await getDocs(
      collection(db, "tasks", user.uid, "task")
    );
    querySnapshot.forEach((doc: any) => {
      data.push({ ...doc.data(), docId: doc.id });
    });
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (name: string, description: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      name,
      description,
      completed: false,
      userId: user.uid,
      docId: "",
    };
    setLoading(true);
    if (eachTask) {
      const payload = {
        docId: eachTask.docId,
        name,
        description,
      };
      updateTask(payload);
      setEachTask(null);
    } else {
      setTasks([...tasks, newTask]);
      await addDoc(collection(db, "tasks", user.uid, "task"), newTask);
      fetchTasks();
    }
    setLoading(false);
  };

  const updateTask = async (task: any) => {
    setEachTask(task);
    const docRef = doc(db, "tasks", user.uid, "task", task.docId);
    try {
      await updateDoc(docRef, {
        name: task.name,
        description: task.description,
      });
      fetchTasks();
    } catch (error: any) {
      console.log(error.message);
      handleRefresh();
    }
  };

  const handleTaskComplete = async (
    id: string,
    docId: string,
    value: boolean
  ) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);

    const docRef = doc(db, "tasks", user.uid, "task", docId);
    await updateDoc(docRef, {
      completed: value,
    });
    fetchTasks();
  };

  const handleDeleteTask = async (docId: string) => {
    await deleteDoc(doc(db, "tasks", user.uid, "task", docId));
    fetchTasks();
  };

  const logout = () => {
    signOut(auth);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-10/12 h-[600px] my-10 p-8 rounded-lg bg-white shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Task Dashboard</h1>
          <div className="flex gap-x-4 items-center">
            <h1 className="text-1xl font-semibold">{user?.email || ""}</h1>

            <button
              onClick={logout}
              className="border border-red-500 text-red-500 px-4 py-1 rounded-md hover:bg-red-500 hover:text-white transition duration-300"
            >
              Logout
            </button>
          </div>
        </div>
        <TaskForm
          onAddTask={handleAddTask}
          loading={loading}
          eachTask={eachTask}
        />
        <TaskList
          tasks={tasks}
          onTaskComplete={handleTaskComplete}
          onDeleteTask={handleDeleteTask}
          updateTask={updateTask}
        />
      </div>
    </div>
  );
};

export default Dashboard;
