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
          <div className={styles.heroPills}>
            <span>earthy</span>
            <span>creamy</span>
            <span>bright</span>
            <span>bold</span>
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
      <div className={styles.cardImgWrap}>
        <div className={styles.skel} style={{ width: '60%', height: '100%', borderRadius: 4 }} />
      </div>
      <div className={styles.cardBody}>
        <div className={styles.skel} style={{ width: 56, height: 9, borderRadius: 2, marginBottom: 10 }} />
        <div className={styles.skel} style={{ width: '75%', height: 20, borderRadius: 3, marginBottom: 6 }} />
        <div className={styles.skel} style={{ width: '95%', height: 10, borderRadius: 3, marginBottom: 4 }} />
        <div className={styles.skel} style={{ width: '70%', height: 10, borderRadius: 3 }} />
      </div>
    </div>
  );
}
