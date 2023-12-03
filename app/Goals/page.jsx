"use client";
import React, { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";
import GoalCard from "../components/GoalCard";

export default function Goals() {
  const [goalCards, setGoalCards] = useState([]);
  const [newGoalTitle, setNewGoalTitle] = useState("");

  useEffect(() => {
    // Fetch goals from the database when the component mounts
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await fetch("/api/goals");
      if (response.ok) {
        const data = await response.json();
        setGoalCards(data.goals);
      } else {
        console.error("Error fetching goals:", response.status);
      }
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  const addGoal = async () => {
    if (newGoalTitle.trim() !== "") {
      try {
        const response = await fetch("/api/goals", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: newGoalTitle,
            tasks: [],
            newTask: "",
            newTaskDeadline: "",
            completed: false,
          }),
        });

        if (response.ok) {
          // Fetch goals again after adding a new goal
          fetchGoals();
          setNewGoalTitle("");
        } else {
          console.error("Error adding goal:", response.status);
        }
      } catch (error) {
        console.error("Error adding goal:", error);
      }
    }
  };

  const addTask = async (goalCardId) => {
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

      // Update tasks in the database
      await updateGoalTasks(goalCardId, updatedGoalCards[cardIndex].tasks);

      setGoalCards(updatedGoalCards);
    }
  };

  const updateGoalTasks = async (goalCardId, tasks) => {
    try {
      await fetch(`/api/goals/${goalCardId}/tasks`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tasks }),
      });
    } catch (error) {
      console.error("Error updating goal tasks:", error);
    }
  };

  const editTask = (goalCardId, taskId, newText) => {
    const cardIndex = goalCards.findIndex((card) => card.id === goalCardId);
    const taskIndex = goalCards[cardIndex].tasks.findIndex((task) => task.id === taskId);
    const updatedGoalCards = [...goalCards];
    updatedGoalCards[cardIndex].tasks[taskIndex].text = newText;

    // Update tasks in the database
    updateGoalTasks(goalCardId, updatedGoalCards[cardIndex].tasks);

    setGoalCards(updatedGoalCards);
  };

  const deleteTask = async (goalCardId, taskId) => {
    const cardIndex = goalCards.findIndex((card) => card.id === goalCardId);
    const updatedGoalCards = [...goalCards];
    updatedGoalCards[cardIndex].tasks = updatedGoalCards[cardIndex].tasks.filter(
      (task) => task.id !== taskId
    );

    // Update tasks in the database
    updateGoalTasks(goalCardId, updatedGoalCards[cardIndex].tasks);

    setGoalCards(updatedGoalCards);
  };

  const handleGoalTitleChange = (goalCardId, newTitle) => {
    const updatedGoalCards = [...goalCards];
    const cardIndex = updatedGoalCards.findIndex((card) => card.id === goalCardId);
    updatedGoalCards[cardIndex].newTask = newTitle;
    setGoalCards(updatedGoalCards);
  };

  const deleteGoal = async (goalCardId) => {
    const shouldDelete = window.confirm("Are you sure you want to delete this goal?");
    if (shouldDelete) {
      try {
        const response = await fetch(`/api/goals/${goalCardId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          // Fetch goals again after deleting a goal
          fetchGoals();
        } else {
          console.error("Error deleting goal:", response.status);
        }
      } catch (error) {
        console.error("Error deleting goal:", error);
      }
    }
  };

  const handleSetDeadline = (goalCardId, deadline) => {
    const updatedGoalCards = [...goalCards];
    const cardIndex = updatedGoalCards.findIndex((card) => card.id === goalCardId);
    updatedGoalCards[cardIndex].newTaskDeadline = deadline;

    // Update tasks in the database
    updateGoalTasks(goalCardId, updatedGoalCards[cardIndex].tasks);

    setGoalCards(updatedGoalCards);
  };

  const toggleCompletion = async (goalCardId) => {
    const updatedGoalCards = [...goalCards];
    const cardIndex = updatedGoalCards.findIndex((card) => card.id === goalCardId);
    updatedGoalCards[cardIndex].completed = !updatedGoalCards[cardIndex].completed;

    try {
      await fetch(`/api/goals/${goalCardId}/complete`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed: updatedGoalCards[cardIndex].completed }),
      });
    } catch (error) {
      console.error("Error updating goal completion:", error);
    }

    setGoalCards(updatedGoalCards);
  };

  return (
    <div className="container mx-auto mt-8">
      <div className="flex mb-4 justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold orange_gradient pb-5">Goals</h1>
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
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
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
            onDeleteGoal={() => deleteGoal(goalCard.id)}
            onSetDeadline={handleSetDeadline}
            onToggleCompletion={() => toggleCompletion(goalCard.id)}
          />
        ))}
      </div>
    </div>
  );
}
