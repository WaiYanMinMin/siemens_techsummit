update public.registrations
set industry = null
where lower(trim(industry)) = 'aerospace'
  and created_at >= current_date
  and created_at < current_date + interval '1 day';