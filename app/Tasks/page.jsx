"use client";

import "tailwindcss/tailwind.css";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { toast, ToastContainer } from "react-toastify";
import TaskCard from "../components/TaskCard";
import Image from "next/image";

export default function Tasks() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [user, setUser] = useState();


  const { status, data: session } = useSession();
  useEffect(() => {
    if (status === "authenticated") {
      setUser(session?.user?.email);
    }
  }, [status, session]);

  const fetchTasksByGroup = async (groupId) => {
    try {
      const response = await fetch(`/api/tasks?groupId=${groupId}`);
      if (response.ok) {
        const data = await response.json();
        return data.tasks;
      } else {
        console.error("Error fetching tasks:", response.status);
        return [];
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return [];
    }
  };

  const fetchGroups = async () => {
    setLoading(true);

    try {
      // Assuming you have a function to get the current session email
      const currentSessionEmail = session?.user?.email;
      const response = await fetch("/api/groups");

      if (response.ok) {
        const data = await response.json();

        // Filter groups based on the current session email
        const filteredGroups = data.groups.filter((group) =>
          group.owners.some((owner) => owner === currentSessionEmail)
        );

        setCards(filteredGroups);
      } else {
        console.error("Error fetching groups:", response.status);
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (cards.length == 0) fetchGroups();
  }, [cards]);

  const createTask = async (groupId, taskData) => {
    try {
      const response = await fetch(`/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      });
      fetchGroups();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const addTask = (cardId) => {
    const cardIndex = cards.findIndex((card) => card._id === cardId);
    const groupId = cards[cardIndex]._id;

    if (cards[cardIndex].newTask.trim() !== "") {
      const currentSessionEmail = session?.user?.email;
      console.log(currentSessionEmail);
      const newTask = {
        text: cards[cardIndex].newTask,
        deadline: cards[cardIndex].newTaskDeadline,
        groupId: groupId,
        cardId: groupId,
        userEmail: currentSessionEmail,
      };
      toast.success("Task added!");
      createTask(groupId, newTask);

      const updatedCards = [...cards];
      updatedCards[cardIndex].newTask = "";
      updatedCards[cardIndex].newTaskDeadline = "";
      setCards(updatedCards);
    }
  };

  const editTask = async (cardId, taskId, task, newText) => {
    // Check if the deadline is passed
    const isPastDeadline =
      new Date(updatedCards[cardIndex].tasks[taskIndex].deadline) < new Date();
  
    if (isPastDeadline) {
      try {
        // Use the Next.js API route to send an email
        const response = await fetch("/api/sendEmail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: session?.user?.email,
            subject: "Task Deadline Passed",
            text: `The deadline for the task "${newText}" has passed.`,
          }),
        });
  
        if (response.ok) {
          console.log("Email sent successfully");
        } else {
          console.error("Failed to send email");
        }
      } catch (error) {
        console.error("Error sending email:", error);
      }
    }
  };

  const addCard = async () => {
    if (newCardTitle.trim() !== "") {
      try {
        const response = await fetch("/api/groups", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            groupName: newCardTitle,
            owners: [user],
            tasks: [],
          }),
        });

        toast.success("Group created!");

        setLoading(true);
        fetchGroups();
        setLoading(false);
      } catch (error) {
        console.error("Error creating a group:", error);
      }
    } else {
      toast.error("Please enter a valid group name!");
    }
  };

  const deleteTask = async (cardId, taskId, card, task) => {
    const cardIndex = cards.findIndex((card) => card._id === cardId);

    const response = await fetch("/api/tasks", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cardId,
        taskId,
      }),
    });
    fetchGroups();
  };

  const handleCardTitleChange = (cardId, newTitle) => {
    const updatedCards = [...cards];
    const cardIndex = updatedCards.findIndex((card) => card._id === cardId);
    updatedCards[cardIndex].newTask = newTitle;
    setCards(updatedCards);
  };

  const deleteCard = async (cardId) => {
    try {
      const shouldDelete = window.confirm(`Are you sure you want to delete this group?`);
      if (shouldDelete) {
        const response = await fetch("/api/groups", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ groupId: cardId }),
        });
        fetchGroups();
      }
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  const handleSetDeadline = (cardId, deadline) => {
    const updatedCards = [...cards];
    const cardIndex = updatedCards.findIndex((card) => card._id === cardId);
    updatedCards[cardIndex].newTaskDeadline = deadline;
    setCards(updatedCards);
  };

  const handleSubmit = (e) => {
    const groupObj = {
      groupName: newCardTitle,
    };
    console.log(groupObj);
  };

  return (
    <>
      <ToastContainer />

      <div>
        <div className="flex mb-4 justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold orange_gradient pb-5">Tasks</h1>
          </div>

          <div className="flex items-center pb-5">
            <input
              type="text"
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              placeholder="Group Name"
              className="px-4 rounded-full mx-4 w-32 focus:outline-none"
            />
            <button onClick={addCard}>
              <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
              </svg>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col w-full items-center justify-center h-[200px]">
            {" "}
            <Image src="/assets/icons/Disk-0.8s-184px.svg" width={100} height={100}></Image>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4  gap-2 md:gap-8 lg:gap-8">
            {cards.map((card) => (
              <div key={card._id}>
                <TaskCard
                  key={card._id}
                  card={card}
                  onAddTask={addTask}
                  onEditTask={editTask}
                  onDeleteTask={deleteTask}
                  onCardTitleChange={handleCardTitleChange}
                  onDeleteCard={() => deleteCard(card._id)}
                  onSetDeadline={handleSetDeadline}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
