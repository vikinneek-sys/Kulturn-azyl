import * as migration_20260712_115043_initial_postgres_schema from './20260712_115043_initial_postgres_schema';
import * as migration_20260914_130000_add_article_views from './20260914_130000_add_article_views';

export const migrations = [
  {
    up: migration_20260712_115043_initial_postgres_schema.up,
    down: migration_20260712_115043_initial_postgres_schema.down,
    name: '20260712_115043_initial_postgres_schema'
  },
  {
    up: migration_20260914_130000_add_article_views.up,
    down: migration_20260914_130000_add_article_views.down,
    name: '20260914_130000_add_article_views'
  },
];
