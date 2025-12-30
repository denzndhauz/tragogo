-- Insert test admin user
-- Email: admin@tragogo.com
-- Password: Admin@123456 (hashed with bcrypt)
INSERT INTO "users" ("email", "password", "name", "created_at", "updated_at")
VALUES (
    'admin@tragogo.com',
    '$2b$10$X3.VR8xXdP8Kz.9ZL0V6PeZXbL6KqCzKX7Qz6Y5Y7Y8Y9Y0Z1a1b1', 
    'Admin User',
    NOW(),
    NOW()
)
ON CONFLICT ("email") DO NOTHING;
