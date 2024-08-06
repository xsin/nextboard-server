DO $$
DECLARE
  -- Step 1: Create an admin user manually via supabase's dashboard, and get the user's UUID
  -- https://supabase.com/dashboard/project/{your-project-id}/auth/users
  uid uuid := '681cf17e-8d9a-4940-8342-8822e7b4e644';
BEGIN
  -- Step 2: Insert the user into the 'users' table if it doesn't already exist
  INSERT INTO public.users (id, name, display_name, gender, avatar)
  VALUES (uid, 'admin', 'Admin', 'female', 'https://cdn.pixabay.com/photo/2022/02/13/08/20/woman-7010574_640.png')
  ON CONFLICT (id) DO NOTHING;

  -- Step 3: Insert the 'admin' role into the 'roles' table if it doesn't already exist
  INSERT INTO public.roles (name, remark, created_by, updated_by)
  VALUES ('admin', 'Administrator role', uid, uid)
  ON CONFLICT (name) DO NOTHING;

  -- Step 4: Associate the user with the 'admin' role in the 'user_roles' table
  INSERT INTO public.user_roles (user_id, role_id, created_by)
  VALUES (uid, (SELECT id FROM public.roles WHERE name = 'admin'), uid)
  ON CONFLICT (user_id, role_id) DO NOTHING;
END $$;