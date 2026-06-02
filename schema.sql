CREATE TABLE users (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  username      TEXT        NOT NULL UNIQUE,
  password_hash TEXT        NOT NULL,
  created_at    TIMESTAMP   NOT NULL DEFAULT now()
);

CREATE TABLE friendships (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  friend_id  UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status     VARCHAR(20) NOT NULL DEFAULT 'pending'
                         CHECK (status IN ('pending', 'accepted', 'blocked')),
  created_at TIMESTAMP   NOT NULL DEFAULT now(),

  CONSTRAINT no_self_friendship CHECK (user_id <> friend_id),
  CONSTRAINT unique_friendship   UNIQUE (user_id, friend_id)
);

CREATE INDEX idx_friendships_user_id   ON friendships(user_id);
CREATE INDEX idx_friendships_friend_id ON friendships(friend_id);

CREATE TABLE posts (
  id         UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      TEXT      NOT NULL,
  body       TEXT      NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_posts_user_id ON posts(user_id);