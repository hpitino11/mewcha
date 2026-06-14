import { useState, useEffect, useId, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useCart } from '../context/CartContext';
import RitualCupPreview from './RitualCupPreview';
import EditorialKicker from './shared/EditorialKicker';
import PawStamp from './shared/PawStamp';
import type { Option, CartCustomizations } from '../types';
import styles from './DrinkModal.module.css';

interface Props {
  itemId: number;
  onClose: () => void;
}

export default function DrinkModal({ itemId, onClose }: Props) {
  const { addItem } = useCart();
  const uid = useId();

  const { data: item, isLoading } = useQuery({
    queryKey: ['menu', String(itemId)],
    queryFn: () => api.menu.get(itemId),
  });

  const [selectedSize,      setSelectedSize]      = useState<Option | null>(null);
  const [selectedIce,       setSelectedIce]       = useState<Option | null>(null);
  const [selectedSweetness, setSelectedSweetness] = useState<Option | null>(null);
  const [selectedToppings,  setSelectedToppings]  = useState<Option[]>([]);
  const [added,             setAdded]             = useState(false);

  useEffect(() => {
    if (!item) return;
    setSelectedSize(null);
    setSelectedIce(null);
    setSelectedSweetness(null);
    setSelectedToppings([]);
    for (const group of item.option_groups) {
      if (group.type === 'size')      setSelectedSize(group.options[1] ?? null);
      if (group.type === 'ice')       setSelectedIce(group.options[2] ?? null);
      if (group.type === 'sweetness') setSelectedSweetness(group.options[4] ?? null);
    }
  }, [item]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  const toppingCost = selectedToppings.reduce((s, t) => s + parseFloat(t.price_modifier), 0);
  const sizeCost    = selectedSize ? parseFloat(selectedSize.price_modifier) : 0;
  const total       = item ? parseFloat(item.base_price) + sizeCost + toppingCost : 0;

  const toggleTopping = (opt: Option) =>
    setSelectedToppings(prev =>
      prev.find(t => t.id === opt.id) ? prev.filter(t => t.id !== opt.id) : [...prev, opt]
    );

  const handleAdd = () => {
    if (!item) return;
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

  const isCoffee = item?.category_slug === 'coffee';

  return createPortal(
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
      aria-label={item?.name ?? 'Drink detail'}
    >
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
          </svg>
        </button>

        {isLoading ? (
          <div className={styles.loading}>Loading your ritual...</div>
        ) : item ? (
          <div className={styles.body}>
            {/* Left: info + cup */}
            <div className={styles.left}>
              <div className={styles.drinkInfo}>
                <div className={styles.infoTop}>
                  <EditorialKicker label={item.category_name} className={styles.kicker} />
                  <div className={styles.badges}>
                    {item.is_bestseller && (
                      <span className={styles.badge}>
                        <PawStamp size={9} color="white" /> Neko Pick
                      </span>
                    )}
                    {item.is_seasonal && (
                      <span className={`${styles.badge} ${styles.badgeSeasonal}`}>Seasonal</span>
                    )}
                  </div>
                </div>
                <h2 className={styles.drinkName}>{item.name}</h2>
                <p className={styles.drinkDesc}>{item.description}</p>
              </div>

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

              {ritualParts && (
                <p className={styles.ritualSummary}>
                  <em>your ritual:</em> {ritualParts}
                </p>
              )}
            </div>

            {/* Right: customizer */}
            <div className={styles.right}>
              <div className={styles.custHeader}>
                <h3 className={styles.custTitle}>Build your ritual</h3>
                <span className={styles.custPrice}>${total.toFixed(2)}</span>
              </div>

              <div className={styles.groups}>
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
                            : group.type === 'size'       ? selectedSize?.id       === opt.id
                            : group.type === 'ice'        ? selectedIce?.id        === opt.id
                            : selectedSweetness?.id === opt.id;

                        return (
                          <button
                            key={opt.id}
                            type="button"
                            aria-pressed={isActive}
                            className={`${styles.optBtn} ${isActive ? styles.optBtnActive : ''}`}
                            onClick={() => {
                              if (group.type === 'size')           setSelectedSize(opt);
                              else if (group.type === 'ice')       setSelectedIce(opt);
                              else if (group.type === 'sweetness') setSelectedSweetness(opt);
                              else toggleTopping(opt);
                            }}
                          >
                            {opt.label}
                            {parseFloat(opt.price_modifier) > 0 && (
                              <span className={styles.optPrice}>
                                +${parseFloat(opt.price_modifier).toFixed(2)}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </fieldset>
                ))}
              </div>

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
        ) : null}
      </div>
    </div>,
    document.body
  );
}
