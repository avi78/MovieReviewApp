import React, { useEffect, useRef, useState } from "react";
import api from "../../api/axiosConfig";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Alert } from "react-bootstrap";
import ReviewForm from "../reviewForm/ReviewForm";

const Reviews = ({ getMovieData, movie, reviews, setReviews }) => {
  const [successMessage, setSuccessMessage] = useState("");
  const revText = useRef();
  const { movieId } = useParams();

  // Fetch movie data and reviews on component mount and when movieId changes
  useEffect(() => {
    const fetchMovieDataAndReviews = async () => {
      try {
        // Fetch movie data
        await getMovieData(movieId);

        // Fetch reviews for the movie
        const reviewsResponse = await api.get(
          `/api/v1/reviews/movie/${movieId}`
        );
        setReviews(reviewsResponse.data);
      } catch (error) {
        console.error("Error fetching movie data and reviews:", error);
      }
    };

    fetchMovieDataAndReviews();
  }, [getMovieData, movieId, setReviews]);

  // Handle review submission
  const addReview = async (e) => {
    e.preventDefault();

    const rev = revText.current;

    try {
      // Post new review
      await api.post("/api/v1/reviews", {
        reviewBody: rev.value,
        imdbId: movieId,
      });

      // Fetch updated reviews
      const updatedReviewsResponse = await api.get(
        `/api/v1/reviews/movie/${movieId}`
      );
      setReviews(updatedReviewsResponse.data);

      // Clear input and show success message
      rev.value = "";
      setSuccessMessage("Review added successfully!");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      console.error("Error adding review:", err);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <h3>Reviews</h3>
        </Col>
      </Row>
      {successMessage && (
        <Row className="mt-2">
          <Col>
            <Alert variant="success">{successMessage}</Alert>
          </Col>
        </Row>
      )}
      <Row className="mt-2">
        <Col>
          <img src={movie?.poster} alt="" />
        </Col>
        <Col>
          <Row>
            <Col>
              <ReviewForm
                handleSubmit={addReview}
                revText={revText}
                labelText="Write a Review?"
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <hr />
            </Col>
          </Row>
          {reviews?.map((r, index) => (
            <React.Fragment key={r._id || index}>
              <Row>
                <Col>{r.body}</Col>
              </Row>
              <Row>
                <Col>
                  <hr />
                </Col>
              </Row>
            </React.Fragment>
          ))}
        </Col>
      </Row>
      <Row>
        <Col>
          <hr />
        </Col>
      </Row>
    </Container>
  );
};

export default Reviews;
