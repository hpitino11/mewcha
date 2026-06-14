const router = require('express').Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let query = db('menu_items')
      .join('categories', 'menu_items.category_id', 'categories.id')
      .where('menu_items.is_available', true)
      .select(
        'menu_items.*',
        'categories.name as category_name',
        'categories.slug as category_slug'
      )
      .orderBy('categories.display_order')
      .orderBy('menu_items.name');

    if (category && category !== 'all') {
      query = query.where('categories.slug', category);
    }

    const items = await query;
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await db('menu_items')
      .join('categories', 'menu_items.category_id', 'categories.id')
      .where('menu_items.id', req.params.id)
      .select('menu_items.*', 'categories.name as category_name', 'categories.slug as category_slug')
      .first();

    if (!item) return res.status(404).json({ error: 'Item not found' });

    const optionGroups = await db('item_option_groups')
      .join('option_groups', 'item_option_groups.option_group_id', 'option_groups.id')
      .where('item_option_groups.item_id', item.id)
      .select('option_groups.*');

    for (const group of optionGroups) {
      group.options = await db('options').where({ group_id: group.id });
    }

    res.json({ ...item, option_groups: optionGroups });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
