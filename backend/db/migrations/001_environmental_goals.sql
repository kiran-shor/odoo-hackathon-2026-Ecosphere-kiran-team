use ecosphere;

create table if not exists environmental_goals (
  id bigint unsigned not null auto_increment,
  department_id bigint unsigned not null,
  emission_factor_id bigint unsigned null,
  metric_label varchar(180) not null,
  target_value decimal(14,2) not null,
  unit varchar(40) not null,
  start_date date not null,
  deadline date not null,
  status enum('active', 'inactive') not null default 'active',
  created_at datetime not null default current_timestamp,
  primary key (id),
  key idx_goals_department (department_id),
  key idx_goals_factor (emission_factor_id),
  constraint fk_goals_department foreign key (department_id) references departments(id),
  constraint fk_goals_factor foreign key (emission_factor_id) references emission_factors(id),
  constraint chk_goal_target_positive check (target_value > 0),
  constraint chk_goal_dates check (deadline >= start_date)
);

insert into environmental_goals
  (department_id, emission_factor_id, metric_label, target_value, unit, start_date, deadline)
select d.id, null, 'Total Carbon Emissions', 500.00, 'kg CO2e', '2026-01-01', '2026-12-31'
from departments d
where d.code = 'OPS'
  and not exists (select 1 from environmental_goals where metric_label = 'Total Carbon Emissions' and department_id = d.id);

insert into environmental_goals
  (department_id, emission_factor_id, metric_label, target_value, unit, start_date, deadline)
select d.id, ef.id, 'Diesel Fuel Consumption', 60.00, ef.unit, '2026-01-01', '2026-12-31'
from departments d join emission_factors ef on ef.activity_type = 'Diesel Fuel'
where d.code = 'FAC'
  and not exists (select 1 from environmental_goals where metric_label = 'Diesel Fuel Consumption' and department_id = d.id);

insert into environmental_goals
  (department_id, emission_factor_id, metric_label, target_value, unit, start_date, deadline)
select d.id, ef.id, 'Air Travel', 1000.00, ef.unit, '2026-01-01', '2026-12-31'
from departments d join emission_factors ef on ef.activity_type = 'Air Travel'
where d.code = 'IT'
  and not exists (select 1 from environmental_goals where metric_label = 'Air Travel' and department_id = d.id);
