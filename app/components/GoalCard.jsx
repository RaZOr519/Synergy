import React, { useState, useEffect } from "react";

const GoalCard = ({
  goalCard,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onDeleteGoal,
  onGoalTitleChange,
  onSetDeadline,
  newTaskDeadline,
}) => {
  const confirmDeleteGoal = () => {
    onDeleteGoal(goalCard._id);
  };

  // State to store checklist items
  const [checklistItems, setChecklistItems] = useState([]);
  const [newChecklistItem, setNewChecklistItem] = useState("");

  // add a new checklist item
  const addChecklistItem = () => {
    if (newChecklistItem.trim() !== "") {
      onAddTask(goalCard._id, newChecklistItem);
      setChecklistItems((prevItems) => [...prevItems, newChecklistItem]);
      setNewChecklistItem("");
    }
  };

  // edit a checklist item
  const editChecklistItem = (index, newText) => {
    setChecklistItems((prevItems) => prevItems.map((item, i) => (i === index ? newText : item)));
  };

  // delete a checklist item
  const deleteChecklistItem = (index) => {
    setChecklistItems((prevItems) => prevItems.filter((item, i) => i !== index));
  };

  return (
    <div className="bg-slate-200 rounded-md p-4 w-60 hover:shadow-xl hover:bg-slate-100 border-2">
      <div className="flex justify-between items-center ">
        <h2 className="text-lg font-bold mb-2">{goalCard.title}</h2>
        <button onClick={confirmDeleteGoal} className="text-gray-500 hover:text-red-500 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s-32.8 12.5-45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </button>
      </div>

      {/* Checklist section */}
      <div className="mb-4">
        <p className="text-sm font-bold mb-2 ">Checklist:</p>
        <ul>
          {checklistItems.map((item, index) => (
            <li key={index}>
              <span>{item}</span>
              <button
                onClick={() => editChecklistItem(index, prompt("Edit item:", item))}
                className="text-gray-500 hover:text-green-400 ml-3 rounded-full hover:bg-gray-300 p-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="16"
                  width="16"
                  viewBox="0 0 512 512"
                >
                  <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
                </svg>
              </button>
              <button
                onClick={() => deleteChecklistItem(index)}
                className="text-gray-500 hover:text-green-400 rounded-full hover:bg-gray-300 p-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="16"
                  width="14"
                  viewBox="0 0 448 512"
                >
                  <path
                    fill="#50C878"
                    d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
        <div className="flex mb-4 justify-center ">
          <div className="p-2 flex flex-col items-center flex-grow justify-center">
            <input
              type="text"
              value={newChecklistItem}
              onChange={(e) => setNewChecklistItem(e.target.value)}
              placeholder="Add item"
              className="px-2 border border-gray-400 rounded-lg w-full"
            />
            <button
              onClick={addChecklistItem}
              className="m-2 p-5 py-1 bg-slate-300 rounded-md text-sm text-black hover:bg-slate-400"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalCard;
