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
        <button onClick={confirmDeleteGroup} className="text-gray-500 hover:text-red-500 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s-32.8 12.5-45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </button>
      </div>

      {/* Display group members */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold mb-1">Members:</h3>
        <ul>
          {groupCard.owners ??
            groupCard.owners.map((owner) => (
              <li className="text-gray-600">
                {owner} {/* Display group owner */}
              </li>
            ))}
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
