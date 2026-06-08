import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import type { MenuItem } from '../types';
import EditorialKicker from '../components/shared/EditorialKicker';
import StatusBadge from '../components/shared/StatusBadge';
import EmptyState from '../components/shared/EmptyState';
import styles from './Admin.module.css';

const STATUS_OPTIONS = ['pending', 'in_progress', 'ready', 'completed'] as const;

const CATEGORIES = [
  { id: 1, name: 'Matcha' }, { id: 2, name: 'Boba' },
  { id: 3, name: 'Coffee' }, { id: 4, name: 'Seasonal' },
];

export default function Admin() {
  const { isAdmin } = useAuth();
  const [tab, setTab] = useState<'orders' | 'menu'>('orders');
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  if (!isAdmin) {
    return (
      <main className={styles.page}>
        <EmptyState title="Access restricted." body="This page is for Mewcha staff only." />
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.header}>
        <div>
          <EditorialKicker label="admin" />
          <h1 className={styles.title}>Today's Queue</h1>
          <p className={styles.subtitle}>rituals in progress</p>
        </div>
        {tab === 'menu' && (
          <button
            className={styles.addBtn}
            onClick={() => { setEditItem(null); setShowForm(true); }}
          >
            + New drink
          </button>
        )}
      </div>

      <div className={styles.tabs}>
        {(['orders', 'menu'] as const).map(t => (
          <button
            key={t}
            className={`${styles.tab} ${tab === t ? styles.tabActive : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'orders' ? 'Order Queue' : 'Menu'}
          </button>
        ))}
      </div>

      {tab === 'orders'
        ? <OrderQueue />
        : <MenuManagement onEdit={item => { setEditItem(item); setShowForm(true); }} />
      }

      {showForm && (
        <ItemForm
          item={editItem}
          onClose={() => { setShowForm(false); setEditItem(null); }}
        />
      )}
    </main>
  );
}

function OrderQueue() {
  const qc = useQueryClient();
  const { data: orders, isLoading } = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: api.admin.orderList,
    refetchInterval: 15_000,
  });

  const update = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      api.admin.orderUpdate(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'orders'] }),
  });

  const counts = (orders ?? []).reduce<Record<string, number>>((acc, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {});

  if (isLoading) return <p className={styles.loading}>Loading queue...</p>;

  return (
    <>
      {/* Stat cards */}
      <div className={styles.stats}>
        {[
          { label: 'Pending',     key: 'pending'     },
          { label: 'In Progress', key: 'in_progress' },
          { label: 'Ready',       key: 'ready'        },
          { label: 'Completed',   key: 'completed'    },
        ].map(s => (
          <div key={s.key} className={styles.stat}>
            <span className={styles.statNum}>{counts[s.key] ?? 0}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {!orders?.length ? (
        <EmptyState title="Quiet paws, no orders." />
      ) : (
        <div className={styles.orderList}>
          {orders.map(order => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderLeft}>
                <div className={styles.orderTop}>
                  <span className={styles.orderId}>Order #{order.id}</span>
                  <StatusBadge status={order.status} />
                </div>
                <span className={styles.orderCustomer}>
                  {order.customer_name} · {order.customer_email}
                </span>
                {order.items && (
                  <div className={styles.orderItems}>
                    {order.items.map(i => (
                      <span key={i.id} className={styles.orderItem}>
                        {i.quantity}× {i.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className={styles.orderRight}>
                <span className={styles.orderTotal}>${parseFloat(order.total).toFixed(2)}</span>
                <select
                  className={styles.statusSelect}
                  value={order.status}
                  aria-label="Update order status"
                  onChange={e => update.mutate({ id: order.id, status: e.target.value })}
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>
                      {s === 'in_progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function MenuManagement({ onEdit }: { onEdit: (item: MenuItem) => void }) {
  const qc = useQueryClient();
  const { data: items, isLoading } = useQuery({
    queryKey: ['admin', 'menu'],
    queryFn: api.admin.menuList,
  });

  const archive = useMutation({
    mutationFn: ({ id, val }: { id: number; val: boolean }) =>
      api.admin.menuUpdate(id, { is_available: val }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'menu'] }),
  });

  if (isLoading) return <p className={styles.loading}>Loading menu...</p>;

  return (
    <div className={styles.menuGrid}>
      {items?.map(item => (
        <div key={item.id} className={`${styles.menuCard} ${!item.is_available ? styles.menuCardArchived : ''}`}>
          <div className={styles.menuCardHead}>
            <div>
              <span className={styles.menuCardCat}>{item.category_name}</span>
              <span className={styles.menuCardName}>{item.name}</span>
            </div>
            <span className={styles.menuCardPrice}>${parseFloat(item.base_price).toFixed(2)}</span>
          </div>

          <div className={styles.menuCardBadges}>
            {item.is_bestseller && <StatusBadge status="bestseller" />}
            {item.is_seasonal   && <StatusBadge status="seasonal" />}
            {!item.is_available && <span className={styles.archivedTag}>Archived</span>}
          </div>

          <div className={styles.menuCardActions}>
            <button className={styles.editBtn} onClick={() => onEdit(item)}>Edit</button>
            <button
              className={styles.archiveBtn}
              onClick={() => archive.mutate({ id: item.id, val: !item.is_available })}
            >
              {item.is_available ? 'Archive' : 'Restore'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ItemForm({ item, onClose }: { item: MenuItem | null; onClose: () => void }) {
  const qc = useQueryClient();
  const [name,         setName]         = useState(item?.name ?? '');
  const [desc,         setDesc]         = useState(item?.description ?? '');
  const [price,        setPrice]        = useState(item?.base_price ?? '');
  const [categoryId,   setCategoryId]   = useState(item?.category_id ?? 1);
  const [isSeasonal,   setIsSeasonal]   = useState(item?.is_seasonal ?? false);
  const [isBestseller, setIsBestseller] = useState(item?.is_bestseller ?? false);

  const save = useMutation({
    mutationFn: () => {
      const data = { name, description: desc, base_price: price, category_id: categoryId, is_seasonal: isSeasonal, is_bestseller: isBestseller };
      return item ? api.admin.menuUpdate(item.id, data) : api.admin.menuCreate(data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'menu'] });
      qc.invalidateQueries({ queryKey: ['menu'] });
      onClose();
    },
  });

  return (
    <div
      className={styles.overlay}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={item ? 'Edit drink' : 'Add drink'}
    >
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>{item ? 'Edit drink' : 'New drink'}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form
          className={styles.modalForm}
          onSubmit={e => { e.preventDefault(); save.mutate(); }}
        >
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Name</label>
            <input className={styles.fieldInput} value={name} onChange={e => setName(e.target.value)} required />
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>Description</label>
            <textarea className={styles.fieldTextarea} value={desc} onChange={e => setDesc(e.target.value)} rows={3} />
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Price ($)</label>
              <input className={styles.fieldInput} type="number" step="0.01" min="0" value={price} onChange={e => setPrice(e.target.value)} required />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>Category</label>
              <select className={styles.fieldSelect} value={categoryId} onChange={e => setCategoryId(Number(e.target.value))}>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div className={styles.checks}>
            <label className={styles.checkLabel}>
              <input type="checkbox" checked={isSeasonal}   onChange={e => setIsSeasonal(e.target.checked)} />
              Seasonal
            </label>
            <label className={styles.checkLabel}>
              <input type="checkbox" checked={isBestseller} onChange={e => setIsBestseller(e.target.checked)} />
              Bestseller
            </label>
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.saveBtn} disabled={save.isPending}>
              {save.isPending ? 'Saving...' : 'Save drink'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
