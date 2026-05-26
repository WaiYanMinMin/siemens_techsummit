alter table public.registrations
add column if not exists rejection_email_sent boolean not null default false;

update public.registrations
set rejection_email_sent = true
where approval_status = 'rejected';

update public.registrations
set rejection_email_sent = false
where rejection_email_sent is null;

create index if not exists registrations_rejection_email_sent_idx
on public.registrations (rejection_email_sent);
