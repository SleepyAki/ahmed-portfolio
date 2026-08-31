import React from "react";
import { Html, useProgress } from "@react-three/drei";

const RoomLoader = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="room-loader">
        <div className="room-loader-bar">
          <div className="room-loader-fill" style={{ width: `${progress}%` }} />
        </div>
        <p>Loading room… {Math.round(progress)}%</p>
      </div>
    </Html>
  );
};

export default RoomLoader;
