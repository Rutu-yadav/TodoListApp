import React, { useEffect, useState } from "react";

import {
  AiOutlineCheck,
  AiOutlineCheckCircle,
  AiOutlineDelete,
  AiOutlineEdit,
} from "react-icons/ai";
import { toast } from "react-toastify";

function TodoList() {
  const [allTodos, setAllTodos] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [activeTab, setActiveTab] = useState("todo");
  const [completedTodos, setCompletedTodos] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // Custom scrollbar styles
  const scrollbarStyles = {
    scrollbarWidth: "thin",
    scrollbarColor: "#6393A3 transparent",
    overflowY: "auto",
    maxHeight: "calc(100vh - 250px)",
  };

  const customScrollbarCSS = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(75, 85, 99, 0.1);
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: #4B5563;
      border-radius: 10px;
    }
  `;

  const handleAddTask = () => {
    console.log("handleAddTask called, isEditing:", isEditing);
    if (newTitle.trim() === "" || newDescription.trim() === "") {
      toast.warning("Please enter both a title and a description.");
      return;
    }
    if (isEditing) {
      // Update existing task
      let updatedTodosArr = [...allTodos];
      updatedTodosArr[editIndex] = {
        title: newTitle,
        description: newDescription,
      };

      setAllTodos(updatedTodosArr);
      setNewTitle("");
      setNewDescription("");
      setIsEditing(false);
      setEditIndex(null);

      localStorage.setItem("todoList", JSON.stringify(updatedTodosArr));
      console.log("Task updated, isEditing reset to:", false);
    } else {
      // Add new task
      let newTask = {
        title: newTitle,
        description: newDescription,
      };

      let updatedTodosArr = [...allTodos];
      updatedTodosArr.push(newTask);
      setAllTodos(updatedTodosArr);
      setNewTitle("");
      setNewDescription("");

      localStorage.setItem("todoList", JSON.stringify(updatedTodosArr));
    }
  };

  useEffect(() => {
    const storedTodos = localStorage.getItem("todoList");
    const storedCompletedTodos = localStorage.getItem("completedTodos");
    if (storedTodos) {
      setAllTodos(JSON.parse(storedTodos));
    }
    if (storedCompletedTodos) {
      setCompletedTodos(JSON.parse(storedCompletedTodos));
    }
  }, []);

  const hadleDelete = (index) => {
    let reduceTodo = [...allTodos];
    reduceTodo.splice(index, 1);
    localStorage.setItem("todoList", JSON.stringify(reduceTodo));
    setAllTodos(reduceTodo);
  };

  const handleCompleted = (index) => {
    let now = new Date();
    let dd = now.getDate();
    let mm = now.getMonth();
    let yyyy = now.getFullYear();
    let h = now.getHours();
    let m = now.getMinutes();

    let completedOn = dd + "/" + mm + "/" + yyyy + " at  " + h + ":" + m;
    let filteredTodos = { ...allTodos[index], completedOn: completedOn };

    let updatedCompletedArr = [...completedTodos];
    updatedCompletedArr.push(filteredTodos);
    setCompletedTodos(updatedCompletedArr);
    hadleDelete(index);
    localStorage.setItem("completedTodos", JSON.stringify(updatedCompletedArr));
  };

  const handleDeleteCompleted = (index) => {
    let reducedCompletedTodos = [...completedTodos];
    reducedCompletedTodos.splice(index, 1);
    localStorage.setItem(
      "completedTodos",
      JSON.stringify(reducedCompletedTodos)
    );
    setCompletedTodos(reducedCompletedTodos);
  };

  const handleEdit = (index) => {
    let editTodo = allTodos[index];
    setNewTitle(editTodo.title);
    setNewDescription(editTodo.description);
    setIsEditing(true);
    setEditIndex(index);
    console.log("Edit mode activated, isEditing:", true);
  };

  return (
    <div
      className="bg-gray-400 shadow-md rounded-xl px-8 pt-4 pb-8 mb-4 flex flex-col"
      style={{
        backgroundImage: "url('/images/todo1.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "85vh",
      }}
    >
      <h1 className="text-4xl text-center text-cyan-700 font-bold mt-2">
        To do List
      </h1>

      <div className="flex-none">
        <div className="flex justify-between items-center py-4 border-b-2 mt-4 border-cyan-700 mx-15">
          <div className="ml-10 flex flex-col">
            <label htmlFor="" className="text-cyan-700 text-2xl font-bold">
              Title:
            </label>
            <input
              type="text"
              placeholder="Add task Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="border-3 border-cyan-700 rounded p-2 mt-2 w-80 focus:outline-none focus:ring-2 focus:ring-cyan-700  font-bold text-lg"
            />
          </div>
          <div className="flex flex-col mr-10">
            <label htmlFor="" className="text-cyan-700 text-2xl font-bold ">
              Description:
            </label>
            <input
              type="text"
              placeholder="Add task Description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="border-3 border-cyan-700 rounded p-2 mt-2 w-80 focus:outline-none focus:ring-2 focus:ring-cyan-700 font-bold text-lg"
            />
          </div>

          <div className="mr-2">
            <button
              type="submit"
              onClick={handleAddTask}
              className="rounded-full px-10 text-nowrap py-2 mt-7 bg-gradient-to-bl from-cyan-600 to-gray-300 font-bold  text-white hover:bg-amber-200 transition duration-300 ease-in-out cursor-pointer shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:ring-opacity-50"
            >
              {isEditing === true ? "Update Task" : "Add Task"}
            </button>
          </div>
        </div>

        <div className="flex items-center py-2 border-gray-200 mx-20">
          <div
            className={`px-4 py-2 rounded-l-full cursor-pointer ${
              activeTab === "todo" ? "bg-cyan-700 text-white" : "bg-white"
            }`}
            onClick={() => setActiveTab("todo")}
          >
            Todo
          </div>

          <div
            className={`px-4 py-2 rounded-r-full cursor-pointer ${
              activeTab === "completed" ? "bg-cyan-700 text-white" : "bg-white"
            }`}
            onClick={() => setActiveTab("completed")}
          >
            Completed
          </div>
        </div>
      </div>

      <div className="flex-grow custom-scrollbar" style={scrollbarStyles}>
        {activeTab === "todo" ? (
          allTodos.length === 0 ? (
            <div className="text-center text-cyan-700 text-2xl font-bold">
              No Todos
            </div>
          ) : (
            allTodos.map((todo, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-2 border-cyan-900 bg-transparent rounded-lg shadow-2xl my-2 mx-24"
              >
                <div className="px-8 mt-2">
                  <h3 className="text-cyan-700 text-3xl font-bold">
                    {todo.title}
                  </h3>
                  <p className="text-gray-700 mt-2 text-xl font-bold pb-4">
                    {todo.description}
                  </p>
                </div>
                <div className="flex items-center mx-2 pr-4 text-2xl text-white">
                  <AiOutlineEdit
                    className="hover:text-cyan-500 cursor-pointer text-gray-800"
                    onClick={() => handleEdit(index)}
                  />
                  <AiOutlineDelete
                    className="mx-4 hover:text-cyan-500 cursor-pointer text-gray-800"
                    onClick={() => hadleDelete(index)}
                  />
                  <AiOutlineCheckCircle
                    className="hover:text-cyan-500 cursor-pointer text-gray-800"
                    onClick={() => handleCompleted(index)}
                  />
                </div>
              </div>
            ))
          )
        ) : completedTodos.length === 0 ? (
          <div className="text-center text-cyan-700 text-2xl font-bold">
            No Completed Todos
          </div>
        ) : (
          completedTodos.map((todo, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-2 border-gray-900 bg-transparent rounded-lg shadow-md my-2  mx-24"
            >
              <div className="px-8 py-1">
                <h3 className="text-cyan-700 mt-1 text-3xl font-bold line-through">
                  {todo.title}
                </h3>
                <p className="text-cyan-900 text-lg font-bold line-through">
                  {todo.description}
                </p>
                <p className="text-cyan-900 mt-1 text-sm font-bold">
                  Completed On: {todo.completedOn}
                </p>
              </div>
              <div className="flex items-center mx-2 text-2xl text-white">
                <AiOutlineDelete
                  className="mx-4 hover:text-cyan-500 cursor-pointer text-gray-800"
                  onClick={() => handleDeleteCompleted(index)}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TodoList;
