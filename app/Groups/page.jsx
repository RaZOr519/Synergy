"use client";
import "tailwindcss/tailwind.css";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import GroupCard from "../components/GroupCard";

export default function Tasks() {
  const { status, data: session } = useSession();
  const [user, setUser] = useState();
  const [groupCards, setGroupCards] = useState([]);
  const [newCardTitle, setNewCardTitle] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      setUser(session?.user?.email);
    }
  }, [status, session]);

  const fetchGroups = async () => {
    try {
      const response = await fetch("/api/groups");

      if (response.ok) {
        const data = await response.json();

        // Filter groups based on the user's email
        const filteredGroups = data.groups.filter((group) => group.owner === user);

        console.log("Filtered Groups:", filteredGroups);

        setGroupCards(filteredGroups);

        // Set newCardTitle based on the name of the first group (if available)
        if (filteredGroups.length > 0) {
          setNewCardTitle(filteredGroups[0].name);
        } else {
          setNewCardTitle(""); // Handle the case when there are no groups
        }
      } else {
        console.error("Error fetching groups:", response.status);
      }
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const addGroupCard = () => {
    if (newCardTitle.trim() !== "") {
      setGroupCards([
        ...groupCards,
        {
          id: Date.now(),
          title: newCardTitle,
        },
      ]);
      setNewCardTitle("");
    }
  };

  const deleteGroupCard = (groupId) => {
    const shouldDelete = window.confirm(`Are you sure you want to delete this group?`);
    if (shouldDelete) {
      const updatedGroupCards = groupCards.filter((groupCard) => groupCard._id !== groupId);
      setGroupCards(updatedGroupCards);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [user]);

  return (
    <div className="container mx-auto mt-8">
      <div className="flex mb-4 justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold orange_gradient pb-5">Groups</h1>
        </div>

        <div className="flex items-center pb-5">
          <input
            type="text"
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            placeholder="Group Title"
            className="px-4 rounded-full mx-4 w-32 focus:outline-none"
          />
          <button onClick={addGroupCard}>
            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
              <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-8 lg:gap-16">
        {groupCards.map((groupCard) => (
          <GroupCard key={groupCard._id} groupCard={groupCard} onDeleteGroup={deleteGroupCard} />
        ))}
      </div>
    </div>
  );
}
