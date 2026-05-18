do $$
declare
  r record;
begin
  for r in
    select conname
    from pg_constraint
    where conrelid = 'public.registrations'::regclass
      and contype = 'u'
      and (
        pg_get_constraintdef(oid) ilike '%(email)%'
        or pg_get_constraintdef(oid) ilike '%(mobile_number)%'
      )
  loop
    execute format(
      'alter table public.registrations drop constraint if exists %I',
      r.conname
    );
  end loop;

  for r in
    select schemaname, indexname
    from pg_indexes
    where schemaname = 'public'
      and tablename = 'registrations'
      and indexdef ilike 'create unique index%'
      and (
        indexdef ilike '%(email%'
        or indexdef ilike '%(mobile_number%'
      )
  loop
    execute format('drop index if exists %I.%I', r.schemaname, r.indexname);
  end loop;
end $$;
