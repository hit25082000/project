# Supabase Setup for Monetization

This directory contains the database schema and configuration for the monetization system.

## Setup Instructions

### 1. Apply Supabase Stripe Template

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Search for and apply the "Stripe Integration" template
4. This will create the following tables:
   - `customers` - Links Supabase auth users to Stripe customers
   - `subscriptions` - Tracks subscription status and details
   - `products` - Available products/plans
   - `prices` - Pricing information for products
   - `invoices` - Billing history
   - `payment_methods` - Stored payment methods

### 2. Apply Custom Monetization Tables

Run the migration files in order:

1. `migrations/001_custom_monetization_tables.sql` - Creates custom tables
2. `migrations/002_row_level_security_policies.sql` - Sets up security policies

You can run these in the Supabase SQL Editor or use the Supabase CLI:

```bash
supabase db push
```

### 3. Configure Environment Variables

Update your Supabase project settings with the required environment variables:

- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Webhook signing secret from Stripe

### 4. Test Database Setup

Verify that all tables are created and policies are applied by running:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('customers', 'subscriptions', 'products', 'prices', 'user_roles', 'billing_history', 'admin_plans');

-- Test RLS policies (as authenticated user)
SELECT * FROM user_roles WHERE user_id = auth.uid();
SELECT * FROM admin_plans WHERE is_active = true;
```

## Database Schema Overview

### Stripe Template Tables
- `customers`: Customer data linked to Supabase auth
- `subscriptions`: Subscription lifecycle management
- `products`: Product catalog
- `prices`: Pricing information
- `invoices`: Billing history
- `payment_methods`: Stored payment methods

### Custom Tables
- `user_roles`: User role management with history
- `billing_history`: Comprehensive payment tracking
- `admin_plans`: Developer-defined subscription plans

## Security Notes

- Row Level Security (RLS) is enabled on all tables
- Users can only access their own billing data
- Admins have elevated access for management
- Service role is used for webhook operations
- All sensitive operations are server-side only
