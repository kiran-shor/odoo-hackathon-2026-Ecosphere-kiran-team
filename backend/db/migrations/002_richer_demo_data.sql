use ecosphere;

insert into carbon_transactions
  (department_id, emission_factor_id, quantity, co2_calculated, txn_date)
select d.id, ef.id, source.quantity, source.co2, source.txn_date
from (
  select 'OPS' code, 'Electricity' factor, 180.00 quantity, 127.80 co2, cast('2026-01-12 10:00:00' as datetime) txn_date union all
  select 'HR', 'Paper Usage', 20.00, 22.00, '2026-01-16 11:00:00' union all
  select 'IT', 'Air Travel', 500.00, 75.00, '2026-01-20 09:30:00' union all
  select 'FAC', 'Diesel Fuel', 55.00, 147.40, '2026-01-24 15:00:00' union all
  select 'OPS', 'Electricity', 165.00, 117.15, '2026-02-10 10:00:00' union all
  select 'HR', 'Electricity', 75.00, 53.25, '2026-02-14 11:00:00' union all
  select 'IT', 'Paper Usage', 14.00, 15.40, '2026-02-18 09:30:00' union all
  select 'FAC', 'Electricity', 280.00, 198.80, '2026-02-22 15:00:00' union all
  select 'OPS', 'Paper Usage', 22.00, 24.20, '2026-03-09 10:00:00' union all
  select 'HR', 'Air Travel', 350.00, 52.50, '2026-03-13 11:00:00' union all
  select 'IT', 'Electricity', 190.00, 134.90, '2026-03-17 09:30:00' union all
  select 'FAC', 'Diesel Fuel', 48.00, 128.64, '2026-03-21 15:00:00' union all
  select 'OPS', 'Electricity', 200.00, 142.00, '2026-04-08 10:00:00' union all
  select 'HR', 'Paper Usage', 18.00, 19.80, '2026-04-12 11:00:00' union all
  select 'IT', 'Air Travel', 620.00, 93.00, '2026-04-16 09:30:00' union all
  select 'FAC', 'Electricity', 260.00, 184.60, '2026-04-20 15:00:00' union all
  select 'OPS', 'Diesel Fuel', 35.00, 93.80, '2026-05-07 10:00:00' union all
  select 'HR', 'Electricity', 82.00, 58.22, '2026-05-11 11:00:00' union all
  select 'IT', 'Paper Usage', 16.00, 17.60, '2026-05-15 09:30:00' union all
  select 'FAC', 'Diesel Fuel', 52.00, 139.36, '2026-05-19 15:00:00' union all
  select 'OPS', 'Electricity', 210.00, 149.10, '2026-06-06 10:00:00' union all
  select 'HR', 'Air Travel', 420.00, 63.00, '2026-06-10 11:00:00' union all
  select 'IT', 'Electricity', 205.00, 145.55, '2026-06-14 09:30:00' union all
  select 'FAC', 'Paper Usage', 25.00, 27.50, '2026-06-18 15:00:00'
) source
join departments d on d.code = source.code
join emission_factors ef on ef.activity_type = source.factor
where not exists (
  select 1 from carbon_transactions existing
  where existing.department_id = d.id
    and existing.emission_factor_id = ef.id
    and existing.txn_date = source.txn_date
);

insert into environmental_goals
  (department_id, emission_factor_id, metric_label, target_value, unit, start_date, deadline)
select d.id, ef.id, source.metric_label, source.target_value, source.unit, '2026-01-01', '2026-12-31'
from (
  select 'HR' code, 'Electricity' factor, 'Electricity Usage' metric_label, 500.00 target_value, 'kWh' unit union all
  select 'OPS', 'Electricity', 'Electricity Usage', 1200.00, 'kWh' union all
  select 'FAC', 'Electricity', 'Electricity Usage', 900.00, 'kWh'
) source
join departments d on d.code = source.code
join emission_factors ef on ef.activity_type = source.factor
where not exists (
  select 1 from environmental_goals existing
  where existing.department_id = d.id and existing.metric_label = source.metric_label
);

insert into environmental_goals
  (department_id, emission_factor_id, metric_label, target_value, unit, start_date, deadline)
select d.id, null, 'Total Carbon Emissions', 400.00, 'kg CO2e', '2026-01-01', '2026-12-31'
from departments d
where d.code = 'HR'
  and not exists (
    select 1 from environmental_goals existing
    where existing.department_id = d.id and existing.metric_label = 'Total Carbon Emissions'
  );
