import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EditorialKicker from './shared/EditorialKicker';
import styles from './MenuPreview.module.css';

const CATEGORIES = [
  {
    slug: 'matcha',
    label: 'Matcha',
    items: [
      { name: 'Ceremonial Matcha', desc: 'Single-ingredient, whisked with water',  price: '$6.00', tags: ['neko pick'] },
      { name: 'Matcha Latte',      desc: 'Stone-ground matcha, oat milk, vanilla', price: '$6.50' },
    ],
  },
  {
    slug: 'boba',
    label: 'Milk Tea & Boba',
    items: [
      { name: 'Classic Milk Tea',     desc: 'Black tea, whole milk, lightly sweet',      price: '$5.75' },
      { name: 'Taro Milk Tea',        desc: 'Taro root, whole milk, black tea',           price: '$6.75' },
      { name: 'Brown Sugar Milk Tea', desc: 'House brown sugar syrup, tapioca pearls',    price: '$6.75' },
      { name: 'Honeydew Milk Tea',    desc: 'Fresh honeydew, creamy milk tea base',       price: '$6.50' },
      { name: 'Thai Milk Tea',        desc: 'Spiced Thai tea, sweetened condensed milk',  price: '$6.50' },
    ],
  },
  {
    slug: 'fruit',
    label: 'Fruit Teas',
    items: [
      { name: 'Strawberry Milk Tea', desc: 'Fresh strawberry, black tea, cream', price: '$6.25' },
      { name: 'Lychee Milk Tea',     desc: 'Floral lychee, green tea, light cream', price: '$6.25' },
      { name: 'Mango Milk Tea',      desc: 'Ripe mango, smooth milk tea base',   price: '$6.25' },
    ],
  },
  {
    slug: 'coffee',
    label: 'Coffee',
    items: [
      { name: 'Iced Americano', desc: 'Double espresso, cold water, ice', price: '$5.00' },
    ],
  },
];

const TOPPINGS = [
  { name: 'Tapioca Pearls',  price: '+$0.75' },
  { name: 'Lychee Jelly',    price: '+$0.75' },
  { name: 'Grass Jelly',     price: '+$0.75' },
  { name: 'Coconut Jelly',   price: '+$0.75' },
  { name: 'Pudding',         price: '+$0.75' },
  { name: 'Aloe Vera',       price: '+$0.75' },
];

const SIZES    = ['Small', 'Medium  +$0.50', 'Large  +$1.00'];
const ICE      = ['None', 'Light', 'Regular', 'Extra'];
const SWEETNESS = ['0%', '25%', '50%', '75%', '100%'];

export default function MenuPreview() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-visible');
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('is-visible'); observer.disconnect(); } },
      { threshold: 0.06 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className={`${styles.section} reveal-section`}>
      <div className={styles.inner}>

        <div className={styles.head}>
          <EditorialKicker number="03" label="menu" className={styles.kickerLight} />
          <h2 className={styles.title}>
            Take a quiet look at the menu.
          </h2>
          <p className={styles.sub}>All drinks made to order. Every size, ice level, and sweetness your way.</p>
        </div>

        {/* Menu container — catGrid + addons unified */}
        <div className={styles.menuContainer}>

        {/* Category grid */}
        <div className={styles.catGrid}>
          {CATEGORIES.map(cat => (
            <div key={cat.slug} className={styles.catCol}>
              <div className={styles.catLabel}>{cat.label}</div>
              <div className={styles.catDivider} />
              <div className={styles.catItems}>
                {cat.items.map(item => (
                  <div key={item.name} className={styles.item}>
                    <div className={styles.itemTop}>
                      <span className={styles.itemName}>{item.name}</span>
                      <span className={styles.itemDots} aria-hidden="true" />
                      <span className={styles.itemPrice}>{item.price}</span>
                    </div>
                    <div className={styles.itemBottom}>
                      <span className={styles.itemDesc}>{item.desc}</span>
                      {item.tags?.map(t => (
                        <span key={t} className={styles.itemTag}>{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Addons panel */}
        <div className={styles.addons}>
          <div className={styles.addonsRow}>
            <span className={styles.addonsLabel}>toppings</span>
            <div className={styles.addonsPills}>
              {TOPPINGS.map(t => (
                <span key={t.name} className={styles.addonPill}>
                  {t.name} <span className={styles.addonPrice}>{t.price}</span>
                </span>
              ))}
            </div>
          </div>
          <div className={styles.addonsDivider} />
          <div className={styles.addonsRow}>
            <span className={styles.addonsLabel}>size</span>
            <div className={styles.addonsPills}>
              {SIZES.map(s => (
                <span key={s} className={styles.addonPill}>{s}</span>
              ))}
            </div>
          </div>
          <div className={styles.addonsDivider} />
          <div className={styles.addonsRow}>
            <span className={styles.addonsLabel}>ice</span>
            <div className={styles.addonsPills}>
              {ICE.map(s => (
                <span key={s} className={styles.addonPill}>{s}</span>
              ))}
            </div>
          </div>
          <div className={styles.addonsDivider} />
          <div className={styles.addonsRow}>
            <span className={styles.addonsLabel}>sweetness</span>
            <div className={styles.addonsPills}>
              {SWEETNESS.map(s => (
                <span key={s} className={styles.addonPill}>{s}</span>
              ))}
            </div>
          </div>
        </div>

        </div>{/* /menuContainer */}

        <Link to="/menu" className={styles.cta}>
          Build your ritual →
        </Link>

      </div>
    </section>
  );
}
