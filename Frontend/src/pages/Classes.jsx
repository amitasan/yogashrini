// src/pages/Classes.jsx
import React from "react";
import posesData from "../data/poses.json";
import PoseCard from "../components/PoseCard";
import "../styles/Classes.css";

const Classes = () => {
  // The JSON you provided has a top-level "Poses" array
  const poses = posesData.Poses || [];

  return (
    <div className="container py-4">
      <h2 className="mb-4">Yoga Postures</h2>

      <div className="row">
        {poses.map((pose) => (
          <div key={pose.id} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
            <PoseCard
              id={pose.id}
              sanskritName={pose.sanskrit_name}
              englishName={pose.english_name}
              imgUrl={pose.img_url}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Classes;
