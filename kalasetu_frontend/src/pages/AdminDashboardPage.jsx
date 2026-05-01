import { useEffect, useState } from 'react';
import { productService } from '../services/productService';
import { artisanService } from '../services/artisanService';
import { normalizeApiError } from '../services/errorService';
import { ErrorAlert } from '../components/ui/ErrorAlert';
import { LoadingState } from '../components/ui/LoadingState';

export function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingApprovalProducts, setPendingApprovalProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    fullyVerifiedProducts: 0,
    pendingProducts: 0,
    totalArtisans: 0,
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const [productsData, artisansData] = await Promise.all([
        productService.getProducts(1),
        artisanService.getArtisans(1),
      ]);

      const pendingApprovalData = await productService.getPendingApprovalProducts();

      const products = productsData?.results || productsData || [];
      const artisans = artisansData?.results || artisansData || [];
      const pendingApproval = Array.isArray(pendingApprovalData) ? pendingApprovalData : [];

      const fullyVerifiedCount = products.filter(
        (p) => p.verification_status === 'VERIFIED'
      ).length;

      setStats({
        totalProducts: products.length,
        fullyVerifiedProducts: fullyVerifiedCount,
        pendingProducts: pendingApproval.length,
        totalArtisans: artisans.length,
      });
      setPendingApprovalProducts(pendingApproval);
    } catch (err) {
      setError(normalizeApiError(err, 'Failed to load admin dashboard'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px' }}>
      <h1 style={{ marginBottom: '8px' }}>Admin Dashboard</h1>
      <p style={{ color: '#64748b', marginBottom: '20px' }}>
        Overview of the marketplace. Products are published automatically once a consultant verifies them — no admin approval step is required.
      </p>

      <ErrorAlert message={error} />

      {loading ? (
        <LoadingState />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
          }}
        >
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
            <p style={{ margin: 0, color: '#64748b' }}>Total Products</p>
            <h2 style={{ margin: '8px 0 0' }}>{stats.totalProducts}</h2>
          </div>

          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
            <p style={{ margin: 0, color: '#64748b' }}>Consultant-Verified</p>
            <h2 style={{ margin: '8px 0 0' }}>{stats.fullyVerifiedProducts}</h2>
          </div>

          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
            <p style={{ margin: 0, color: '#64748b' }}>Awaiting Consultant Review</p>
            <h2 style={{ margin: '8px 0 0' }}>{stats.pendingProducts}</h2>
          </div>

          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
            <p style={{ margin: 0, color: '#64748b' }}>Total Artisans</p>
            <h2 style={{ margin: '8px 0 0' }}>{stats.totalArtisans}</h2>
          </div>
        </div>
      )}

      {!loading && (
        <section style={{ marginTop: '24px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
          <h2 style={{ marginTop: 0, marginBottom: '4px' }}>Awaiting Consultant Verification</h2>
          <p style={{ color: '#64748b', marginTop: 0, marginBottom: '12px', fontSize: '14px' }}>
            These products are pending consultant review. Consultants verify and approve products directly.
          </p>

          {pendingApprovalProducts.length === 0 ? (
            <p style={{ color: '#64748b', margin: 0 }}>No products awaiting consultant verification.</p>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {pendingApprovalProducts.map((product) => (
                <div
                  key={product.id}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '16px',
                    flexWrap: 'wrap',
                  }}
                >
                  <div>
                    <strong>{product.name}</strong>
                    <p style={{ margin: '4px 0', color: '#64748b' }}>₹{product.price}</p>
                    <p style={{ margin: 0, color: '#64748b' }}>
                      Artisan: {product.artisan?.first_name} {product.artisan?.last_name}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{
                      background: '#fef3c7', color: '#92400e',
                      borderRadius: '6px', padding: '4px 10px', fontSize: '13px', fontWeight: 600
                    }}>Pending Review</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
