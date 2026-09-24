CREATE TABLE IF NOT EXISTS activation_codes (code TEXT PRIMARY KEY, model TEXT NOT NULL, used_at TIMESTAMP, owner TEXT);
INSERT INTO activation_codes(code,model) VALUES ('DEMO-S1-2026','Shell S1'),('DEMO-UB-2026','UBaker S1'),('DEMO-VS-2026','Vision S1 Pro'),('DEMO-32-2026','32L') ON CONFLICT DO NOTHING;
