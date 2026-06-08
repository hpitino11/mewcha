import { Link } from 'react-router-dom';
import styles from './MenuPreview.module.css';

const MENU_ITEMS = [
  { cat: 'matcha',  name: 'Ceremonial Matcha Latte',   price: '$6.50' },
  { cat: 'matcha',  name: 'Brown Sugar Matcha',         price: '$6.75' },
  { cat: 'hojicha', name: 'Hojicha Milk Tea',           price: '$5.75' },
  { cat: 'boba',    name: 'Taro Milk Tea',              price: '$6.25' },
  { cat: 'boba',    name: 'Lychee Green Tea',           price: '$5.50' },
  { cat: 'coffee',  name: 'Oat Milk Cold Brew',         price: '$5.25' },
];

export default function MenuPreview() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.heading}>
          <div className={styles.sectionLabel}>
            <span className={styles.num}>04</span>
            <span>/</span>
            <span className={styles.label}>menu</span>
          </div>
          <h2 className={styles.title}>
            Take a quiet look<br /><em>at the menu.</em>
          </h2>
        </div>

        <div className={styles.cards}>
          {/* Physical menu card */}
          <div className={styles.menuCard}>
            <div className={styles.menuCardHeader}>
              <span className={styles.menuCardName}>mewcha</span>
              <span className={styles.menuCardSub}>neko café · portland, or</span>
            </div>

            <div className={styles.menuDivider} />

            <div className={styles.menuRows}>
              {MENU_ITEMS.map((item, i) => (
                <div key={i} className={styles.menuRow}>
                  <span className={styles.menuRowCat}>{item.cat}</span>
                  <span className={styles.menuRowName}>{item.name}</span>
                  <span className={styles.menuRowDots} aria-hidden="true" />
                  <span className={styles.menuRowPrice}>{item.price}</span>
                </div>
              ))}
            </div>

            <div className={styles.menuDivider} />
            <div className={styles.menuCardFooter}>
              <span>all drinks made to order</span>
              <span>customise size · ice · sweetness · toppings</span>
            </div>
          </div>

          {/* Receipt card */}
          <div className={styles.receiptCard}>
            <div className={styles.receiptHeader}>
              <span className={styles.receiptTitle}>order</span>
              <div className={styles.receiptHeaderRight}>
                <span className={styles.receiptOrderNum}>#0042</span>
                <span className={styles.receiptDate}>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            </div>

            <div className={styles.receiptDivider}>- - - - - - - - - - - - - -</div>

            <div className={styles.receiptRows}>
              <div className={styles.receiptRow}>
                <span>Ceremonial Matcha</span>
                <span>$6.50</span>
              </div>
              <div className={styles.receiptRow}>
                <span className={styles.receiptSub}>medium · 50% sweet · boba</span>
              </div>
              <div className={styles.receiptRow}>
                <span>Taro Milk Tea</span>
                <span>$6.25</span>
              </div>
              <div className={styles.receiptRow}>
                <span className={styles.receiptSub}>large · light ice · lychee jelly</span>
              </div>
            </div>

            <div className={styles.receiptDivider}>- - - - - - - - - - - - - -</div>

            <div className={styles.receiptSubRows}>
              <div className={styles.receiptSubRow}>
                <span>subtotal</span>
                <span>$12.75</span>
              </div>
              <div className={styles.receiptSubRow}>
                <span>tax (8.5%)</span>
                <span>$1.08</span>
              </div>
            </div>

            <div className={styles.receiptTotal}>
              <span>total</span>
              <span>$13.83</span>
            </div>

            <div className={styles.receiptDivider}>- - - - - - - - - - - - - -</div>

            <div className={styles.receiptThanks}>
              thank you for your ritual today
            </div>

            <div className={styles.receiptStamp}>
              <span className={styles.receiptStampInner}>neko<br />approved</span>
            </div>
          </div>
        </div>

        <Link to="/menu" className={styles.cta}>
          Build your ritual →
        </Link>
      </div>
    </section>
  );
}
