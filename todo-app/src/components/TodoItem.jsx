import React from "react";
import delete_icon from '../assets/delete.svg';
import tick_icon from '../assets/tick.svg';
import not_tick from '../assets/none_tick.svg'
const TodoItem = ({ text, id, isComplete, delete_note, isCompleteToggle }) => {
  return (
    <div className="flex items-center my-3 gap-2 ">
      <div
        onClick={() => {
          isCompleteToggle(id);
        }}
        className="flex flex-1 items-center cursor-pointer"
      >
        <img className="w-7" src={isComplete ? tick_icon : not_tick} alt="" />
                <p className={`text-slate-700 ml-4 text-[17px] decoration-slate-500 ${isComplete ? "line-through": "" }`}>{text}</p>
      </div>
      <img
        onClick={() => {
          delete_note(id);
        }}
        className="w-5 cursor-pointer"
        src={delete_icon}
        alt=""
      />
    </div>
  );
};

export default TodoItem;
