import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '../../components/Header';
import { AuthContext } from '../../context/AuthContext';
import { reviewService } from '../../services/reviewService';

export default function MyReviews() {
  const { user, isAuthenticated } = useContext(AuthContext);

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['my-reviews', user?.id],
    queryFn: () => reviewService.getMyReviews(),
    select: (response) => response.data || [],
    enabled: isAuthenticated && !!user?.id,
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f3f0' }}>
      <Header />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <h1 style={{ fontFamily: "'Lobster Two', cursive", fontSize: '2.5rem', color: '#1a1a2e', marginBottom: '1.5rem' }}>
          My Reviews
        </h1>
        {isLoading ? (
          <p style={{ color: '#666' }}>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>You haven't reviewed any events yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {reviews.map((review) => (
              <div key={review.id} style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, color: '#1a1a2e', fontSize: '1.25rem' }}>{review.event?.title || 'Unknown Event'}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#E63946', fontWeight: 'bold' }}>
                    <span>⭐</span> {review.rating} / 5
                  </div>
                </div>
                <p style={{ color: '#444', lineHeight: '1.6', margin: 0 }}>"{review.comment}"</p>
                <div style={{ fontSize: '0.85rem', color: '#999', marginTop: '1rem' }}>
                  Posted on {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
