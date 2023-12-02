"use client";
import React, { useState } from "react";
import "tailwindcss/tailwind.css";
import GoalCard from "../components/GoalCard";

export default function Goals() {
	const [goalCards, setGoalCards] = useState([]);
	const [newGoalTitle, setNewGoalTitle] = useState("");

	const addGoal = () => {
		if (newGoalTitle.trim() !== "") {
			setGoalCards([
				...goalCards,
				{
					id: Date.now(),
					title: newGoalTitle,
					tasks: [],
					newTask: "",
					newTaskDeadline: "",
				},
			]);
			setNewGoalTitle("");
		}
	};

	const addTask = (goalCardId) => {
		const cardIndex = goalCards.findIndex((card) => card.id === goalCardId);
		if (goalCards[cardIndex].newTask.trim() !== "") {
			const updatedGoalCards = [...goalCards];
			const newTask = {
				id: Date.now(),
				text: goalCards[cardIndex].newTask,
				deadline: goalCards[cardIndex].newTaskDeadline,
			};
			updatedGoalCards[cardIndex].tasks.push(newTask);
			updatedGoalCards[cardIndex].newTask = "";
			updatedGoalCards[cardIndex].newTaskDeadline = "";
			setGoalCards(updatedGoalCards);
		}
	};

	const editTask = (goalCardId, taskId, newText) => {
		const cardIndex = goalCards.findIndex((card) => card.id === goalCardId);
		const taskIndex = goalCards[cardIndex].tasks.findIndex(
			(task) => task.id === taskId
		);
		const updatedGoalCards = [...goalCards];
		updatedGoalCards[cardIndex].tasks[taskIndex].text = newText;
		setGoalCards(updatedGoalCards);
	};

	const deleteTask = (goalCardId, taskId) => {
		const cardIndex = goalCards.findIndex((card) => card.id === goalCardId);
		const updatedGoalCards = [...goalCards];
		updatedGoalCards[cardIndex].tasks = updatedGoalCards[
			cardIndex
		].tasks.filter((task) => task.id !== taskId);
		setGoalCards(updatedGoalCards);
	};

	const handleGoalTitleChange = (goalCardId, newTitle) => {
		const updatedGoalCards = [...goalCards];
		const cardIndex = updatedGoalCards.findIndex(
			(card) => card.id === goalCardId
		);
		updatedGoalCards[cardIndex].newTask = newTitle;
		setGoalCards(updatedGoalCards);
	};

	const deleteGoal = (goalCardId) => {
		const shouldDelete = window.confirm(
			"Are you sure you want to delete this goal?"
		);
		if (shouldDelete) {
			const updatedGoalCards = goalCards.filter(
				(card) => card.id !== goalCardId
			);
			setGoalCards(updatedGoalCards);
		}
	};

	const handleSetDeadline = (goalCardId, deadline) => {
		const updatedGoalCards = [...goalCards];
		const cardIndex = updatedGoalCards.findIndex(
			(card) => card.id === goalCardId
		);
		updatedGoalCards[cardIndex].newTaskDeadline = deadline;
		setGoalCards(updatedGoalCards);
	};

	return (
		<div className="container mx-auto mt-8">
			<div className="flex mb-4 justify-between items-center">
				<div>
					<h1 className="text-3xl font-bold orange_gradient pb-5">
						Goals
					</h1>
				</div>

				<div className="flex items-center pb-5">
					<input
						type="text"
						value={newGoalTitle}
						onChange={(e) => setNewGoalTitle(e.target.value)}
						placeholder="Goal Title"
						className="px-4 rounded-full mx-4 w-32 focus:outline-none"
					/>
					<button onClick={addGoal}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							height="1em"
							viewBox="0 0 448 512"
						>
							<path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
						</svg>
					</button>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4  gap-2 md:gap-8 lg:gap-16">
				{goalCards.map((goalCard) => (
					<GoalCard
						key={goalCard.id}
						goalCard={goalCard}
						onAddTask={addTask}
						onEditTask={editTask}
						onDeleteTask={deleteTask}
						onGoalTitleChange={handleGoalTitleChange}
						onDeleteGoal={deleteGoal}
						onSetDeadline={handleSetDeadline}
					/>
				))}
			</div>
		</div>
	);
}
