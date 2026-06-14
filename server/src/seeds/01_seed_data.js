exports.seed = async (knex) => {
  await knex('order_items').del();
  await knex('orders').del();
  await knex('item_option_groups').del();
  await knex('options').del();
  await knex('option_groups').del();
  await knex('menu_items').del();
  await knex('categories').del();

  await knex('categories').insert([
    { id: 1, name: 'Matcha',  slug: 'matcha', display_order: 1 },
    { id: 2, name: 'Boba',    slug: 'boba',   display_order: 2 },
    { id: 3, name: 'Coffee',  slug: 'coffee', display_order: 3 },
  ]);

  await knex('menu_items').insert([
    {
      id: 1,
      category_id: 1,
      name: 'Matcha Latte',
      description: 'Stone-ground matcha whisked to a gentle foam, served over oat milk with a hint of vanilla.',
      base_price: 6.50,
      is_available: true,
      is_seasonal: false,
      is_bestseller: false,
    },
    {
      id: 2,
      category_id: 2,
      name: 'Brown Sugar Milk Tea',
      description: 'Silky black milk tea layered with house-made brown sugar syrup and classic tapioca pearls.',
      base_price: 6.75,
      is_available: true,
      is_seasonal: false,
      is_bestseller: false,
    },
    {
      id: 3,
      category_id: 2,
      name: 'Classic Milk Tea',
      description: 'A timeless blend of rich black tea and creamy milk, lightly sweetened and served over ice.',
      base_price: 5.75,
      is_available: true,
      is_seasonal: false,
      is_bestseller: false,
    },
    {
      id: 4,
      category_id: 2,
      name: 'Taro Milk Tea',
      description: 'Creamy taro root blended with whole milk and fragrant black tea. Earthy, sweet, and deeply satisfying.',
      base_price: 6.75,
      is_available: true,
      is_seasonal: false,
      is_bestseller: false,
    },
    {
      id: 6,
      category_id: 2,
      name: 'Honeydew Milk Tea',
      description: 'Fresh honeydew blended with creamy milk tea for a light, melon-forward drink that is cool and subtly sweet.',
      base_price: 6.50,
      is_available: true,
      is_seasonal: false,
      is_bestseller: false,
    },
    {
      id: 7,
      category_id: 2,
      name: 'Thai Milk Tea',
      description: 'Bold spiced Thai tea brewed strong and poured over ice with sweetened condensed milk. Rich and aromatic.',
      base_price: 6.50,
      is_available: true,
      is_seasonal: false,
      is_bestseller: false,
    },
    {
      id: 8,
      category_id: 3,
      name: 'Iced Americano',
      description: 'Double shot of our house espresso pulled over cold water and ice. Clean, bold, unfussy.',
      base_price: 5.00,
      is_available: true,
      is_seasonal: false,
      is_bestseller: false,
    },
    {
      id: 9,
      category_id: 2,
      name: 'Strawberry Milk Tea',
      description: 'Fresh strawberry puree blended into a light black tea base with creamy milk. Sweet, bright, and refreshing.',
      base_price: 6.25,
      is_available: true,
      is_seasonal: false,
      is_bestseller: false,
    },
    {
      id: 10,
      category_id: 2,
      name: 'Lychee Milk Tea',
      description: 'Delicate lychee flavor steeped into green tea with a touch of cream. Floral, light, and subtly sweet.',
      base_price: 6.25,
      is_available: true,
      is_seasonal: false,
      is_bestseller: false,
    },
    {
      id: 11,
      category_id: 2,
      name: 'Mango Milk Tea',
      description: 'Ripe mango blended with smooth milk tea and a hint of cream. Tropical, bright, and naturally sweet.',
      base_price: 6.25,
      is_available: true,
      is_seasonal: false,
      is_bestseller: false,
    },
    {
      id: 12,
      category_id: 1,
      name: 'Ceremonial Matcha',
      description: 'Single-ingredient ceremonial-grade matcha whisked with cold water. Nothing added, nothing taken away.',
      base_price: 6.00,
      is_available: true,
      is_seasonal: false,
      is_bestseller: true,
    },
  ]);

  await knex('option_groups').insert([
    { id: 1, name: 'Size',       type: 'size' },
    { id: 2, name: 'Ice Level',  type: 'ice' },
    { id: 3, name: 'Sweetness',  type: 'sweetness' },
    { id: 4, name: 'Toppings',   type: 'toppings' },
  ]);

  await knex('options').insert([
    { group_id: 1, label: 'Small (12oz)',    price_modifier: 0 },
    { group_id: 1, label: 'Medium (16oz)',   price_modifier: 0.75 },
    { group_id: 1, label: 'Large (20oz)',    price_modifier: 1.25 },
    { group_id: 2, label: 'No Ice',          price_modifier: 0 },
    { group_id: 2, label: 'Light Ice',       price_modifier: 0 },
    { group_id: 2, label: 'Regular Ice',     price_modifier: 0 },
    { group_id: 2, label: 'Extra Ice',       price_modifier: 0 },
    { group_id: 3, label: '0% Sweet',        price_modifier: 0 },
    { group_id: 3, label: '25% Sweet',       price_modifier: 0 },
    { group_id: 3, label: '50% Sweet',       price_modifier: 0 },
    { group_id: 3, label: '75% Sweet',       price_modifier: 0 },
    { group_id: 3, label: '100% Sweet',      price_modifier: 0 },
    { group_id: 4, label: 'Boba Pearls',     price_modifier: 0.75 },
    { group_id: 4, label: 'Lychee Jelly',    price_modifier: 0.75 },
    { group_id: 4, label: 'Red Bean',        price_modifier: 0.75 },
    { group_id: 4, label: 'Aloe',            price_modifier: 0.75 },
    { group_id: 4, label: 'Pudding',         price_modifier: 0.75 },
  ]);

  const allItemIds = [1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12];
  const rows = [];
  for (const item_id of allItemIds) {
    for (const option_group_id of [1, 2, 3, 4]) {
      rows.push({ item_id, option_group_id });
    }
  }
  await knex('item_option_groups').insert(rows);
};
