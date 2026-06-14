import { useState, useEffect, useId } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useCart } from '../context/CartContext';
import RitualCupPreview from '../components/RitualCupPreview';
import EditorialKicker from '../components/shared/EditorialKicker';
import PawStamp from '../components/shared/PawStamp';
import type { Option, CartCustomizations } from '../types';
import styles from './DrinkDetail.module.css';

export default function DrinkDetail() {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const uid = useId();

  const { data: item, isLoading, isError } = useQuery({
    queryKey: ['menu', id],
    queryFn: () => api.menu.get(Number(id)),
  });

  const [selectedSize,      setSelectedSize]      = useState<Option | null>(null);
  const [selectedIce,       setSelectedIce]       = useState<Option | null>(null);
  const [selectedSweetness, setSelectedSweetness] = useState<Option | null>(null);
  const [selectedToppings,  setSelectedToppings]  = useState<Option[]>([]);
  const [added,             setAdded]             = useState(false);

  useEffect(() => {
    if (!item) return;
    for (const group of item.option_groups) {
      if (group.type === 'size')      setSelectedSize(group.options[1] ?? null);   // medium default
      if (group.type === 'ice')       setSelectedIce(group.options[2] ?? null);    // regular default
      if (group.type === 'sweetness') setSelectedSweetness(group.options[4] ?? null); // 100% default
    }
  }, [item]);

  if (isLoading) {
    return (
      <div className={styles.state}>
        <div className={styles.stateInner}>Loading your ritual...</div>
      </div>
    );
  }

  if (isError || !item) {
    return (
      <div className={styles.state}>
        <div className={styles.stateInner}>
          Drink not found. <Link to="/menu">Back to menu →</Link>
        </div>
      </div>
    );
  }

  const toppingCost = selectedToppings.reduce((s, t) => s + parseFloat(t.price_modifier), 0);
  const sizeCost    = selectedSize ? parseFloat(selectedSize.price_modifier) : 0;
  const total       = parseFloat(item.base_price) + sizeCost + toppingCost;

  const toggleTopping = (opt: Option) =>
    setSelectedToppings(prev =>
      prev.find(t => t.id === opt.id) ? prev.filter(t => t.id !== opt.id) : [...prev, opt]
    );

  const handleAdd = () => {
    const customizations: CartCustomizations = {
      size:      selectedSize      ?? undefined,
      ice:       selectedIce       ?? undefined,
      sweetness: selectedSweetness ?? undefined,
      toppings:  selectedToppings,
    };
    addItem(item, 1, customizations, total);
    setAdded(true);
    setTimeout(() => setAdded(false), 2800);
  };

  const ritualParts = [
    selectedSize?.label.split(' ')[0].toLowerCase(),
    selectedIce?.label.toLowerCase(),
    selectedSweetness?.label.toLowerCase(),
    ...selectedToppings.map(t => t.label.toLowerCase()),
  ].filter(Boolean).join(' · ');

  const isCoffee = item.category_slug === 'coffee';

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
      <Link to="/menu" className={styles.back}>← back to menu</Link>

      <div className={styles.layout}>
        {/* ── Left: info + cup preview ── */}
        <div className={styles.left}>
          <div className={styles.drinkMeta}>
            <EditorialKicker label={item.category_name} className={styles.kicker} />
            <div className={styles.drinkBadges}>
              {item.is_bestseller && (
                <span className={styles.badge}>
                  <PawStamp size={10} color="white" /> Bestseller
                </span>
              )}
              {item.is_seasonal && (
                <span className={`${styles.badge} ${styles.badgeSeasonal}`}>Seasonal</span>
              )}
            </div>
          </div>

          <h1 className={styles.drinkName}>{item.name}</h1>
          <p className={styles.drinkDesc}>{item.description}</p>

          {/* Cup preview */}
          <div className={styles.cupWrap}>
            <RitualCupPreview
              categorySlug={item.category_slug}
              itemName={item.name}
              size={selectedSize}
              ice={selectedIce}
              sweetness={selectedSweetness}
              toppings={selectedToppings}
              isSeasonal={item.is_seasonal}
              isCoffee={isCoffee}
            />
          </div>

          {/* Ritual summary line */}
          {ritualParts && (
            <p className={styles.ritualSummary}>
              <em>your ritual:</em> {ritualParts}
            </p>
          )}
        </div>

        {/* ── Right: customizer ── */}
        <div className={styles.right}>
          <div className={styles.customizer}>
            <div className={styles.custHeader}>
              <h2 className={styles.custTitle}>Build your ritual</h2>
              <span className={styles.custPrice}>${total.toFixed(2)}</span>
            </div>

            {item.option_groups.map(group => (
              <fieldset key={group.id} className={styles.group}>
                <legend className={styles.groupLabel}>{group.name}</legend>
                <div
                  className={`${styles.options} ${group.type === 'toppings' ? styles.optionsWrap : ''}`}
                  role="group"
                  aria-labelledby={`${uid}-${group.id}`}
                >
                  {group.options.map(opt => {
                    const isActive =
                      group.type === 'toppings'
                        ? selectedToppings.some(t => t.id === opt.id)
                        : group.type === 'size'       ? selectedSize?.id      === opt.id
                        : group.type === 'ice'        ? selectedIce?.id       === opt.id
                        : selectedSweetness?.id === opt.id;

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        aria-pressed={isActive}
                        className={`${styles.optBtn} ${isActive ? styles.optBtnActive : ''}`}
                        onClick={() => {
                          if (group.type === 'size')       setSelectedSize(opt);
                          else if (group.type === 'ice')   setSelectedIce(opt);
                          else if (group.type === 'sweetness') setSelectedSweetness(opt);
                          else toggleTopping(opt);
                        }}
                      >
                        {opt.label}
                        {parseFloat(opt.price_modifier) > 0 && (
                          <span className={styles.optPrice}>+${parseFloat(opt.price_modifier).toFixed(2)}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}

            <button
              type="button"
              className={`${styles.addBtn} ${added ? styles.addBtnDone : ''}`}
              onClick={handleAdd}
              disabled={added}
              aria-live="polite"
            >
              {added ? (
                <>
                  <PawStamp size={14} color="var(--color-accent-cream)" />
                  Added to your ritual
                </>
              ) : (
                <>add to ritual · ${total.toFixed(2)}</>
              )}
            </button>
          </div>
        </div>
      </div>
      </div>
    </main>
  );
}
