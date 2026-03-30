begin;

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists counterparties (
  id bigint generated always as identity primary key,
  name varchar(255) not null,
  tin varchar(32) not null,
  tax_registration_code varchar(32),
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),
  constraint counterparties_name_chk check (btrim(name) <> ''),
  constraint counterparties_tin_chk check (btrim(tin) <> '')
);

create unique index if not exists counterparties_tin_idx on counterparties (tin);

create table if not exists doc_types (
  id bigint generated always as identity primary key,
  code varchar(50) not null,
  name varchar(255) not null,
  accent varchar(255),
  template_key varchar(120),
  fallback_renderer varchar(50) not null default 'generic_tree',
  position integer not null default 0,
  is_active boolean not null default true,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),
  constraint doc_types_code_uniq unique (code),
  constraint doc_types_code_chk check (btrim(code) <> ''),
  constraint doc_types_name_chk check (btrim(name) <> ''),
  constraint doc_types_accent_chk check (accent is null or btrim(accent) <> ''),
  constraint doc_types_template_key_chk check (
    template_key is null or btrim(template_key) <> ''
  ),
  constraint doc_types_fallback_renderer_chk check (
    fallback_renderer in ('generic_tree', 'flat_sections', 'table_first')
  )
);

create index if not exists doc_types_position_idx on doc_types (position, id);
create index if not exists doc_types_active_idx on doc_types (is_active, position, id);

create table if not exists doc_type_nodes (
  id bigint generated always as identity primary key,
  doc_type_id bigint not null references doc_types (id) on delete cascade,
  parent_id bigint references doc_type_nodes (id) on delete cascade,
  key varchar(120) not null,
  name varchar(255) not null,
  description text,
  render_mode varchar(50),
  position integer not null default 0,
  is_required boolean not null default false,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),
  constraint doc_type_nodes_key_chk check (btrim(key) <> ''),
  constraint doc_type_nodes_name_chk check (btrim(name) <> ''),
  constraint doc_type_nodes_render_mode_chk check (
    render_mode is null or render_mode in ('fields', 'cards', 'table', 'text')
  ),
  constraint doc_type_nodes_doc_type_parent_key_uniq unique (doc_type_id, parent_id, key)
);

create index if not exists doc_type_nodes_doc_type_idx
  on doc_type_nodes (doc_type_id, parent_id, position, id);

create table if not exists documents (
  id bigint generated always as identity primary key,
  doc_type_id bigint not null references doc_types (id),
  counterparty_id bigint references counterparties (id),
  number varchar(120) not null,
  document_date date not null,
  status varchar(100) not null,
  amount numeric(15, 2) not null default 0,
  currency_code varchar(3) not null default 'RUB',
  summary text,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),
  constraint documents_number_chk check (btrim(number) <> ''),
  constraint documents_status_chk check (btrim(status) <> ''),
  constraint documents_currency_code_chk check (char_length(currency_code) = 3)
);

create unique index if not exists documents_doc_type_number_idx
  on documents (doc_type_id, number);
create index if not exists documents_counterparty_idx
  on documents (counterparty_id, document_date desc, id);
create index if not exists documents_listing_idx
  on documents (document_date desc, id desc);

create table if not exists document_nodes (
  id bigint generated always as identity primary key,
  document_id bigint not null references documents (id) on delete cascade,
  parent_id bigint references document_nodes (id) on delete cascade,
  doc_type_node_id bigint not null references doc_type_nodes (id),
  position integer not null default 0,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),
  constraint document_nodes_document_parent_position_uniq unique (document_id, parent_id, position)
);

create index if not exists document_nodes_document_idx
  on document_nodes (document_id, parent_id, position, id);
create index if not exists document_nodes_doc_type_node_idx
  on document_nodes (doc_type_node_id, document_id);

/*
  IMPORTANT INVARIANT:
  doc_type_node_attributes and document_node_attributes must remain structurally
  identical at the data-column level. The only allowed schema difference is the
  owning foreign key column:
    - doc_type_node_id
    - document_node_id
*/

create table if not exists doc_type_node_attributes (
  id bigint generated always as identity primary key,
  doc_type_node_id bigint not null references doc_type_nodes (id) on delete cascade,
  name varchar(120) not null,
  value text,
  value_date date,
  value_int bigint,
  value_double double precision,
  value_boolean boolean,
  position integer not null default 0,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),
  constraint doc_type_node_attributes_name_chk check (btrim(name) <> ''),
  constraint doc_type_node_attributes_owner_name_position_uniq
    unique (doc_type_node_id, name, position)
);

create index if not exists doc_type_node_attributes_owner_idx
  on doc_type_node_attributes (doc_type_node_id, position, id);

create table if not exists document_node_attributes (
  id bigint generated always as identity primary key,
  document_node_id bigint not null references document_nodes (id) on delete cascade,
  name varchar(120) not null,
  value text,
  value_date date,
  value_int bigint,
  value_double double precision,
  value_boolean boolean,
  position integer not null default 0,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),
  constraint document_node_attributes_name_chk check (btrim(name) <> ''),
  constraint document_node_attributes_owner_name_position_uniq
    unique (document_node_id, name, position)
);

create index if not exists document_node_attributes_owner_idx
  on document_node_attributes (document_node_id, position, id);

drop trigger if exists counterparties_set_updated_at on counterparties;
create trigger counterparties_set_updated_at
before update on counterparties
for each row execute function set_updated_at();

drop trigger if exists doc_types_set_updated_at on doc_types;
create trigger doc_types_set_updated_at
before update on doc_types
for each row execute function set_updated_at();

drop trigger if exists doc_type_nodes_set_updated_at on doc_type_nodes;
create trigger doc_type_nodes_set_updated_at
before update on doc_type_nodes
for each row execute function set_updated_at();

drop trigger if exists documents_set_updated_at on documents;
create trigger documents_set_updated_at
before update on documents
for each row execute function set_updated_at();

drop trigger if exists document_nodes_set_updated_at on document_nodes;
create trigger document_nodes_set_updated_at
before update on document_nodes
for each row execute function set_updated_at();

drop trigger if exists doc_type_node_attributes_set_updated_at on doc_type_node_attributes;
create trigger doc_type_node_attributes_set_updated_at
before update on doc_type_node_attributes
for each row execute function set_updated_at();

drop trigger if exists document_node_attributes_set_updated_at on document_node_attributes;
create trigger document_node_attributes_set_updated_at
before update on document_node_attributes
for each row execute function set_updated_at();

commit;
