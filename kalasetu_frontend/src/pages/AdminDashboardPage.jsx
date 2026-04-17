import { useEffect, useState } from 'react';
import { productService } from '../services/productService';
import { artisanService } from '../services/artisanService';
import { normalizeApiError } from '../services/errorService';
import { ErrorAlert } from '../components/ui/ErrorAlert';
import { LoadingState } from '../components/ui/LoadingState';
import { Button } from '../components/ui/Button';

export function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pendingApprovalProducts, setPendingApprovalProducts] = useState([]);
  const [actionLoadingById, setActionLoadingById] = useState({});
  const [confirmation, setConfirmation] = useState(null);
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
        (p) => p.is_approved && p.verification_status === 'VERIFIED'
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

  const openConfirmation = (product, action) => {
    setConfirmation({
      productId: product.id,
      productName: product.name,
      action,
    });
  };

  const closeConfirmation = () => {
    setConfirmation(null);
  };

  const confirmAdminAction = async () => {
    if (!confirmation) return;

    await handleAdminAction(confirmation.productId, confirmation.action);
    closeConfirmation();
  };

  const handleAdminAction = async (productId, action) => {
    try {
      setError('');
      setSuccess('');
      setActionLoadingById((current) => ({ ...current, [productId]: true }));

      if (action === 'approve') {
        await productService.approveProduct(productId);
        setSuccess('Product approved. It is now visible in marketplace.');
      } else {
        await productService.rejectProduct(productId);
        setSuccess('Product rejected and removed from marketplace.');
      }

      await fetchDashboardData();
    } catch (err) {
      setError(normalizeApiError(err, 'Failed to update product status'));
    } finally {
      setActionLoadingById((current) => ({ ...current, [productId]: false }));
    }
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px' }}>
      <h1 style={{ marginBottom: '8px' }}>Admin Dashboard</h1>
      <p style={{ color: '#64748b', marginBottom: '20px' }}>
        Approve products for marketplace visibility. Consultant verification adds the verified badge.
      </p>

      <ErrorAlert message={error} />
      {success ? (
        <div style={{ marginBottom: '16px', padding: '12px 14px', borderRadius: '8px', background: '#ecfdf5', color: '#065f46' }}>
          {success}
        </div>
      ) : null}

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
            <p style={{ margin: 0, color: '#64748b' }}>Fully Verified Products</p>
            <h2 style={{ margin: '8px 0 0' }}>{stats.fullyVerifiedProducts}</h2>
          </div>

          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
            <p style={{ margin: 0, color: '#64748b' }}>Pending Products</p>
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
          <h2 style={{ marginTop: 0, marginBottom: '12px' }}>Pending Admin Approval</h2>

          {pendingApprovalProducts.length === 0 ? (
            <p style={{ color: '#64748b', margin: 0 }}>No products waiting for admin approval.</p>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {pendingApprovalProducts.map((product) => {
                const actionLoading = !!actionLoadingById[product.id];
                return (
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

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <Button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => openConfirmation(product, 'approve')}
                      >
                        {actionLoading ? 'Processing...' : 'Approve'}
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        disabled={actionLoading}
                        onClick={() => openConfirmation(product, 'reject')}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {confirmation && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '16px',
          }}
          onClick={closeConfirmation}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '460px',
              background: '#fff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 20px 40px rgba(2, 6, 23, 0.25)',
              padding: '20px',
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <h3 style={{ marginTop: 0, marginBottom: '10px' }}>Confirm Action</h3>
            <p style={{ color: '#475569', marginBottom: '18px' }}>
              Are you sure you want to {confirmation.action} <strong>{confirmation.productName}</strong>?
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <Button type="button" variant="secondary" onClick={closeConfirmation}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={confirmAdminAction}
                disabled={!!actionLoadingById[confirmation.productId]}
              >
                {actionLoadingById[confirmation.productId]
                  ? 'Processing...'
                  : confirmation.action === 'approve'
                    ? 'Yes, Approve'
                    : 'Yes, Reject'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
