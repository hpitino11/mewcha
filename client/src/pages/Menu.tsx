import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { MenuItem } from '../types';
import EditorialKicker from '../components/shared/EditorialKicker';
import PawStamp from '../components/shared/PawStamp';
import EmptyState from '../components/shared/EmptyState';
import styles from './Menu.module.css';

const TABS = [
  { label: 'All',      slug: 'all' },
  { label: 'Matcha',   slug: 'matcha' },
  { label: 'Boba',     slug: 'boba' },
  { label: 'Coffee',   slug: 'coffee' },
  { label: 'Seasonal', slug: 'seasonal' },
];

export default function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [active, setActive] = useState(searchParams.get('category') || 'all');

  const { data: items, isLoading } = useQuery({
    queryKey: ['menu', active],
    queryFn: () => api.menu.list(active),
  });

  useEffect(() => {
    const c = searchParams.get('category');
    if (c) setActive(c);
  }, [searchParams]);

  const handleTab = (slug: string) => {
    setActive(slug);
    slug === 'all' ? setSearchParams({}) : setSearchParams({ category: slug });
  };

  const featured = items?.filter(i => i.is_seasonal || i.is_bestseller).slice(0, 1)[0];
  const regular  = items?.filter(i => i !== featured) ?? [];

  return (
    <main className={styles.page}>

      {/* ── Header ── */}
      <div className={styles.header}>
        <EditorialKicker label="the menu" />
        <h1 className={styles.title}>Every cup,<br /><em>yours.</em></h1>
        <p className={styles.subtitle}>earthy · creamy · bright · bold</p>
      </div>

      {/* ── Category tabs ── */}
      <div className={styles.tabsWrap}>
        <div className={styles.tabs} role="tablist" aria-label="Menu categories">
          {TABS.map(tab => (
            <button
              key={tab.slug}
              role="tab"
              aria-selected={active === tab.slug}
              className={`${styles.tab} ${active === tab.slug ? styles.tabActive : ''}`}
              onClick={() => handleTab(tab.slug)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} index={i} />)}
        </div>
      ) : items?.length === 0 ? (
        <EmptyState
          title="Nothing here yet."
          body="No drinks in this category at the moment."
          action={{ label: 'See all drinks', to: '/menu' }}
        />
      ) : (
        <>
          {/* Featured spotlight */}
          {featured && active === 'all' && (
            <Link to={`/menu/${featured.id}`} className={styles.spotlight}>
              <div className={styles.spotlightText}>
                <EditorialKicker
                  label={featured.is_seasonal ? 'seasonal pick' : 'neko pick'}
                />
                <h2 className={styles.spotlightName}>{featured.name}</h2>
                <p className={styles.spotlightDesc}>{featured.description}</p>
                <div className={styles.spotlightMeta}>
                  <span className={styles.spotlightPrice}>
                    from ${parseFloat(featured.base_price).toFixed(2)}
                  </span>
                  <span className={styles.spotlightCta}>
                    <PawStamp size={12} color="var(--color-accent)" />
                    Customize
                  </span>
                </div>
              </div>
              <div className={styles.spotlightBadge}>
                {featured.is_seasonal ? 'Seasonal' : 'Bestseller'}
              </div>
            </Link>
          )}

          {/* Main grid */}
          <div className={styles.grid}>
            {(featured && active === 'all' ? regular : items ?? []).map((item, i) => (
              <MenuCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}

function MenuCard({ item, index }: { item: MenuItem; index: number }) {
  const num = String(index + 1).padStart(2, '0');
  return (
    <Link to={`/menu/${item.id}`} className={styles.card}>
      <div className={styles.cardTop}>
        <span className={styles.cardNum}>{num}</span>
        <span className={styles.cardCat}>{item.category_name}</span>
      </div>

      <h2 className={styles.cardName}>{item.name}</h2>
      <p className={styles.cardDesc}>{item.description}</p>

      <div className={styles.cardBottom}>
        <span className={styles.cardPrice}>from ${parseFloat(item.base_price).toFixed(2)}</span>
        <div className={styles.cardBadges}>
          {item.is_bestseller && <span className={styles.badgeBest}>★</span>}
          {item.is_seasonal   && <span className={styles.badgeSeasonal}>Seasonal</span>}
        </div>
      </div>

      <div className={styles.cardHover} aria-hidden="true">
        <PawStamp size={14} color="var(--color-accent)" />
        <span>customize →</span>
      </div>
    </Link>
  );
}

function SkeletonCard({ index: _index }: { index: number }) {
  return (
    <div className={styles.card} style={{ pointerEvents: 'none' }}>
      <div className={styles.cardTop}>
        <div className={styles.skel} style={{ width: 24, height: 10, borderRadius: 2 }} />
        <div className={styles.skel} style={{ width: 48, height: 10, borderRadius: 2 }} />
      </div>
      <div className={styles.skel} style={{ height: 20, width: '65%', borderRadius: 3, margin: '0.75rem 0 0.375rem' }} />
      <div className={styles.skel} style={{ height: 12, width: '90%', borderRadius: 3, marginBottom: 4 }} />
      <div className={styles.skel} style={{ height: 12, width: '70%', borderRadius: 3 }} />
    </div>
  );
}
