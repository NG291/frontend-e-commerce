import React, { useState } from 'react';
import axiosClient from '../../utils/axiosClient';
import { BASE_URL } from '../../utils/apiURL';
import './AddReview.scss';
import ReactStars from "react-stars/dist/react-stars";

const AddReviewForm = ({ productId, userId, onReviewAdded }) => {
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const ratingChanged = (newRating) => {
        setRating(newRating); // Update the rating when the star rating is changed
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const reviewData = { rating, comment, userId, productId };
            await axiosClient.post(`${BASE_URL}/api/reviews/product/${productId}/user/${userId}`, reviewData);
            onReviewAdded(); // Refresh reviews after submission
        } catch (error) {
            console.error("Error submitting review:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-review-form">
            <h3>Write a Review</h3>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Rating:</label>
                    <ReactStars
                        count={5}
                        value={rating}
                        onChange={ratingChanged}
                        size={24}
                        activeColor="#ffd700"
                    />
                </div>
                <div className="comment-section">
                    <label htmlFor="comment" className="comment-label">Comment:</label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write your review here..."
                        className="comment-textarea"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary submit-review-button"
                >
                    {loading ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : 'Submit Review'}
                </button>
            </form>
        </div>
    );
};

export default AddReviewForm;