import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '../../components/Header';
import { AuthContext } from '../../context/AuthContext';
import { reviewService } from '../../services/reviewService';

export default function AdminReviews() {
  const { user, isAuthenticated } = useContext(AuthContext);

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: () => reviewService.getAllReviews(),
    select: (response) => response.data || [],
    enabled: isAuthenticated && user?.applyAs === 'Admin',
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f3f0' }}>
      <Header />
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <h1 style={{ fontFamily: "'Lobster Two', cursive", fontSize: '2.5rem', color: '#1a1a2e', marginBottom: '1.5rem' }}>
          All Platform Reviews
        </h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>Monitor feedback across all events on the platform.</p>
        
        {isLoading ? (
          <p style={{ color: '#666' }}>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>No reviews have been submitted on the platform yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {reviews.map((review) => (
              <div key={review.id} style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#E63946', fontWeight: 'bold' }}>
                    <span>⭐</span> {review.rating} / 5
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#999' }}>{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <h4 style={{ margin: '0 0 0.5rem 0', color: '#1a1a2e' }}>{review.event?.title || 'Unknown Event'}</h4>
                <p style={{ color: '#444', lineHeight: '1.6', margin: '0 0 1rem 0', fontStyle: 'italic' }}>"{review.comment}"</p>
                <div style={{ fontSize: '0.85rem', color: '#666', borderTop: '1px solid #f0f0f0', paddingTop: '0.75rem' }}>
                  <strong>Participant:</strong> {review.user?.firstName} {review.user?.lastName}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
