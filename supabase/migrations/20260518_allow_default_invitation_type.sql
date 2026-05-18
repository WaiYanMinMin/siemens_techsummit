alter table public.invitation_recipients
drop constraint if exists invitation_recipients_invitation_type_check;

alter table public.invitation_recipients
add constraint invitation_recipients_invitation_type_check
check (invitation_type in ('default', 'csuites', 'associates'));
