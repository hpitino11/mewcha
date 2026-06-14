import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { MenuItem } from '../types';
import EditorialKicker from '../components/shared/EditorialKicker';
import styles from './Menu.module.css';

const TABS = [
  { label: 'All',    slug: 'all' },
  { label: 'Matcha', slug: 'matcha' },
  { label: 'Boba',   slug: 'boba' },
  { label: 'Coffee', slug: 'coffee' },
];

const IMAGE_MAP: Record<string, string> = {
  'Matcha Latte':           '/boba/matcha.png',
  'Brown Sugar Milk Tea':   '/boba/brown_sugar.png',
  'Classic Milk Tea':       '/boba/milk_tea.png',
  'Taro Milk Tea':          '/boba/taro.png',
  'Strawberry Lychee Boba': '/boba/matcha.png',
  'Honeydew Milk Tea':      '/boba/honeydew.png',
  'Thai Milk Tea':          '/boba/thai_tea.png',
  'Iced Americano':         '/boba/coffee.png',
};

const TAGS_MAP: Record<string, string[]> = {
  'Matcha Latte':           ['EARTHY', 'CREAMY', 'CAFFEINE'],
  'Brown Sugar Milk Tea':   ['SWEET', 'CREAMY', 'BOBA'],
  'Classic Milk Tea':       ['CLASSIC', 'SWEET', 'CAFFEINE'],
  'Taro Milk Tea':          ['CREAMY', 'SWEET', 'CAFFEINE'],
  'Strawberry Lychee Boba': ['FRUITY', 'SWEET', 'FLORAL'],
  'Honeydew Milk Tea':      ['FRUITY', 'LIGHT', 'CREAMY'],
  'Thai Milk Tea':          ['BOLD', 'SWEET', 'CAFFEINE'],
  'Iced Americano':         ['BOLD', 'BITTER', 'CAFFEINE'],
};

function getImage(item: MenuItem) {
  return item.image_url || IMAGE_MAP[item.name] || '/boba/shop.png';
}

function getTags(item: MenuItem) {
  return TAGS_MAP[item.name] ?? [];
}

const DESCRIPTORS = [
  {
    label: 'earthy',
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 2C8 2 3 5.5 3 10c0 2.8 2.2 4 5 4s5-1.2 5-4C13 5.5 8 2 8 2Z" fill="currentColor" opacity="0.85"/>
        <path d="M8 14V9" stroke="#faf8f4" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'creamy',
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 2L11.5 9C12.5 11 11.5 14 8 14C4.5 14 3.5 11 4.5 9L8 2Z" fill="currentColor" opacity="0.85"/>
      </svg>
    ),
  },
  {
    label: 'bright',
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="2.8" fill="currentColor"/>
        <path d="M8 1.5V3.5M8 12.5V14.5M1.5 8H3.5M12.5 8H14.5M3.6 3.6L5 5M11 11L12.4 12.4M3.6 12.4L5 11M11 5L12.4 3.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'bold',
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M9.5 2L4 9H8.5L6.5 14L12 7H7.5L9.5 2Z" fill="currentColor" opacity="0.85"/>
      </svg>
    ),
  },
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

  const featured = items?.find(i => i.is_bestseller || i.is_seasonal);
  const regular  = items?.filter(i => i !== featured) ?? [];

  return (
    <main className={styles.page}>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <EditorialKicker label="the menu" />
          <h1 className={styles.heroTitle}>Every cup,<br /><em>yours.</em></h1>
          <p className={styles.heroBody}>
            Thoughtful ingredients. Balanced flavors. Brewed for the way you like it.
          </p>
          <div className={styles.heroDescriptors}>
            {DESCRIPTORS.map(d => (
              <span key={d.label} className={styles.heroDescItem}>
                <span className={styles.heroDescIcon}>{d.icon}</span>
                {d.label}
              </span>
            ))}
          </div>
        </div>

        {featured && active === 'all' ? (
          <Link to={`/menu/${featured.id}`} className={styles.heroSpotlight}>
            <div className={styles.spotlightContent}>
              <div className={styles.spotlightMeta}>
                <EditorialKicker
                  label={featured.is_seasonal ? 'seasonal pick' : 'neko pick'}
                  className={styles.spotlightKicker}
                />
                <span className={styles.spotlightBadge}>
                  {featured.is_seasonal ? 'Seasonal' : 'Bestseller'}
                </span>
              </div>
              <h2 className={styles.spotlightName}>{featured.name}</h2>
              <p className={styles.spotlightDesc}>{featured.description}</p>
              <div className={styles.spotlightFooter}>
                <span className={styles.spotlightPrice}>
                  from ${parseFloat(featured.base_price).toFixed(2)}
                </span>
                <span className={styles.spotlightCta}>Order now</span>
              </div>
            </div>
            <div className={styles.spotlightImgWrap}>
              <img src={getImage(featured)} alt={featured.name} className={styles.spotlightImg} />
            </div>
          </Link>
        ) : (
          <div className={styles.heroSpotlightEmpty} />
        )}
      </section>

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

      {/* ── Grid ── */}
      {isLoading ? (
        <div className={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : items?.length === 0 ? (
        <div className={styles.empty}>
          <p>No drinks in this category yet.</p>
          <button className={styles.emptyLink} onClick={() => handleTab('all')}>
            See all drinks
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {(featured && active === 'all' ? regular : items ?? []).map(item => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </main>
  );
}

function MenuCard({ item }: { item: MenuItem }) {
  const tags = getTags(item);
  return (
    <Link to={`/menu/${item.id}`} className={styles.card}>
      <div className={styles.cardImgWrap}>
        {item.is_bestseller && <span className={styles.cardBadge}>Bestseller</span>}
        {item.is_seasonal   && <span className={styles.cardBadgeSeasonal}>Seasonal</span>}
        <img src={getImage(item)} alt={item.name} className={styles.cardImg} />
      </div>

      <div className={styles.cardBody}>
        <span className={styles.cardCat}>{item.category_name}</span>
        <h2 className={styles.cardName}>{item.name}</h2>
        <p className={styles.cardDesc}>{item.description}</p>

        {tags.length > 0 && (
          <div className={styles.cardTags}>
            {tags.map(t => <span key={t} className={styles.cardTag}>{t}</span>)}
          </div>
        )}

        <div className={styles.cardFooter}>
          <span className={styles.cardPrice}>
            from ${parseFloat(item.base_price).toFixed(2)}
          </span>
          <span className={styles.cardCta}>Add to Order +</span>
        </div>
      </div>
    </Link>
  );
}

function SkeletonCard() {
  return (
    <div className={styles.card} style={{ pointerEvents: 'none' }}>
      <div className={styles.cardImgWrap} />
      <div className={styles.cardBody}>
        <div className={styles.skel} style={{ width: 52, height: 9, borderRadius: 2, marginBottom: 10 }} />
        <div className={styles.skel} style={{ width: '75%', height: 20, borderRadius: 3, marginBottom: 6 }} />
        <div className={styles.skel} style={{ width: '95%', height: 10, borderRadius: 3, marginBottom: 4 }} />
        <div className={styles.skel} style={{ width: '65%', height: 10, borderRadius: 3 }} />
      </div>
    </div>
  );
}
