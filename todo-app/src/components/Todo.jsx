import React, { useEffect, useRef, useState } from "react";
import note_img from "../assets/note-logo.png";
import TodoItem from "./TodoItem";

const Todo = () => {
  const inputRef = useRef();

  const storedTodos = localStorage.getItem("todos");
  const [todoList, setTodoList] = useState(
    storedTodos ? JSON.parse(storedTodos) : []
  );

  const add_note = () => {
    const inputText = inputRef.current.value.trim();
    if (inputText === "") {
      return null;
    }
    const newTodo = {
      id: Date.now(),
      text: inputText,
      isComplete: false,
    };
    setTodoList((prev) => [...prev, newTodo]);
    inputRef.current.value = "";
  };

  const delete_note = (id) => {
    setTodoList((prevTodos) => {
      return prevTodos.filter((todo) => todo.id !== id);
    });
  };

  const isCompleteToggle = (id) => {
    setTodoList((prevTodo) => {
      return prevTodo.map((todo) => {
        if (todo.id === id) {
          return { ...todo, isComplete: !todo.isComplete };
        }
        return todo;
      });
    });
  };
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todoList));
  }, [todoList]);

  return (
    <div className="bg-white place-self-center w-11/12 max-w-md flex flex-center flex-col p-7 min-h-[550px] rounded-xl">
      {/* title */}
      <div className="flex items-center mt-7 gap-2">
        <img className="w-10" src={note_img} alt="" />
        <h2 className="text-3xl font-semibold">To do list</h2>
      </div>
      {/* input box */}
      <div className="flex items-center my-7 bg-gray-200 rounded-full ">
        <input
          ref={inputRef}
          className="bg-transparent border-0 outline-none flex-1 h-14 pl-6 pr-2 placeholder:text-slate-600"
          type="text"
          placeholder="Nhập ghi chú ..."
        />
        <button
          onClick={add_note}
          className="border-none rounded-full bg-green-500 w-24 h-14 text-white text-lg font-medium cursor-pointer"
        >
          <i className="pi pi-plus"></i>
        </button>
      </div>
      {/* todo list */}
      <div>
        {todoList.map((item, index) => {
          return (
            <TodoItem
              key={index}
              text={item.text}
              id={item.id}
              isComplete={item.isComplete}
              delete_note={delete_note}
              isCompleteToggle={isCompleteToggle}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Todo;
