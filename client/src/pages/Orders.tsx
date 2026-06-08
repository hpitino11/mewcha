import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import type { Order } from '../types';
import EditorialKicker from '../components/shared/EditorialKicker';
import StatusBadge from '../components/shared/StatusBadge';
import EmptyState from '../components/shared/EmptyState';
import styles from './Orders.module.css';

export default function Orders() {
  const { user } = useAuth();
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: api.orders.list,
    enabled: !!user,
  });

  if (!user) {
    return (
      <main className={styles.page}>
        <EmptyState
          title="Sign in to see your rituals."
          action={{ label: 'Sign in', to: '/login' }}
        />
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <EditorialKicker label="past rituals" />
        <h1 className={styles.title}>Your history.</h1>
      </div>

      {isLoading ? (
        <p className={styles.loading}>Loading your rituals...</p>
      ) : !orders?.length ? (
        <EmptyState
          title="No past rituals yet."
          body="Your order history will appear here once you place your first order."
          action={{ label: 'Browse the menu', to: '/menu' }}
        />
      ) : (
        <div className={styles.list}>
          {orders.map(order => <OrderCard key={order.id} order={order} />)}
        </div>
      )}
    </main>
  );
}

function OrderCard({ order }: { order: Order }) {
  const date = new Date(order.created_at).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardLeft}>
          <span className={styles.cardId}>Order #{order.id}</span>
          <span className={styles.cardDate}>{date}</span>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {order.items && order.items.length > 0 && (
        <div className={styles.cardItems}>
          {order.items.map(item => (
            <div key={item.id} className={styles.cardItem}>
              <span className={styles.cardItemName}>{item.quantity}× {item.name}</span>
              <span className={styles.cardItemAmt}>${parseFloat(item.subtotal).toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}

      <div className={styles.cardFooter}>
        <span className={styles.cardTotalLabel}>Total</span>
        <span className={styles.cardTotal}>${parseFloat(order.total).toFixed(2)}</span>
      </div>
    </div>
  );
}
