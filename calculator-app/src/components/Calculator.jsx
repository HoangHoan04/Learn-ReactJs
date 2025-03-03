import React, { useEffect, useState } from "react";
import delete_icon from "../assets/delete.svg";
import list_icon from "../assets/list_icon.svg";
import menu from "../assets/menu.svg";

const Calculator = () => {
  const [input, setInput] = useState("");
  const [previousInput, setPreviousInput] = useState("");
  const [isLandscape, setIsLandscape] = useState(false);
  const [calculated, setCalculated] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("calcHistory")) || [];
    setHistory(savedHistory);
  }, []);

  const saveHistory = (expression, result) => {
    const newHistory = [...history, `${expression} = ${result}`];
    setHistory(newHistory);
    localStorage.setItem("calcHistory", JSON.stringify(newHistory));
  };
  const handleClick = (value) => {
    if (calculated) {
      if (["+", "-", "*", "/"].includes(value)) {
        setPreviousInput(input + " " + value);
        setInput(input + value);
      } else {
        setPreviousInput("");
        setInput(value);
      }
      setCalculated(false);
    } else {
      setInput((prev) => prev + value);
    }
  };

  const clearInput = () => {
    setInput("");
    setPreviousInput("");
    setCalculated(false);
  };

  const calculateResult = () => {
    try {
      let expression = input;
      // Tự động đóng ngoặc nếu có dấu '√(' mà chưa đóng
      const openSqrtCount = (expression.match(/√\(/g) || []).length;
      const closeParenCount = (expression.match(/\)/g) || []).length;
      if (openSqrtCount > closeParenCount) {
        expression += ")".repeat(openSqrtCount - closeParenCount);
      }
      // Thay thế biểu thức √(num) thành Math.sqrt(num)
      expression = expression.replace(/√\((.*?)\)/g, (_, num) =>
        Math.sqrt(parseFloat(num))
      );

      const result = eval(expression).toString();
      setPreviousInput(input + " =");
      setInput(result);
      setCalculated(true);
      saveHistory(expression, result);
    } catch {
      setInput("Error");
      setCalculated(true);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-5 bg-white text-white rounded-lg shadow-lg min-h-[500px] flex flex-col">
      <button onClick={() => setShowHistory(true)} className="p-2 w-10">
        <img src={list_icon} alt="Show history" />
      </button>

      <div className="text-right text-gray-500 min-h-[20px] text-lg">
        {previousInput}
      </div>

      <div className="mb-4 p-3 bg-transparent text-black text-right text-3xl rounded min-h-[60px] flex items-center justify-end">
        {input || "0"}
      </div>

      <div
        className={`grid gap-2 w-full rounded-lg ${
          isLandscape ? "grid-cols-6" : "grid-cols-4"
        }`}
      >
        {(isLandscape
          ? [
              //hàng 1
              "mc",
              "m+",
              "m-",
              "mr",
              "+/-",
              calculated || input === "" ? "AC" : "DELETE",
              // hàng 2
              "(",
              ")",
              "√",
              "Rad",
              "%",
              "÷",
              // hàng 3
              "xʸ",
              "x²",
              "x³",
              "x!",
              "10ˣ",
              "×",
              // hàng 4
              "5",
              "6",
              "7",
              "8",
              "9",
              "-",
              // hàng 5
              "0",
              "1",
              "2",
              "3",
              "4",
              "+",
              // hàng 6
              "MENU",
              "sin",
              "cos",
              "tan",
              ",",
              "=",
            ]
          : [
              calculated || input === "" ? "AC" : "DELETE",
              "+/-",
              "%",
              "÷",
              "7",
              "8",
              "9",
              "×",
              "4",
              "5",
              "6",
              "-",
              "1",
              "2",
              "3",
              "+",
              "MENU",
              "0",
              ",",
              "=",
            ]
        ).map((item, index) => (
          <button
            key={index}
            className={`p-4 text-3xl w-full aspect-square flex items-center justify-center ${
              isLandscape ? "rounded" : "rounded-full"
            } ${
              ["÷", "×", "-", "+", "="].includes(item)
                ? "bg-orange-500 hover:bg-orange-400"
                : item === "AC"
                ? "bg-red-600 hover:bg-red-500"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            onClick={() => {
              if (item === "AC") {
                clearInput();
              } else if (item === "DELETE") {
                setInput((prev) => prev.slice(0, -1));
              } else if (item === "=") {
                calculateResult();
              } else if (item === "√") {
                setInput((prev) => prev + "√(");
              } else if (item === "x²") {
                setInput((prev) => (parseFloat(prev) ** 2).toString());
              } else if (item === "10ˣ") {
                setInput((prev) => (10 ** parseFloat(prev)).toString());
              } else if (item === "x³") {
                setInput((prev) => (parseFloat(prev) ** 3).toString());
              } else if (item === "%") {
                setInput((prev) => (parseFloat(prev) / 100).toString());
              } else if (["sin", "cos", "tan"].includes(item)) {
                setInput((prev) => Math[item](parseFloat(prev)).toString());
              } else if (item === "MENU") {
                console.log("Menu clicked");
              } else {
                handleClick(item.replace("×", "*").replace("÷", "/"));
              }
            }}
          >
            {item === "DELETE" ? (
              <img className="w-7" src={delete_icon} alt="Delete" />
            ) : item === "MENU" ? (
              <button onClick={() => setShowMenu(true)} className="p-2 w-10">
                <img src={menu} alt="Toggle menu" />
              </button>
            ) : (
              item
            )}
          </button>
        ))}
      </div>

      {showHistory && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold mb-3">Lịch sử tính toán</h2>
            <ul className="text-black">
              {history.map((entry, index) => (
                <li key={index} className="border-b py-1">
                  {entry}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowHistory(false)}
              className="mt-3 p-2 bg-red-500 text-white rounded"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
      {showMenu && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold mb-3">Chọn giao diện</h2>
            <button
              onClick={() => setIsLandscape(false)}
              className="block w-full p-2 bg-blue-500 text-white rounded mb-2"
            >
              Dọc
            </button>
            <button
              onClick={() => setIsLandscape(true)}
              className="block w-full p-2 bg-blue-500 text-white rounded"
            >
              Ngang
            </button>
            <button
              onClick={() => setShowMenu(false)}
              className="mt-3 p-2 bg-red-500 text-white rounded"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calculator;
