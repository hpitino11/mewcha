exports.seed = async (knex) => {
  await knex('order_items').del();
  await knex('orders').del();
  await knex('item_option_groups').del();
  await knex('options').del();
  await knex('option_groups').del();
  await knex('menu_items').del();
  await knex('categories').del();

  await knex('categories').insert([
    { id: 1, name: 'Matcha', slug: 'matcha', display_order: 1 },
    { id: 2, name: 'Boba', slug: 'boba', display_order: 2 },
    { id: 3, name: 'Coffee', slug: 'coffee', display_order: 3 },
    { id: 4, name: 'Seasonal', slug: 'seasonal', display_order: 4 },
  ]);

  await knex('menu_items').insert([
    {
      id: 1,
      category_id: 1,
      name: 'Ceremonial Matcha Latte',
      description: 'Stone-ground ceremonial grade matcha whisked to a gentle foam, served over oat milk with a hint of vanilla.',
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
      category_id: 4,
      name: 'Hojicha Cold Brew',
      description: 'Roasted hojicha slowly cold-brewed for 12 hours, served over ice with a touch of honey. Seasonal autumn offering.',
      base_price: 6.25,
      is_available: true,
      is_seasonal: true,
      is_bestseller: false,
    },
    {
      id: 4,
      category_id: 3,
      name: 'Iced Americano',
      description: 'Double shot of our house espresso pulled over cold water and ice. Clean, bold, unfussy.',
      base_price: 5.00,
      is_available: true,
      is_seasonal: false,
      is_bestseller: false,
    },
    {
      id: 5,
      category_id: 2,
      name: 'Taro Milk Tea',
      description: 'Creamy taro root blended with whole milk and fragrant black tea. Earthy, sweet, and deeply satisfying.',
      base_price: 6.75,
      is_available: true,
      is_seasonal: false,
      is_bestseller: true,
    },
    {
      id: 6,
      category_id: 2,
      name: 'Strawberry Lychee Boba',
      description: 'Bright strawberry tea shaken with lychee syrup and topped with popping lychee boba. Refreshing and floral.',
      base_price: 7.00,
      is_available: true,
      is_seasonal: false,
      is_bestseller: true,
    },
    {
      id: 7,
      category_id: 3,
      name: 'Dirty Chai Latte',
      description: 'House spiced chai concentrate pulled with a double shot of espresso, steamed oat milk, and a dusting of cinnamon.',
      base_price: 6.50,
      is_available: true,
      is_seasonal: false,
      is_bestseller: false,
    },
  ]);

  await knex('option_groups').insert([
    { id: 1, name: 'Size', type: 'size' },
    { id: 2, name: 'Ice Level', type: 'ice' },
    { id: 3, name: 'Sweetness', type: 'sweetness' },
    { id: 4, name: 'Toppings', type: 'toppings' },
  ]);

  await knex('options').insert([
    { group_id: 1, label: 'Small (12oz)', price_modifier: 0 },
    { group_id: 1, label: 'Medium (16oz)', price_modifier: 0.75 },
    { group_id: 1, label: 'Large (20oz)', price_modifier: 1.25 },
    { group_id: 2, label: 'No Ice', price_modifier: 0 },
    { group_id: 2, label: 'Light Ice', price_modifier: 0 },
    { group_id: 2, label: 'Regular Ice', price_modifier: 0 },
    { group_id: 2, label: 'Extra Ice', price_modifier: 0 },
    { group_id: 3, label: '0% Sweet', price_modifier: 0 },
    { group_id: 3, label: '25% Sweet', price_modifier: 0 },
    { group_id: 3, label: '50% Sweet', price_modifier: 0 },
    { group_id: 3, label: '75% Sweet', price_modifier: 0 },
    { group_id: 3, label: '100% Sweet', price_modifier: 0 },
    { group_id: 4, label: 'Boba Pearls', price_modifier: 0.75 },
    { group_id: 4, label: 'Lychee Jelly', price_modifier: 0.75 },
    { group_id: 4, label: 'Red Bean', price_modifier: 0.75 },
    { group_id: 4, label: 'Aloe', price_modifier: 0.75 },
    { group_id: 4, label: 'Pudding', price_modifier: 0.75 },
  ]);

  const allItemIds = [1, 2, 3, 4, 5, 6, 7];
  const rows = [];
  for (const item_id of allItemIds) {
    for (const option_group_id of [1, 2, 3, 4]) {
      rows.push({ item_id, option_group_id });
    }
  }
  await knex('item_option_groups').insert(rows);
};
