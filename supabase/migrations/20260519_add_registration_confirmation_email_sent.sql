alter table public.registrations
add column if not exists confirmation_email_sent boolean not null default false;

update public.registrations
set confirmation_email_sent = false
where confirmation_email_sent is null;

create index if not exists registrations_confirmation_email_sent_idx
on public.registrations (confirmation_email_sent);
