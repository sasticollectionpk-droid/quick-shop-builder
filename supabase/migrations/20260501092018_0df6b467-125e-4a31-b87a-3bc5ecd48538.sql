REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO postgres, service_role;