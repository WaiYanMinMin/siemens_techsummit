alter table public.registrations
add column if not exists ticket_id text;

comment on column public.registrations.ticket_id is
  'External ticket / check-in id; used to generate QR attachment on confirmation emails.';
