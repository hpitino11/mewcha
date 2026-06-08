exports.up = async (knex) => {
  await knex.schema.createTable('users', (t) => {
    t.increments('id');
    t.string('name').notNullable();
    t.string('email').notNullable().unique();
    t.string('password_hash').notNullable();
    t.enum('role', ['customer', 'admin']).defaultTo('customer');
    t.timestamps(true, true);
  });

  await knex.schema.createTable('categories', (t) => {
    t.increments('id');
    t.string('name').notNullable();
    t.string('slug').notNullable().unique();
    t.integer('display_order').defaultTo(0);
  });

  await knex.schema.createTable('menu_items', (t) => {
    t.increments('id');
    t.integer('category_id').references('id').inTable('categories').onDelete('SET NULL');
    t.string('name').notNullable();
    t.text('description');
    t.decimal('base_price', 10, 2).notNullable();
    t.string('image_url');
    t.boolean('is_available').defaultTo(true);
    t.boolean('is_seasonal').defaultTo(false);
    t.boolean('is_bestseller').defaultTo(false);
    t.timestamps(true, true);
  });

  await knex.schema.createTable('option_groups', (t) => {
    t.increments('id');
    t.string('name').notNullable();
    t.enum('type', ['size', 'ice', 'sweetness', 'toppings']).notNullable();
  });

  await knex.schema.createTable('options', (t) => {
    t.increments('id');
    t.integer('group_id').references('id').inTable('option_groups').onDelete('CASCADE');
    t.string('label').notNullable();
    t.decimal('price_modifier', 10, 2).defaultTo(0);
  });

  await knex.schema.createTable('item_option_groups', (t) => {
    t.integer('item_id').references('id').inTable('menu_items').onDelete('CASCADE');
    t.integer('option_group_id').references('id').inTable('option_groups').onDelete('CASCADE');
    t.primary(['item_id', 'option_group_id']);
  });

  await knex.schema.createTable('orders', (t) => {
    t.increments('id');
    t.integer('user_id').references('id').inTable('users').onDelete('SET NULL');
    t.enum('status', ['pending', 'in_progress', 'ready', 'completed']).defaultTo('pending');
    t.decimal('total', 10, 2).notNullable();
    t.timestamps(true, true);
  });

  await knex.schema.createTable('order_items', (t) => {
    t.increments('id');
    t.integer('order_id').references('id').inTable('orders').onDelete('CASCADE');
    t.integer('item_id').references('id').inTable('menu_items').onDelete('SET NULL');
    t.integer('quantity').defaultTo(1);
    t.jsonb('customizations');
    t.decimal('subtotal', 10, 2).notNullable();
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('order_items');
  await knex.schema.dropTableIfExists('orders');
  await knex.schema.dropTableIfExists('item_option_groups');
  await knex.schema.dropTableIfExists('options');
  await knex.schema.dropTableIfExists('option_groups');
  await knex.schema.dropTableIfExists('menu_items');
  await knex.schema.dropTableIfExists('categories');
  await knex.schema.dropTableIfExists('users');
};
