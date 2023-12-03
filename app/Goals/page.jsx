"use client";
import React, { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";
import { toast, ToastContainer } from "react-toastify";
import GoalCard from "../components/GoalCard";
import { useSession } from "next-auth/react";

export default function Goals() {
  const [goalCards, setGoalCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const { status, data: session } = useSession();
  const [user, setUser] = useState();

  useEffect(() => {
    if (status === "authenticated") {
      setUser(session?.user?.email);
    }
    if (goalCards.length == 0) fetchGoals();
  }, [status, session, goalCards]);

  const fetchGoals = async () => {
    try {
      const currentSessionEmail = session?.user?.email;
      const response = await fetch("/api/goals");

      if (response.ok) {
        const data = await response.json();
        const filteredGoals = data.goals.filter((goal) => goal.owner === currentSessionEmail);
        //console.log("Fetched goals:", data.goals);
        setGoalCards(filteredGoals);
      } else {
        console.error("Error fetching goals:", response.status);
        console.error("Response:", await response.text());
      }
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  const addGoal = async () => {
    if (newGoalTitle.trim() !== "") {
      try {
        const currentSessionEmail = session?.user?.email;
        const response = await fetch("/api/goals", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: newGoalTitle,
            tasks: [],
            newTask: "",
            completed: false,
            owner: currentSessionEmail,
          }),
        });

        if (response.ok) {
          fetchGoaals();
        } else {
          console.error("Error creating goal:", response.status);
        }
      } catch (error) {
        console.error("Error creating a goal:", error);
      }
    } else {
      console.error("Please enter a valid goal title!");
    }
  };

  const addTask = (goalCardId, text) => {
    const cardIndex = goalCards.findIndex((card) => card._id === goalCardId);
    console.log("goalCardId:", cardIndex);
    const goalId = goalCards[cardIndex]._id;
    const newTask = {
      text: text,
      goalId: goalCardId,
    };
    toast.success("Task added!");

    createTask(goalCardId, newTask);

    const updatedCards = [...goalCards];
    updatedCards[cardIndex].newTask = "";
    updatedCards[cardIndex].newTaskDeadline = "";

    setGoalCards(updatedCards);
  };

  const createTask = async (goalId, taskData) => {
    try {
      const response = await fetch(`/api/goaltask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });
      fetchGoals();
    } catch (error) {
      console.error("Error creating task:", error);
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

  const deleteTask = async (goalCardId, task) => {
    console.log({ goalCardId, task });
    const response = await fetch("/api/goaltask", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cardId: goalCardId,
        taskId: task._id,
      }),
    });
    fetchGoals();
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
            className="px-4 rounded-md mx-4 w-32 focus:outline-none"
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
            key={goalCard._id}
            goalCard={goalCard}
            onAddTask={addTask}
            onEditTask={editTask}
            onDeleteTask={deleteTask}
            onGoalTitleChange={handleGoalTitleChange}
            onDeleteGoal={(id) => deleteGoal(id)}
            onSetDeadline={handleSetDeadline}
            onToggleCompletion={() => toggleCompletion(goalCard._id)}
          />
        ))}
      </div>
    </div>
  );
}
