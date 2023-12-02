import React, { useState, useEffect } from "react";

const TaskCard = ({
  card,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onCardTitleChange,
  onDeleteCard,
  onSetDeadline,
  newTaskDeadline,
}) => {
  const confirmDeleteCard = () => {
    onDeleteCard(card.id);
  };

  return (
    <div className="bg-slate-200 rounded-md p-4 w-60">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold mb-2">{card.name}</h2>
        <button onClick={confirmDeleteCard} className="text-gray-500 hover:text-red-500 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" height="1.2em" viewBox="0 100 360 500">
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </button>
      </div>

      {card.tasks.map((task) => {
        const isPastDeadline = new Date(task.deadline) < new Date();
        const options = { year: "numeric", month: "long", day: "numeric" };
        const taskdeadline = new Date(task.deadline).toLocaleDateString(undefined, options);

        const taskClassName = `p-2 rounded-xl mb-2 flex justify-between items-center ${
          isPastDeadline ? "bg-red-200" : "bg-orange-100"
        }`;

        return (
          <div key={task.id} className={taskClassName} style={{ wordBreak: "break-word" }}>
            <div className="flex flex-col">
              <span className="text-sm">{task.text}</span>
              <span className={`text-xs ${isPastDeadline ? "text-red-600" : "text-gray-500"}`}>
                {isPastDeadline ? (
                  <React.Fragment>
                    Past Deadline
                    <br />
                    Original Deadline: {taskdeadline}
                  </React.Fragment>
                ) : (
                  `Deadline: ${taskdeadline}`
                )}
              </span>
            </div>
            <div className="flex space-x-2 items-center text-xs">
              <button
                onClick={() => {
                  const newText = prompt("Enter new task text:", task.text);
                  if (newText !== null) {
                    onEditTask(card._id, task._id, task, newText);
                  }
                }}
                className="text-gray-500 hover:text-gray-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                  <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z" />
                </svg>
              </button>
              <button
                onClick={() => onDeleteTask(card._id, task._id, card, task)}
                className="text-red-500 hover:text-red-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 448 512"
                  style={{ fill: "red" }}
                >
                  <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                </svg>
              </button>
            </div>
          </div>
        );
      })}

      <div className="flex mb-4 justify-center">
        <div className="flex flex-col items-center flex-grow justify-center">
          <textarea
            value={card.newTask}
            onChange={(e) => onCardTitleChange(card._id, e.target.value)}
            placeholder="Task Name"
            className="mr-2 px-2 border border-gray-300 rounded-md w-full resize-none "
            rows="2"
            style={{ whiteSpace: "pre-line" }}
          />
          <p className="text-xs m-1">Set Deadline</p>
          <input
            type="date"
            value={card.newTaskDeadline}
            onChange={(e) => onSetDeadline(card._id, e.target.value)}
            className="mr-2 px-2 border border-gray-400 rounded-full w-full text-sm"
          />
          <button
            onClick={() => onAddTask(card._id)}
            className="m-3 p-5 py-1 bg-slate-300 rounded-md text-sm text-black hover:bg-slate-400"
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
