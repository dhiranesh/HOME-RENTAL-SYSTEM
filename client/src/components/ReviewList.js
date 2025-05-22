import React from "react";

// ReviewList component
const ReviewList = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return <p>No reviews yet for this property.</p>;
  }

  return (
    <div style={{ marginTop: "2rem" }}>
      <h4>Reviews:</h4>
      {reviews.map((review, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #eee",
            padding: "0.5rem",
            marginBottom: "0.5rem",
          }}
        >
          <p>
            <strong>Rating:</strong> {review.rating}/5
          </p>
          <p>{review.comment}</p>
          <p>
            <small>
              By: {review.user?.name || "User " + review.user} on{" "}
              {new Date(review.createdAt).toLocaleDateString()}
            </small>
          </p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
