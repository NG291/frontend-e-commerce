import React, { useState } from 'react';
import axiosClient from '../../utils/axiosClient';
import { BASE_URL } from '../../utils/apiURL';
import './AddReview.scss';
import ReactStars from "react-stars/dist/react-stars";

const AddReviewForm = ({ productId, userId, onReviewAdded }) => {
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const ratingChanged = (newRating) => {
        setRating(newRating);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!comment.trim()) {
            setError('Comment is required.');
            setLoading(false);
            return;
        }

        try {
            const reviewData = { rating, comment, userId, productId };
            await axiosClient.post(`${BASE_URL}/api/reviews/product/${productId}/user/${userId}`, reviewData);
            setRating(1);
            setComment('');
            onReviewAdded();
        } catch (error) {
            setError('Error submitting review. Please try again.');
            console.error("Error submitting review:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-review-form">
            <h3>Comment</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Star Rating:</label>
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
