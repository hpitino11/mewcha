export interface Category {
  id: number;
  name: string;
  slug: string;
  display_order: number;
}

export interface MenuItem {
  id: number;
  category_id: number;
  name: string;
  description: string;
  base_price: string;
  image_url: string | null;
  is_available: boolean;
  is_seasonal: boolean;
  is_bestseller: boolean;
  category_name: string;
  category_slug: string;
}

export interface Option {
  id: number;
  group_id: number;
  label: string;
  price_modifier: string;
}

export interface OptionGroup {
  id: number;
  name: string;
  type: 'size' | 'ice' | 'sweetness' | 'toppings';
  options: Option[];
}

export interface MenuItemDetail extends MenuItem {
  option_groups: OptionGroup[];
}

export interface CartCustomizations {
  size?: Option;
  ice?: Option;
  sweetness?: Option;
  toppings?: Option[];
}

export interface CartItem {
  id: string;
  menu_item: MenuItem;
  quantity: number;
  customizations: CartCustomizations;
  subtotal: number;
}

export interface Order {
  id: number;
  user_id: number;
  status: 'pending' | 'in_progress' | 'ready' | 'completed';
  total: string;
  created_at: string;
  items?: OrderItem[];
  customer_name?: string;
  customer_email?: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  item_id: number;
  name: string;
  quantity: number;
  customizations: CartCustomizations;
  subtotal: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'admin';
}

export interface AuthResponse {
  token: string;
  user: User;
}
