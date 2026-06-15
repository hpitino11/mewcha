const router = require('express').Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, async (req, res) => {
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0)
    return res.status(400).json({ error: 'Order must have at least one item' });

  if (items.length > 20)
    return res.status(400).json({ error: 'Too many items in a single order' });

  for (const item of items) {
    if (!Number.isInteger(item.item_id) || item.item_id <= 0)
      return res.status(400).json({ error: 'Invalid item_id' });
    if (!Number.isInteger(item.quantity) || item.quantity <= 0 || item.quantity > 50)
      return res.status(400).json({ error: 'Invalid quantity' });
  }

  const trx = await db.transaction();
  try {
    const computedItems = [];

    for (const clientItem of items) {
      // Verify the item exists and is currently available — never trust the client on this
      const menuItem = await trx('menu_items')
        .where({ id: clientItem.item_id, is_available: true })
        .first();

      if (!menuItem) {
        await trx.rollback();
        return res.status(400).json({ error: `Item ${clientItem.item_id} is not available` });
      }

      // Collect selected option IDs from customizations
      const customizations = clientItem.customizations ?? {};
      const selectedOptionIds = [];

      if (customizations.size?.id)        selectedOptionIds.push(Number(customizations.size.id));
      if (customizations.ice?.id)         selectedOptionIds.push(Number(customizations.ice.id));
      if (customizations.sweetness?.id)   selectedOptionIds.push(Number(customizations.sweetness.id));
      if (Array.isArray(customizations.toppings)) {
        for (const t of customizations.toppings) {
          if (t?.id) selectedOptionIds.push(Number(t.id));
        }
      }

      // Verify every selected option actually belongs to this item's option groups,
      // then read the real price_modifier from the DB — never trust the client's value.
      let priceModifier = 0;
      if (selectedOptionIds.length > 0) {
        const validOptions = await trx('options')
          .join('option_groups', 'options.group_id', 'option_groups.id')
          .join('item_option_groups', 'option_groups.id', 'item_option_groups.option_group_id')
          .where('item_option_groups.item_id', clientItem.item_id)
          .whereIn('options.id', selectedOptionIds)
          .select('options.id', 'options.price_modifier');

        if (validOptions.length !== selectedOptionIds.length) {
          await trx.rollback();
          return res.status(400).json({ error: 'Invalid customization options' });
        }

        priceModifier = validOptions.reduce((sum, opt) => sum + parseFloat(opt.price_modifier), 0);
      }

      // Calculate price entirely on the server — client-submitted subtotal is ignored
      const unitPrice = parseFloat(menuItem.base_price) + priceModifier;
      const subtotal = parseFloat((unitPrice * clientItem.quantity).toFixed(2));

      computedItems.push({
        item_id: clientItem.item_id,
        quantity: clientItem.quantity,
        customizations: clientItem.customizations,
        subtotal,
      });
    }

    const total = parseFloat(
      computedItems.reduce((sum, i) => sum + i.subtotal, 0).toFixed(2)
    );

    const [order] = await trx('orders')
      .insert({ user_id: req.user.id, total })
      .returning('*');

    const orderItems = computedItems.map((i) => ({
      order_id: order.id,
      item_id: i.item_id,
      quantity: i.quantity,
      customizations: JSON.stringify(i.customizations),
      subtotal: i.subtotal,
    }));

    await trx('order_items').insert(orderItems);
    await trx.commit();
    res.status(201).json(order);
  } catch (err) {
    await trx.rollback();
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const orders = await db('orders')
      .where({ user_id: req.user.id })
      .orderBy('created_at', 'desc');

    for (const order of orders) {
      order.items = await db('order_items')
        .join('menu_items', 'order_items.item_id', 'menu_items.id')
        .where({ order_id: order.id })
        .select('order_items.*', 'menu_items.name');
    }

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
