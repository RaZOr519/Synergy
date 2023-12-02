import React from "react";

const GroupCard = ({ groupCard, onDeleteGroup, onAddGroup }) => {
  const confirmDeleteGroup = () => {
    onDeleteGroup(groupCard._id); // Assuming the group ID is stored in _id
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold mb-2">{groupCard.name}</h2>
        <button onClick={confirmDeleteGroup} className="text-gray-500 hover:text-red-500 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512">
            <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s-32.8 12.5-45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" />
          </svg>
        </button>
      </div>

      <div className="flex mb-4 justify-center">
        <div className="flex flex-col items-center flex-grow justify-center">
          <button onClick={() => onAddGroup()}>see more</button>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
