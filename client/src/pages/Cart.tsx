import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import type { CartItem } from '../types';
import EditorialKicker from '../components/shared/EditorialKicker';
import PawStamp from '../components/shared/PawStamp';
import EmptyState from '../components/shared/EmptyState';
import styles from './Cart.module.css';

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart();
  const { user } = useAuth();
  const [success, setSuccess] = useState(false);

  const placeMutation = useMutation({
    mutationFn: () =>
      api.orders.place(
        items.map(i => ({
          item_id: i.menu_item.id,
          quantity: i.quantity,
          customizations: i.customizations,
          subtotal: i.subtotal,
        }))
      ),
    onSuccess: () => { clearCart(); setSuccess(true); },
  });

  if (success) {
    return (
      <main className={styles.page}>
        <div className={styles.confirmation}>
          <PawStamp size={40} color="var(--color-accent)" />
          <h1 className={styles.confirmTitle}>Ritual placed.</h1>
          <p className={styles.confirmSub}>
            We're crafting your drinks now. Come collect when it's ready.
          </p>
          <Link to="/orders" className={styles.confirmLink}>View your rituals →</Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <EditorialKicker label="your ritual" />
        <h1 className={styles.title}>{items.length === 0 ? 'Nothing yet.' : 'Your order.'}</h1>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="No little rituals yet."
          body="Head to the menu to build your first one."
          action={{ label: 'Browse the menu', to: '/menu' }}
        />
      ) : (
        <div className={styles.layout}>
          {/* ── Line items ── */}
          <div className={styles.items}>
            {items.map(item => (
              <CartLineItem
                key={item.id}
                item={item}
                onRemove={removeItem}
                onQty={updateQuantity}
              />
            ))}
          </div>

          {/* ── Receipt summary ── */}
          <div className={styles.receipt}>
            <div className={styles.receiptHeader}>
              <PawStamp size={16} color="var(--color-accent-sand)" />
              <span className={styles.receiptTitle}>mewcha</span>
            </div>

            <div className={styles.receiptLines}>
              {items.map(item => (
                <div key={item.id} className={styles.receiptLine}>
                  <span className={styles.receiptName}>
                    {item.quantity}× {item.menu_item.name}
                  </span>
                  <span className={styles.receiptAmt}>
                    ${(item.subtotal * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className={styles.receiptDivider} />

            <div className={styles.receiptRow}>
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className={styles.receiptRow}>
              <span>Tax (est. 9%)</span>
              <span>${(total * 0.09).toFixed(2)}</span>
            </div>

            <div className={styles.receiptTotal}>
              <span>Total</span>
              <span className={styles.receiptTotalAmt}>${(total * 1.09).toFixed(2)}</span>
            </div>

            <button
              className={styles.placeBtn}
              disabled={!user || placeMutation.isPending}
              onClick={() => placeMutation.mutate()}
              aria-disabled={!user}
            >
              {placeMutation.isPending ? 'Placing...' : 'Place ritual'}
            </button>

            {!user && (
              <p className={styles.loginNote}>
                <Link to="/login">Sign in</Link> to place your order.
              </p>
            )}

            {placeMutation.isError && (
              <p className={styles.errorNote}>Something went wrong. Please try again.</p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

function CartLineItem({
  item, onRemove, onQty,
}: {
  item: CartItem;
  onRemove: (id: string) => void;
  onQty: (id: string, qty: number) => void;
}) {
  const { customizations } = item;
  const tags: string[] = [
    customizations.size?.label,
    customizations.ice?.label,
    customizations.sweetness?.label,
    ...(customizations.toppings?.map(t => t.label) ?? []),
  ].filter(Boolean) as string[];

  return (
    <div className={styles.lineItem}>
      <div className={styles.lineLeft}>
        <span className={styles.lineName}>{item.menu_item.name}</span>
        {tags.length > 0 && (
          <div className={styles.lineTags}>
            {tags.map(tag => (
              <span key={tag} className={styles.lineTag}>{tag}</span>
            ))}
          </div>
        )}
      </div>

      <div className={styles.lineRight}>
        <span className={styles.linePrice}>
          ${(item.subtotal * item.quantity).toFixed(2)}
        </span>

        <div className={styles.qty}>
          <button
            className={styles.qtyBtn}
            onClick={() => onQty(item.id, item.quantity - 1)}
            aria-label="Decrease quantity"
          >−</button>
          <span className={styles.qtyNum} aria-label={`Quantity: ${item.quantity}`}>
            {item.quantity}
          </span>
          <button
            className={styles.qtyBtn}
            onClick={() => onQty(item.id, item.quantity + 1)}
            aria-label="Increase quantity"
          >+</button>
        </div>

        <button
          className={styles.removeBtn}
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${item.menu_item.name}`}
        >
          Remove
        </button>
      </div>
    </div>
  );
}
