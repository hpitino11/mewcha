import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EditorialKicker from './shared/EditorialKicker';
import styles from './MenuPreview.module.css';

const CATEGORIES = [
  {
    slug: 'matcha',
    label: 'Matcha',
    items: [
      { name: 'Ceremonial Matcha Latte', desc: 'Uji ceremonial grade, oat milk', price: '$6.50', tags: ['bestseller'] },
      { name: 'Brown Sugar Matcha',       desc: 'Brown sugar syrup, oat foam',    price: '$6.75' },
      { name: 'Iced Matcha',              desc: 'Straight ceremonial over ice',   price: '$5.75' },
    ],
  },
  {
    slug: 'boba',
    label: 'Milk Tea & Boba',
    items: [
      { name: 'Classic Milk Tea',   desc: 'Black tea, oat milk, your choice of boba',  price: '$5.75' },
      { name: 'Taro Milk Tea',      desc: 'Taro root, oat milk, chewy pearls',         price: '$6.50', tags: ['seasonal'] },
      { name: 'Brown Sugar Boba',   desc: 'Caramelized brown sugar, tapioca, oat foam', price: '$6.75', tags: ['house pick'] },
      { name: 'Honeydew Milk Tea',  desc: 'Fresh honeydew, oat milk, lychee jelly',    price: '$6.25' },
    ],
  },
  {
    slug: 'fruit',
    label: 'Fruit Teas',
    items: [
      { name: 'Strawberry Milk Tea', desc: 'Strawberry, green tea, oat milk',       price: '$6.25' },
      { name: 'Thai Tea',            desc: 'Spiced black tea, condensed oat milk',  price: '$5.75' },
      { name: 'Lychee Green Tea',    desc: 'Light green tea, lychee, basil seeds',  price: '$5.50' },
    ],
  },
  {
    slug: 'coffee',
    label: 'Coffee',
    items: [
      { name: 'Oat Milk Cold Brew', desc: 'Single-origin, 18-hr cold steep',       price: '$5.50' },
      { name: 'Matcha Cold Brew',   desc: 'Cold brew layered over ceremonial matcha', price: '$6.50' },
      { name: 'Dirty Oat Latte',    desc: 'Double shot, steamed oat milk',          price: '$5.75' },
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
