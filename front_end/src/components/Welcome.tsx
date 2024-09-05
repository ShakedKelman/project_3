import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const Welcome = () => {
  const { user } = useSelector((state: RootState) => state.authSlicer);

  return (
    <div>
      {user && <div>Welcome {user?.firstName} </div>}
      {!user && <p> Welcome guest. </p>}
    </div>
  );
};

export default Welcome;