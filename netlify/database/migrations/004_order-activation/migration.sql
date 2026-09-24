ALTER TABLE activation_codes ADD COLUMN IF NOT EXISTS platform TEXT NOT NULL DEFAULT 'TikTok';
ALTER TABLE activation_codes ADD COLUMN IF NOT EXISTS order_number TEXT;
UPDATE activation_codes SET order_number=code WHERE order_number IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS activation_platform_order_uq ON activation_codes(platform, order_number);
