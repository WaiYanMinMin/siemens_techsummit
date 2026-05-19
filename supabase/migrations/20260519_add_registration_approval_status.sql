alter table public.registrations
add column if not exists approval_status text not null default 'pending';

alter table public.registrations
drop constraint if exists registrations_approval_status_check;

alter table public.registrations
add constraint registrations_approval_status_check
check (approval_status in ('pending', 'approved', 'rejected'));

update public.registrations
set approval_status = 'pending'
where approval_status is null
   or approval_status not in ('pending', 'approved', 'rejected');

create index if not exists registrations_approval_status_idx
on public.registrations (approval_status);
