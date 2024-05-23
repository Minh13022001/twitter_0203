import React from 'react';


const FollowButton = ({ unFollow }) => {
    return (
      <button
      onClick={() => (true)}
      className="btn bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700"
      >
        Follow
      </button>
    );
  };
  
  export default FollowButton;