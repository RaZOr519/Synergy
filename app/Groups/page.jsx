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
      const currentSessionEmail = session?.user?.email;
      const response = await fetch("/api/groups");

      if (response.ok) {
        const data = await response.json();

        // Filter groups based on the user's email
        const filteredGroups = data.groups.filter((group) =>
          group.owners.some((owner) => owner === currentSessionEmail)
        );

        //console.log("Filtered Groups:", filteredGroups);

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

  const onGroupAdd = async (id, owner) => {
    console.log(id, owner);
    //add owner to group
    const response = await fetch("/api/groups", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        owner: owner,
        groupId: id,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      fetchGroups();
    } else {
      console.error("Error creating goal:", response.status);
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-8 lg:gap-16">
        {groupCards.map((groupCard) => (
          <GroupCard
            key={groupCard._id}
            groupCard={groupCard}
            onAddGroup={onGroupAdd}
            onDeleteGroup={deleteGroupCard}
          />
        ))}
      </div>
    </div>
  );
}
