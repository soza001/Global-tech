create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_message text not null,
  assistant_reply text not null default 'bonjour soza',
  created_at timestamptz not null default now(),
  constraint chat_messages_user_message_length check (char_length(user_message) between 1 and 1000),
  constraint chat_messages_fixed_reply check (assistant_reply = 'bonjour soza')
);

alter table public.chat_messages enable row level security;
revoke all on table public.chat_messages from anon, authenticated;
grant insert (user_message, assistant_reply) on table public.chat_messages to anon;
create policy "anon_can_insert_chat_messages" on public.chat_messages for insert to anon
with check (char_length(user_message) between 1 and 1000 and assistant_reply = 'bonjour soza');
