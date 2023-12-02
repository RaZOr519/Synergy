import React, { useEffect, useState } from "react";

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
		onDeleteGoal(goalCard.id);
	};

	// State to store checklist items
	const [checklistItems, setChecklistItems] = useState([]);
	const [newChecklistItem, setNewChecklistItem] = useState("");

	// Function to add a new checklist item
	const addChecklistItem = () => {
		if (newChecklistItem.trim() !== "") {
			setChecklistItems([...checklistItems, newChecklistItem]);
			setNewChecklistItem("");
		}
	};

	// Function to edit a checklist item
	const editChecklistItem = (index, newText) => {
		const updatedChecklist = [...checklistItems];
		updatedChecklist[index] = newText;
		setChecklistItems(updatedChecklist);
	};

	// Function to delete a checklist item
	const deleteChecklistItem = (index) => {
		const updatedChecklist = checklistItems.filter((_, i) => i !== index);
		setChecklistItems(updatedChecklist);
	};

	return (
		<div className="bg-slate-200 rounded-md p-3 w-60">
			<div className="flex justify-between items-center ">
				<h2 className="text-lg font-bold mb-2">{goalCard.title}</h2>
				<button
					onClick={confirmDeleteGoal}
					className="text-gray-500 hover:text-red-500 text-sm"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="1em"
						viewBox="0 0 384 512"
					>
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
								onClick={() =>
									editChecklistItem(
										index,
										prompt("Edit item:", item)
									)
								}
								className="text-gray-500 hover:text-gray-600 ml-2"
							>
								Edit
							</button>
							<button
								onClick={() => deleteChecklistItem(index)}
								className="text-gray-500 hover:text-green-400 ml-2"
							>
								Completed
							</button>
						</li>
					))}
				</ul>
				<div className="flex mb-4 justify-center ">
					<div className="p-2 flex flex-col items-center flex-grow justify-center">
						<input
							type="text"
							value={newChecklistItem}
							onChange={(e) =>
								setNewChecklistItem(e.target.value)
							}
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

			{goalCard.tasks.map((task) => {
				return (
					<div
						key={task.id}
						className="p-4 rounded-xl mb-2 flex justify-between items-center"
						style={{ wordBreak: "break-word" }}
					>
						<div className="flex flex-col">
							<span className="text-sm">{task.text}</span>
						</div>
						<div className="flex space-x-2 items-center text-xs">
							<button
								onClick={() => {
									const newText = prompt(
										"Enter new task text:",
										task.text
									);
									if (newText !== null) {
										onEditTask(
											goalCard.id,
											task.id,
											newText
										);
									}
								}}
								className="text-gray-500 hover:text-gray-600"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									height="1em"
									viewBox="0 0 512 512"
								>
									<path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s-2000/svg" />
									<path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
								</svg>
							</button>
							<button
								onClick={() =>
									onDeleteTask(goalCard.id, task.id)
								}
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
		</div>
	);
};

export default GoalCard;
