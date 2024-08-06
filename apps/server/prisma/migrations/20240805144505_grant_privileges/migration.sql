-- https://supabase.com/partners/integrations/prisma
-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "nextboard";

grant usage on schema nextboard to postgres, anon, authenticated, service_role;

grant all privileges on all tables in schema nextboard to postgres, anon, authenticated, service_role;
grant all privileges on all functions in schema nextboard to postgres, anon, authenticated, service_role;
grant all privileges on all sequences in schema nextboard to postgres, anon, authenticated, service_role;

alter default privileges in schema nextboard grant all on tables to postgres, anon, authenticated, service_role;
alter default privileges in schema nextboard grant all on functions to postgres, anon, authenticated, service_role;
alter default privileges in schema nextboard grant all on sequences to postgres, anon, authenticated, service_role;
