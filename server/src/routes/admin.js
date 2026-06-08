const router = require('express').Router();
const db = require('../db');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.use(authenticate, requireAdmin);

router.get('/menu', async (req, res) => {
  try {
    const items = await db('menu_items')
      .join('categories', 'menu_items.category_id', 'categories.id')
      .select('menu_items.*', 'categories.name as category_name', 'categories.slug as category_slug')
      .orderBy('categories.display_order')
      .orderBy('menu_items.name');
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/menu', async (req, res) => {
  const { category_id, name, description, base_price, image_url, is_seasonal, is_bestseller } = req.body;
  if (!name || !base_price || !category_id) return res.status(400).json({ error: 'name, base_price, category_id required' });

  try {
    const [item] = await db('menu_items')
      .insert({ category_id, name, description, base_price, image_url, is_seasonal: !!is_seasonal, is_bestseller: !!is_bestseller })
      .returning('*');

    await db('item_option_groups').insert(
      [1, 2, 3, 4].map((og) => ({ item_id: item.id, option_group_id: og }))
    );
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.patch('/menu/:id', async (req, res) => {
  const allowed = ['name', 'description', 'base_price', 'image_url', 'is_available', 'is_seasonal', 'is_bestseller', 'category_id'];
  const updates = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));

  try {
    const [item] = await db('menu_items').where({ id: req.params.id }).update(updates).returning('*');
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/orders', async (req, res) => {
  try {
    const orders = await db('orders')
      .join('users', 'orders.user_id', 'users.id')
      .select('orders.*', 'users.name as customer_name', 'users.email as customer_email')
      .orderBy('orders.created_at', 'desc');

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

router.patch('/orders/:id', async (req, res) => {
  const { status } = req.body;
  const valid = ['pending', 'in_progress', 'ready', 'completed'];
  if (!valid.includes(status)) return res.status(400).json({ error: 'Invalid status' });

  try {
    const [order] = await db('orders').where({ id: req.params.id }).update({ status }).returning('*');
    if (!order) return res.status(404).json({ error: 'Not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
