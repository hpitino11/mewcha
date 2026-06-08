const router = require('express').Router();
const db = require('../db');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, async (req, res) => {
  const { items } = req.body;
  if (!items?.length) return res.status(400).json({ error: 'Order must have at least one item' });

  const trx = await db.transaction();
  try {
    const total = items.reduce((sum, i) => sum + i.subtotal * i.quantity, 0);
    const [order] = await trx('orders')
      .insert({ user_id: req.user.id, total: total.toFixed(2) })
      .returning('*');

    const orderItems = items.map((i) => ({
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
