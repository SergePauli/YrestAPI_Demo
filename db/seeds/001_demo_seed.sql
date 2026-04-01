begin;

truncate table
  document_node_attributes,
  doc_type_node_attributes,
  document_nodes,
  documents,
  doc_type_nodes,
  doc_types,
  counterparties
restart identity cascade;

insert into doc_types (code, name, accent, template_key, fallback_renderer, position)
values
  ('INV', 'Invoice', 'VAT, goods, and services', 'invoice', 'table_first', 10),
  ('ACT', 'Service acceptance act', 'Proof of completion', 'service_acceptance_act', 'table_first', 20),
  ('PO', 'Payment order', 'Banking document', 'payment_order', 'flat_sections', 30),
  ('GRN', 'Goods receipt note', 'Inventory intake', 'goods_receipt_note', 'table_first', 40);

insert into doc_type_nodes (doc_type_id, parent_id, key, name, description, render_mode, position, is_required)
select dt.id, null, 'header', 'Document header', 'General invoice metadata', 'fields', 10, true
from doc_types dt
where dt.code = 'INV';

insert into doc_type_nodes (doc_type_id, parent_id, key, name, description, render_mode, position, is_required)
select dt.id, null, 'lines', 'Line items', 'Document line specification', 'table', 20, true
from doc_types dt
where dt.code = 'INV';

insert into doc_type_nodes (doc_type_id, parent_id, key, name, description, render_mode, position, is_required)
select dt.id, p.id, 'line', 'Line', 'Equipment delivery row', 'fields', 10, true
from doc_types dt
join doc_type_nodes p on p.doc_type_id = dt.id and p.key = 'lines' and p.parent_id is null
where dt.code = 'INV';

insert into doc_type_nodes (doc_type_id, parent_id, key, name, description, render_mode, position, is_required)
select dt.id, null, 'totals', 'Totals', 'Document totals', 'fields', 30, true
from doc_types dt
where dt.code = 'INV';

insert into doc_type_nodes (doc_type_id, parent_id, key, name, description, render_mode, position, is_required)
select dt.id, null, 'contract', 'Service basis', 'Agreement and work period details', 'fields', 10, true
from doc_types dt
where dt.code = 'ACT';

insert into doc_type_nodes (doc_type_id, parent_id, key, name, description, render_mode, position, is_required)
select dt.id, null, 'services', 'Service list', 'Scope of completed work', 'table', 20, true
from doc_types dt
where dt.code = 'ACT';

insert into doc_type_nodes (doc_type_id, parent_id, key, name, description, render_mode, position, is_required)
select dt.id, p.id, 'service', 'Service', 'Completed service row', 'fields', 10, true
from doc_types dt
join doc_type_nodes p on p.doc_type_id = dt.id and p.key = 'services' and p.parent_id is null
where dt.code = 'ACT';

insert into doc_type_nodes (doc_type_id, parent_id, key, name, description, render_mode, position, is_required)
select dt.id, null, 'payment', 'Payment details', 'Core banking parameters', 'fields', 10, true
from doc_types dt
where dt.code = 'PO';

insert into doc_type_nodes (doc_type_id, parent_id, key, name, description, render_mode, position, is_required)
select dt.id, null, 'purpose', 'Payment purpose', 'Purpose text for the bank and supplier', 'text', 20, true
from doc_types dt
where dt.code = 'PO';

insert into doc_type_nodes (doc_type_id, parent_id, key, name, description, render_mode, position, is_required)
select dt.id, null, 'warehouse', 'Warehouse intake', 'Receiving and warehouse details', 'fields', 10, true
from doc_types dt
where dt.code = 'GRN';

insert into doc_type_nodes (doc_type_id, parent_id, key, name, description, render_mode, position, is_required)
select dt.id, null, 'materials', 'Materials', 'Received items', 'table', 20, true
from doc_types dt
where dt.code = 'GRN';

insert into doc_type_nodes (doc_type_id, parent_id, key, name, description, render_mode, position, is_required)
select dt.id, p.id, 'material', 'Material', 'Received material row', 'fields', 10, true
from doc_types dt
join doc_type_nodes p on p.doc_type_id = dt.id and p.key = 'materials' and p.parent_id is null
where dt.code = 'GRN';

insert into doc_type_node_attributes (
  doc_type_node_id,
  name,
  value,
  value_date,
  value_int,
  value_double,
  value_boolean,
  position
)
select n.id, a.name, a.value, a.value_date, a.value_int, a.value_double, a.value_boolean, a.position
from doc_type_nodes n
join (
  values
    ('header', 'Organization', 'Demo Import LLC', null::date, null::bigint, null::double precision, null::boolean, 10),
    ('header', 'Warehouse', 'Main warehouse', null::date, null::bigint, null::double precision, null::boolean, 20),
    ('header', 'Basis', 'Supply agreement', null::date, null::bigint, null::double precision, null::boolean, 30),
    ('lines', 'Rows', '0', null::date, 0::bigint, null::double precision, null::boolean, 10),
    ('line', 'Item', null, null::date, null::bigint, null::double precision, null::boolean, 10),
    ('line', 'Quantity', null, null::date, null::bigint, null::double precision, null::boolean, 20),
    ('line', 'Price', null, null::date, null::bigint, null::double precision, null::boolean, 30),
    ('line', 'VAT rate', '20%', null::date, null::bigint, null::double precision, null::boolean, 40),
    ('totals', 'Amount before VAT', null, null::date, null::bigint, null::double precision, null::boolean, 10),
    ('totals', 'VAT', null, null::date, null::bigint, null::double precision, null::boolean, 20),
    ('totals', 'Grand total', null, null::date, null::bigint, null::double precision, null::boolean, 30),
    ('contract', 'Agreement', null, null::date, null::bigint, null::double precision, null::boolean, 10),
    ('contract', 'Period', null, null::date, null::bigint, null::double precision, null::boolean, 20),
    ('contract', 'Owner', 'Project office', null::date, null::bigint, null::double precision, null::boolean, 30),
    ('services', 'Services', '0', null::date, 0::bigint, null::double precision, null::boolean, 10),
    ('service', 'Hours', null, null::date, null::bigint, null::double precision, null::boolean, 10),
    ('service', 'Rate', null, null::date, null::bigint, null::double precision, null::boolean, 20),
    ('payment', 'Payer account', null, null::date, null::bigint, null::double precision, null::boolean, 10),
    ('payment', 'Bank BIC', null, null::date, null::bigint, null::double precision, null::boolean, 20),
    ('payment', 'Priority', '5', null::date, 5::bigint, null::double precision, null::boolean, 30),
    ('payment', 'Payment mode', 'Electronic', null::date, null::bigint, null::double precision, null::boolean, 40),
    ('purpose', 'Text', null, null::date, null::bigint, null::double precision, null::boolean, 10),
    ('purpose', 'Budget code', 'Not applicable', null::date, null::bigint, null::double precision, null::boolean, 20),
    ('warehouse', 'Warehouse', null, null::date, null::bigint, null::double precision, null::boolean, 10),
    ('warehouse', 'Responsible person', null, null::date, null::bigint, null::double precision, null::boolean, 20),
    ('warehouse', 'Supplier document', null, null::date, null::bigint, null::double precision, null::boolean, 30),
    ('materials', 'Items', '0', null::date, 0::bigint, null::double precision, null::boolean, 10),
    ('material', 'Quantity', null, null::date, null::bigint, null::double precision, null::boolean, 10),
    ('material', 'Price', null, null::date, null::bigint, null::double precision, null::boolean, 20)
) as a(node_key, name, value, value_date, value_int, value_double, value_boolean, position)
  on a.node_key = n.key;

\copy counterparties (name, tin, tax_registration_code) from '/docker-entrypoint-initdb.d/counterparties.csv' with (format csv);

with doc_type_source as (
  select *
  from (
    values
      ('INV', 'Posted', 'Invoice for delivery of IT equipment and peripherals.', 250),
      ('ACT', 'Signed', 'Service acceptance act for implementation and support work.', 250),
      ('PO', 'Sent to bank', 'Payment order for supplier settlement.', 250),
      ('GRN', 'Received into stock', 'Goods receipt note for warehouse intake.', 250)
  ) as v(code, status, summary, doc_count)
),
doc_series as (
  select
    dts.code,
    dts.status,
    dts.summary,
    gs as seq
  from doc_type_source dts
  join generate_series(1, 250) as gs on true
)
insert into documents (
  doc_type_id,
  counterparty_id,
  number,
  document_date,
  status,
  amount,
  currency_code,
  summary
)
select
  dt.id,
  ((ds.seq + dt.position * 3 - 1) % 240) + 1,
  format('%s-%s-%s', dt.code, to_char(date '2026-01-01' + ((ds.seq - 1) % 90), 'YYMMDD'), lpad(ds.seq::text, 4, '0')),
  date '2026-01-01' + ((ds.seq - 1) % 90),
  ds.status,
  case dt.code
    when 'INV' then round((80000 + ds.seq * 137.25)::numeric, 2)
    when 'ACT' then round((30000 + ds.seq * 84.10)::numeric, 2)
    when 'PO' then round((80000 + ds.seq * 137.25)::numeric, 2)
    when 'GRN' then round((45000 + ds.seq * 92.80)::numeric, 2)
  end,
  'RUB',
  ds.summary
from doc_series ds
join doc_types dt on dt.code = ds.code;

insert into document_nodes (document_id, parent_id, doc_type_node_id, position)
select d.id, null, dtn.id, dtn.position
from documents d
join doc_types dt on dt.id = d.doc_type_id
join doc_type_nodes dtn on dtn.doc_type_id = dt.id and dtn.parent_id is null;

insert into document_nodes (document_id, parent_id, doc_type_node_id, position)
select
  d.id,
  parent_dn.id,
  child_dtn.id,
  gs
from documents d
join doc_types dt on dt.id = d.doc_type_id
join doc_type_nodes parent_dtn on parent_dtn.doc_type_id = dt.id and parent_dtn.parent_id is null
join document_nodes parent_dn on parent_dn.document_id = d.id and parent_dn.doc_type_node_id = parent_dtn.id
join doc_type_nodes child_dtn on child_dtn.parent_id = parent_dtn.id
join lateral generate_series(
  1,
  case dt.code
    when 'INV' then 2 + (d.id % 4)
    when 'ACT' then 2 + (d.id % 3)
    when 'GRN' then 2 + (d.id % 5)
    else 0
  end
) as gs on parent_dtn.key in ('lines', 'services', 'materials');

insert into document_node_attributes (
  document_node_id,
  name,
  value,
  value_date,
  value_int,
  value_double,
  value_boolean,
  position
)
select
  dn.id,
  a.name,
  a.value,
  a.value_date,
  a.value_int,
  a.value_double,
  a.value_boolean,
  a.position
from document_nodes dn
join doc_type_nodes dtn on dtn.id = dn.doc_type_node_id
join documents d on d.id = dn.document_id
join doc_types dt on dt.id = d.doc_type_id
join counterparties c on c.id = d.counterparty_id
join lateral (
  select *
  from (
    values
      (
        'header',
        'Organization',
        'Demo Import LLC',
        null::date,
        null::bigint,
        null::double precision,
        null::boolean,
        10
      ),
      (
        'header',
        'Warehouse',
        case when d.id % 2 = 0 then 'Main warehouse' else 'Reserve warehouse' end,
        null::date,
        null::bigint,
        null::double precision,
        null::boolean,
        20
      ),
      (
        'header',
        'Basis',
        format('Supply agreement No. %s/%s', 40 + (d.id % 60), extract(year from d.document_date)::int),
        null::date,
        null::bigint,
        null::double precision,
        null::boolean,
        30
      ),
      (
        'lines',
        'Rows',
        (2 + (d.id % 4))::text,
        null::date,
        (2 + (d.id % 4))::bigint,
        null::double precision,
        null::boolean,
        10
      ),
      (
        'totals',
        'Amount before VAT',
        to_char(round(d.amount / 1.2, 2), 'FM9999999990.00') || ' RUB',
        null::date,
        null::bigint,
        round((d.amount / 1.2)::numeric, 2)::double precision,
        null::boolean,
        10
      ),
      (
        'totals',
        'VAT',
        to_char(round(d.amount - (d.amount / 1.2), 2), 'FM9999999990.00') || ' RUB',
        null::date,
        null::bigint,
        round((d.amount - (d.amount / 1.2))::numeric, 2)::double precision,
        null::boolean,
        20
      ),
      (
        'totals',
        'Grand total',
        to_char(d.amount, 'FM9999999990.00') || ' RUB',
        null::date,
        null::bigint,
        d.amount::double precision,
        null::boolean,
        30
      ),
      (
        'contract',
        'Agreement',
        format('No. %s-IT dated %s', 100 + (d.id % 80), to_char(d.document_date - 14, 'YYYY-MM-DD')),
        null::date,
        null::bigint,
        null::double precision,
        null::boolean,
        10
      ),
      (
        'contract',
        'Period',
        to_char(d.document_date - 14, 'YYYY-MM-DD') || ' - ' || to_char(d.document_date, 'YYYY-MM-DD'),
        d.document_date - 14,
        null::bigint,
        null::double precision,
        null::boolean,
        20
      ),
      (
        'contract',
        'Owner',
        case when d.id % 2 = 0 then 'Project office' else 'Delivery team' end,
        null::date,
        null::bigint,
        null::double precision,
        null::boolean,
        30
      ),
      (
        'services',
        'Services',
        (2 + (d.id % 3))::text,
        null::date,
        (2 + (d.id % 3))::bigint,
        null::double precision,
        null::boolean,
        10
      ),
      (
        'payment',
        'Payer account',
        '40702810900000010293',
        null::date,
        null::bigint,
        null::double precision,
        null::boolean,
        10
      ),
      (
        'payment',
        'Bank BIC',
        '044525225',
        null::date,
        null::bigint,
        null::double precision,
        null::boolean,
        20
      ),
      (
        'payment',
        'Priority',
        '5',
        null::date,
        5::bigint,
        null::double precision,
        null::boolean,
        30
      ),
      (
        'payment',
        'Payment mode',
        case when d.id % 3 = 0 then 'Urgent electronic' else 'Electronic' end,
        null::date,
        null::bigint,
        null::double precision,
        null::boolean,
        40
      ),
      (
        'purpose',
        'Text',
        format(
          'Settlement for %s document %s dated %s for %s.',
          split_part(d.number, '-', 1),
          d.number,
          to_char(d.document_date, 'YYYY-MM-DD'),
          c.name
        ),
        null::date,
        null::bigint,
        null::double precision,
        null::boolean,
        10
      ),
      (
        'purpose',
        'Budget code',
        'Not applicable',
        null::date,
        null::bigint,
        null::double precision,
        null::boolean,
        20
      ),
      (
        'warehouse',
        'Warehouse',
        case when d.id % 2 = 0 then 'Service department warehouse' else 'Main warehouse' end,
        null::date,
        null::bigint,
        null::double precision,
        null::boolean,
        10
      ),
      (
        'warehouse',
        'Responsible person',
        case when d.id % 2 = 0 then 'P. M. Kiselev' else 'A. V. Ivanov' end,
        null::date,
        null::bigint,
        null::double precision,
        null::boolean,
        20
      ),
      (
        'warehouse',
        'Supplier document',
        format('TORG-12 No. %s', 500 + (d.id % 400)),
        null::date,
        null::bigint,
        null::double precision,
        null::boolean,
        30
      ),
      (
        'materials',
        'Items',
        (2 + (d.id % 5))::text,
        null::date,
        (2 + (d.id % 5))::bigint,
        null::double precision,
        null::boolean,
        10
      )
  ) as v(node_key, name, value, value_date, value_int, value_double, value_boolean, position)
) as a on a.node_key = dtn.key
;

insert into document_node_attributes (
  document_node_id,
  name,
  value,
  value_date,
  value_int,
  value_double,
  value_boolean,
  position
)
select
  child_dn.id,
  attr.name,
  attr.value,
  attr.value_date,
  attr.value_int,
  attr.value_double,
  attr.value_boolean,
  attr.position
from document_nodes child_dn
join doc_type_nodes child_dtn on child_dtn.id = child_dn.doc_type_node_id
join document_nodes parent_dn on parent_dn.id = child_dn.parent_id
join doc_type_nodes parent_dtn on parent_dtn.id = parent_dn.doc_type_node_id
join documents d on d.id = child_dn.document_id
join lateral (
  select *
  from (
    values
      (
        'line',
        'Item',
        case child_dn.position % 5
          when 1 then 'ThinkBook 14 laptop'
          when 2 then '24-inch monitor'
          when 3 then 'Wireless keyboard set'
          when 4 then 'USB-C docking station'
          else 'Network printer'
        end,
        null::date,
        null::bigint,
        null::double precision,
        null::boolean,
        10
      ),
      (
        'line',
        'Quantity',
        (1 + ((d.id + child_dn.position) % 7))::text || ' pcs',
        null::date,
        (1 + ((d.id + child_dn.position) % 7))::bigint,
        null::double precision,
        null::boolean,
        20
      ),
      (
        'line',
        'Price',
        to_char(round((3500 + (d.id % 50) * 125 + child_dn.position * 210)::numeric, 2), 'FM9999999990.00') || ' RUB',
        null::date,
        null::bigint,
        round((3500 + (d.id % 50) * 125 + child_dn.position * 210)::numeric, 2)::double precision,
        null::boolean,
        30
      ),
      (
        'line',
        'VAT rate',
        case when child_dn.position % 4 = 0 then '10%' else '20%' end,
        null::date,
        null::bigint,
        null::double precision,
        null::boolean,
        40
      ),
      (
        'service',
        'Hours',
        (4 + ((d.id + child_dn.position) % 9))::text,
        null::date,
        (4 + ((d.id + child_dn.position) % 9))::bigint,
        null::double precision,
        null::boolean,
        10
      ),
      (
        'service',
        'Rate',
        to_char(round((1800 + (child_dn.position * 250))::numeric, 2), 'FM9999999990.00') || ' RUB',
        null::date,
        null::bigint,
        round((1800 + (child_dn.position * 250))::numeric, 2)::double precision,
        null::boolean,
        20
      ),
      (
        'material',
        'Quantity',
        case child_dn.position % 4
          when 1 then (100 + child_dn.position * 25)::text || ' m'
          when 2 then (5 + child_dn.position)::text || ' rolls'
          when 3 then (10 + child_dn.position)::text || ' packs'
          else (2 + child_dn.position)::text || ' boxes'
        end,
        null::date,
        case child_dn.position % 4
          when 1 then (100 + child_dn.position * 25)::bigint
          when 2 then (5 + child_dn.position)::bigint
          when 3 then (10 + child_dn.position)::bigint
          else (2 + child_dn.position)::bigint
        end,
        null::double precision,
        null::boolean,
        10
      ),
      (
        'material',
        'Price',
        to_char(round((62 + (child_dn.position * 48) + (d.id % 17) * 3.5)::numeric, 2), 'FM9999999990.00') || ' RUB',
        null::date,
        null::bigint,
        round((62 + (child_dn.position * 48) + (d.id % 17) * 3.5)::numeric, 2)::double precision,
        null::boolean,
        20
      )
  ) as v(node_key, name, value, value_date, value_int, value_double, value_boolean, position)
) as attr on attr.node_key = child_dtn.key;

commit;
