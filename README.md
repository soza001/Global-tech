# Global-tech

Tous mes projets.

## Bonjour Soza

Mini application de chat de démonstration. Chaque message non vide reçoit la réponse fixe `bonjour soza`.

Développement : installer les dépendances avec `npm install`, copier `.env.example` vers `.env.local`, compléter la clé publishable Supabase puis lancer `npm run dev`.

Vérifications : `npm test`, `npm run lint`, `npm run build`.

La migration `supabase/migrations/20261021193418_create_chat_messages.sql` crée `public.chat_messages`. RLS est activé. Le rôle `anon` peut uniquement insérer les colonnes `user_message` et `assistant_reply`, si le message fait de 1 à 1000 caractères et la réponse est exactement `bonjour soza`. Aucune lecture publique n'est autorisée.
