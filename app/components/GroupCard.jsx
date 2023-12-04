// GroupCard.js

import React, { useState } from "react";

const GroupCard = ({ groupCard, onDeleteGroup, onAddGroup }) => {
  const [newOwner, setNewOwner] = useState("");
  const confirmDeleteGroup = () => {
    onDeleteGroup(groupCard._id);
  };

  return (
    <div className="bg-slate-200 rounded-md p-4 w-60 hover:shadow-xl hover:bg-slate-100 border-2">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold mb-2">{groupCard.name}</h2>
      </div>

      {/* Display group members */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-1">Members:</h3>
        <ul>
          {groupCard.owners
            ? groupCard.owners.map((owner) => {
                return (
                  <li key={owner} className="text-gray-600">
                    <span style={{ fontSize: "smaller" }}> {owner} </span>
                  </li>
                );
              })
            : {}}
        </ul>
      </div>

      <div className="flex mb-4 justify-center">
        <div className="flex flex-col items-center flex-grow justify-center">
          <textarea
            value={newOwner}
            onChange={(e) => setNewOwner(e.target.value)}
            placeholder="Add members"
            className="mr-2 px-10 border border-gray-50 rounded-md w-full resize-none"
            rows="1"
            style={{ whiteSpace: "pre-line" }}
          />
          <button
            onClick={() => {
              onAddGroup(groupCard._id, newOwner);
              setNewOwner("");
            }}
            className="m-2 p-5 py-1 bg-slate-300 rounded-md text-sm text-black hover:bg-slate-400"
          >
            Add member
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
