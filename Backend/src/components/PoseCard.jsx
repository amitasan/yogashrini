// src/components/PoseCard.jsx
import React from "react";

const PoseCard = ({ id, sanskritName, englishName, imgUrl }) => {
  // fallback SVG or placeholder when image fails to load
  const fallback =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='100%' height='100%' fill='#f3f4f6'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#9ca3af' font-size='16'>Image not available</text></svg>`
    );

  const handleImgError = (e) => {
    e.currentTarget.src = fallback;
  };

  return (
    <div className="card h-100 shadow-sm pose-card">
      <div className="card-img-wrapper">
        <img
          src={imgUrl}
          alt={`${englishName} (${sanskritName})`}
          className="card-img-top pose-img"
          onError={handleImgError}
          loading="lazy"
        />
      </div>

      <div className="card-body d-flex flex-column">
        <h5 className="card-title mb-1">{englishName}</h5>
        <p className="card-subtitle text-muted mb-3" style={{ fontSize: 13 }}>
          {sanskritName}
        </p>
        <div className="mt-auto">
          <button
            type="button"
            className="btn btn-outline-primary btn-sm w-100"
            onClick={() => alert(`${englishName} — ${sanskritName}`)}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default PoseCard;