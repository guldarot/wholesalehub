-- Location: supabase/migrations/20250812092242_wholesaler_business_system.sql
-- Schema Analysis: Fresh project - no existing tables found
-- Integration Type: Complete new wholesaler business management system  
-- Dependencies: None - creating complete schema

-- 1. Types and Enums
CREATE TYPE public.user_role AS ENUM ('admin', 'manager', 'staff', 'customer');
CREATE TYPE public.order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned');
CREATE TYPE public.payment_status AS ENUM ('pending', 'partial', 'paid', 'failed', 'refunded');
CREATE TYPE public.delivery_status AS ENUM ('pending', 'in_transit', 'delivered', 'delayed', 'failed');
CREATE TYPE public.product_status AS ENUM ('active', 'inactive', 'discontinued');
CREATE TYPE public.stock_status AS ENUM ('in_stock', 'low_stock', 'out_of_stock', 'overstock');

-- 2. Core User Management Table
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    role public.user_role DEFAULT 'staff'::public.user_role,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Customer Management
CREATE TABLE public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    address TEXT,
    city TEXT,
    business_name TEXT,
    tax_id TEXT,
    credit_limit DECIMAL(12,2) DEFAULT 0,
    current_balance DECIMAL(12,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Product Categories
CREATE TABLE public.product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES public.product_categories(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Suppliers
CREATE TABLE public.suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    contact_person TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. Products/Inventory
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    sku TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    category_id UUID REFERENCES public.product_categories(id) ON DELETE SET NULL,
    supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
    unit_price DECIMAL(10,2) NOT NULL DEFAULT 0,
    current_stock INTEGER DEFAULT 0,
    reorder_level INTEGER DEFAULT 0,
    max_stock_level INTEGER,
    status public.product_status DEFAULT 'active'::public.product_status,
    weight DECIMAL(8,2),
    dimensions TEXT,
    barcode TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. Orders
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    order_id TEXT NOT NULL UNIQUE,
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    order_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    delivery_date TIMESTAMPTZ,
    subtotal DECIMAL(12,2) DEFAULT 0,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    delivery_charges DECIMAL(12,2) DEFAULT 0,
    total_amount DECIMAL(12,2) DEFAULT 0,
    status public.order_status DEFAULT 'pending'::public.order_status,
    payment_status public.payment_status DEFAULT 'pending'::public.payment_status,
    delivery_address TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. Order Items
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(12,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. Deliveries
CREATE TABLE public.deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    tracking_id TEXT NOT NULL UNIQUE,
    delivery_address TEXT NOT NULL,
    driver_name TEXT,
    driver_phone TEXT,
    vehicle_number TEXT,
    status public.delivery_status DEFAULT 'pending'::public.delivery_status,
    estimated_delivery_time TIMESTAMPTZ,
    actual_delivery_time TIMESTAMPTZ,
    delivery_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 10. Stock Adjustments
CREATE TABLE public.stock_adjustments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    adjustment_type TEXT NOT NULL CHECK (adjustment_type IN ('increase', 'decrease', 'correction')),
    quantity_change INTEGER NOT NULL,
    previous_stock INTEGER NOT NULL,
    new_stock INTEGER NOT NULL,
    reason TEXT,
    reference_id UUID,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 11. Essential Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_customers_user_id ON public.customers(user_id);
CREATE INDEX idx_customers_email ON public.customers(email);
CREATE INDEX idx_products_user_id ON public.products(user_id);
CREATE INDEX idx_products_sku ON public.products(sku);
CREATE INDEX idx_products_category_id ON public.products(category_id);
CREATE INDEX idx_products_supplier_id ON public.products(supplier_id);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_order_date ON public.orders(order_date);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX idx_deliveries_user_id ON public.deliveries(user_id);
CREATE INDEX idx_deliveries_order_id ON public.deliveries(order_id);
CREATE INDEX idx_deliveries_status ON public.deliveries(status);
CREATE INDEX idx_stock_adjustments_product_id ON public.stock_adjustments(product_id);

-- 12. Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_adjustments ENABLE ROW LEVEL SECURITY;

-- 13. Create utility functions BEFORE RLS policies
CREATE OR REPLACE FUNCTION public.is_admin_from_auth()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid() 
    AND (au.raw_user_meta_data->>'role' = 'admin' 
         OR au.raw_app_meta_data->>'role' = 'admin')
)
$$;

-- 14. RLS Policies (Using Pattern System)

-- Pattern 1: Core user table (user_profiles) - Simple only, no functions
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 2: Simple user ownership for business tables
CREATE POLICY "users_manage_own_customers"
ON public.customers
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_product_categories"
ON public.product_categories
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_suppliers"
ON public.suppliers
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_products"
ON public.products
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_orders"
ON public.orders
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_deliveries"
ON public.deliveries
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_stock_adjustments"
ON public.stock_adjustments
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Pattern 7: Complex relationship for order_items (queries different tables)
CREATE OR REPLACE FUNCTION public.can_access_order_item(item_order_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = item_order_id 
    AND o.user_id = auth.uid()
)
$$;

CREATE POLICY "users_access_own_order_items"
ON public.order_items
FOR ALL
TO authenticated
USING (public.can_access_order_item(order_id))
WITH CHECK (public.can_access_order_item(order_id));

-- 15. Functions for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'staff')::public.user_role
  );
  RETURN NEW;
END;
$$;

-- 16. Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 17. Mock Data Generation
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    manager_uuid UUID := gen_random_uuid();
    staff_uuid UUID := gen_random_uuid();
    category1_uuid UUID := gen_random_uuid();
    category2_uuid UUID := gen_random_uuid();
    category3_uuid UUID := gen_random_uuid();
    supplier1_uuid UUID := gen_random_uuid();
    supplier2_uuid UUID := gen_random_uuid();
    customer1_uuid UUID := gen_random_uuid();
    customer2_uuid UUID := gen_random_uuid();
    customer3_uuid UUID := gen_random_uuid();
    product1_uuid UUID := gen_random_uuid();
    product2_uuid UUID := gen_random_uuid();
    product3_uuid UUID := gen_random_uuid();
    product4_uuid UUID := gen_random_uuid();
    order1_uuid UUID := gen_random_uuid();
    order2_uuid UUID := gen_random_uuid();
    order3_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@wholesalehub.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "System Administrator", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (manager_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'manager@wholesalehub.com', crypt('manager123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Business Manager", "role": "manager"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (staff_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'staff@wholesalehub.com', crypt('staff123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Staff Member", "role": "staff"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create categories
    INSERT INTO public.product_categories (id, user_id, name, description) VALUES
        (category1_uuid, admin_uuid, 'Food & Beverages', 'Rice, wheat, oil, sugar and other food items'),
        (category2_uuid, admin_uuid, 'Electronics', 'Mobile phones, computers and electronic devices'),
        (category3_uuid, admin_uuid, 'Clothing & Textiles', 'Shirts, fabrics and textile products');

    -- Create suppliers
    INSERT INTO public.suppliers (id, user_id, name, contact_person, email, phone, address, city) VALUES
        (supplier1_uuid, admin_uuid, 'Karachi Traders', 'Ahmed Ali', 'ahmed@karachitrade.com', '+92 300 1234567', 'Main Market, Karachi', 'Karachi'),
        (supplier2_uuid, admin_uuid, 'Lahore Wholesale Co.', 'Hassan Khan', 'hassan@lahorewholesale.com', '+92 301 2345678', 'Industrial Area, Lahore', 'Lahore');

    -- Create customers
    INSERT INTO public.customers (id, user_id, name, email, phone, address, city, business_name, credit_limit) VALUES
        (customer1_uuid, admin_uuid, 'Islamabad Distributors', 'sales@islamabaddist.com', '+92 302 3456789', 'Block C, Commercial Plaza', 'Islamabad', 'Islamabad Distributors Pvt Ltd', 500000),
        (customer2_uuid, admin_uuid, 'Peshawar Trading House', 'contact@peshawartrade.com', '+92 303 4567890', 'Main Bazaar, University Road', 'Peshawar', 'Peshawar Trading House', 300000),
        (customer3_uuid, admin_uuid, 'Multan Food Suppliers', 'orders@multanfood.com', '+92 304 5678901', 'Godown 12, Grain Market', 'Multan', 'Multan Food Suppliers Co.', 400000);

    -- Create products
    INSERT INTO public.products (id, user_id, sku, name, description, category_id, supplier_id, unit_price, current_stock, reorder_level) VALUES
        (product1_uuid, admin_uuid, 'RICE-BAS-25KG', 'Premium Basmati Rice 25kg', 'Premium quality basmati rice, 25kg bag', category1_uuid, supplier1_uuid, 8500, 120, 50),
        (product2_uuid, admin_uuid, 'FLOUR-WHT-10KG', 'Wheat Flour Premium 10kg', 'Premium wheat flour, 10kg bag', category1_uuid, supplier2_uuid, 850, 200, 100),
        (product3_uuid, admin_uuid, 'OIL-COOK-5L', 'Cooking Oil 5L', 'Pure cooking oil, 5 liter container', category1_uuid, supplier1_uuid, 4500, 85, 30),
        (product4_uuid, admin_uuid, 'SAM-A54-128GB', 'Samsung Galaxy A54 5G 128GB', '128GB Storage, 8GB RAM, Triple Camera', category2_uuid, supplier2_uuid, 89999, 45, 20);

    -- Create orders
    INSERT INTO public.orders (id, user_id, order_id, customer_id, order_date, delivery_date, subtotal, tax_amount, delivery_charges, total_amount, status, payment_status, delivery_address) VALUES
        (order1_uuid, admin_uuid, 'WH-2025-001', customer1_uuid, '2025-01-10T10:30:00Z', '2025-01-15T14:00:00Z', 114545, 11455, 0, 126000, 'processing'::public.order_status, 'paid'::public.payment_status, 'Block C, Commercial Plaza, Islamabad'),
        (order2_uuid, admin_uuid, 'WH-2025-002', customer2_uuid, '2025-01-11T09:15:00Z', '2025-01-16T11:00:00Z', 81364, 8136, 0, 89500, 'shipped'::public.order_status, 'pending'::public.payment_status, 'Main Bazaar, University Road, Peshawar'),
        (order3_uuid, admin_uuid, 'WH-2025-003', customer3_uuid, '2025-01-11T14:20:00Z', null, 61636, 6164, 0, 67800, 'pending'::public.order_status, 'pending'::public.payment_status, 'Godown 12, Grain Market, Multan');

    -- Create order items
    INSERT INTO public.order_items (order_id, product_id, quantity, unit_price, total_price) VALUES
        (order1_uuid, product1_uuid, 50, 8500, 425000),
        (order1_uuid, product2_uuid, 100, 850, 85000),
        (order2_uuid, product3_uuid, 20, 4500, 90000),
        (order3_uuid, product1_uuid, 30, 8500, 255000),
        (order3_uuid, product4_uuid, 1, 89999, 89999);

    -- Create deliveries
    INSERT INTO public.deliveries (user_id, order_id, tracking_id, delivery_address, driver_name, driver_phone, vehicle_number, status, estimated_delivery_time) VALUES
        (admin_uuid, order1_uuid, 'TRK-2025-001', 'Block C, Commercial Plaza, Islamabad', 'Muhammad Asif', '+92 300 9876543', 'KHI-1234', 'in_transit'::public.delivery_status, '2025-01-15T14:00:00Z'),
        (admin_uuid, order2_uuid, 'TRK-2025-002', 'Main Bazaar, University Road, Peshawar', 'Ali Hassan', '+92 301 8765432', 'LHR-5678', 'delivered'::public.delivery_status, '2025-01-16T11:00:00Z');

    -- Create sample stock adjustments
    INSERT INTO public.stock_adjustments (user_id, product_id, adjustment_type, quantity_change, previous_stock, new_stock, reason) VALUES
        (admin_uuid, product1_uuid, 'increase', 50, 70, 120, 'New stock received from supplier'),
        (admin_uuid, product2_uuid, 'decrease', -10, 210, 200, 'Damaged items removed from inventory');

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;

-- 18. Create cleanup function for test data
CREATE OR REPLACE FUNCTION public.cleanup_test_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    auth_user_ids_to_delete UUID[];
BEGIN
    -- Get auth user IDs first
    SELECT ARRAY_AGG(id) INTO auth_user_ids_to_delete
    FROM auth.users
    WHERE email LIKE '%@wholesalehub.com';

    -- Delete in dependency order (children first, then auth.users last)
    DELETE FROM public.stock_adjustments WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.deliveries WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.order_items WHERE order_id IN (
        SELECT id FROM public.orders WHERE user_id = ANY(auth_user_ids_to_delete)
    );
    DELETE FROM public.orders WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.products WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.suppliers WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.product_categories WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.customers WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.user_profiles WHERE id = ANY(auth_user_ids_to_delete);

    -- Delete auth.users last (after all references are removed)
    DELETE FROM auth.users WHERE id = ANY(auth_user_ids_to_delete);
EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key constraint prevents deletion: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup failed: %', SQLERRM;
END;
$$;