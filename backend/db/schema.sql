create database if not exists ecosphere;
use ecosphere;

set foreign_key_checks = 0;

drop table if exists reward_redemptions;
drop table if exists environmental_goals;
drop table if exists employee_badges;
drop table if exists policy_acknowledgements;
drop table if exists participation;
drop table if exists carbon_transactions;
drop table if exists rewards;
drop table if exists badges;
drop table if exists policies;
drop table if exists csr_activities;
drop table if exists emission_factors;
drop table if exists employees;
drop table if exists departments;

set foreign_key_checks = 1;

create table departments (
  id bigint unsigned not null auto_increment,
  name varchar(120) not null,
  code varchar(20) not null,
  status enum('active', 'inactive') not null default 'active',
  primary key (id),
  unique key uq_departments_code (code)
);

create table employees (
  id bigint unsigned not null auto_increment,
  name varchar(160) not null,
  email varchar(190) not null,
  department_id bigint unsigned not null,
  points int not null default 0,
  role enum('employee', 'admin') not null default 'employee',
  primary key (id),
  unique key uq_employees_email (email),
  key idx_employees_department (department_id),
  constraint fk_employees_department
    foreign key (department_id) references departments(id)
);

create table emission_factors (
  id bigint unsigned not null auto_increment,
  activity_type varchar(120) not null,
  unit varchar(40) not null,
  co2_per_unit decimal(12,4) not null,
  primary key (id),
  constraint chk_emission_factor_positive check (co2_per_unit > 0)
);

create table carbon_transactions (
  id bigint unsigned not null auto_increment,
  department_id bigint unsigned not null,
  emission_factor_id bigint unsigned not null,
  quantity decimal(12,2) not null,
  co2_calculated decimal(12,2) not null,
  txn_date datetime not null default current_timestamp,
  primary key (id),
  key idx_carbon_department (department_id),
  key idx_carbon_factor (emission_factor_id),
  constraint fk_carbon_department
    foreign key (department_id) references departments(id),
  constraint fk_carbon_factor
    foreign key (emission_factor_id) references emission_factors(id),
  constraint chk_carbon_quantity_positive check (quantity > 0),
  constraint chk_carbon_co2_non_negative check (co2_calculated >= 0)
);

create table environmental_goals (
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

create table csr_activities (
  id bigint unsigned not null auto_increment,
  title varchar(180) not null,
  category varchar(80) not null,
  description text,
  department_id bigint unsigned null,
  points_reward int not null,
  status enum('active', 'inactive') not null default 'active',
  created_at datetime not null default current_timestamp,
  primary key (id),
  key idx_activities_department (department_id),
  constraint fk_activities_department
    foreign key (department_id) references departments(id),
  constraint chk_activity_points_positive check (points_reward > 0)
);

create table participation (
  id bigint unsigned not null auto_increment,
  employee_id bigint unsigned not null,
  activity_id bigint unsigned not null,
  proof text,
  status enum('pending', 'approved', 'rejected') not null default 'pending',
  points_awarded int not null default 0,
  created_at datetime not null default current_timestamp,
  primary key (id),
  key idx_participation_employee (employee_id),
  key idx_participation_activity (activity_id),
  key idx_participation_status (status),
  constraint fk_participation_employee
    foreign key (employee_id) references employees(id),
  constraint fk_participation_activity
    foreign key (activity_id) references csr_activities(id),
  constraint chk_participation_points_non_negative check (points_awarded >= 0)
);

create table policies (
  id bigint unsigned not null auto_increment,
  title varchar(180) not null,
  description text not null,
  status enum('active', 'inactive') not null default 'active',
  created_at datetime not null default current_timestamp,
  primary key (id)
);

create table policy_acknowledgements (
  id bigint unsigned not null auto_increment,
  employee_id bigint unsigned not null,
  policy_id bigint unsigned not null,
  acknowledged_at datetime not null default current_timestamp,
  primary key (id),
  unique key uq_policy_ack_employee_policy (employee_id, policy_id),
  key idx_policy_ack_policy (policy_id),
  constraint fk_policy_ack_employee
    foreign key (employee_id) references employees(id) on delete cascade,
  constraint fk_policy_ack_policy
    foreign key (policy_id) references policies(id) on delete cascade
);

create table badges (
  id bigint unsigned not null auto_increment,
  name varchar(120) not null,
  description text,
  icon varchar(40) not null default 'badge',
  unlock_type enum('points_threshold', 'participation_count') not null,
  unlock_value int not null,
  primary key (id),
  constraint chk_badge_unlock_positive check (unlock_value > 0)
);

create table employee_badges (
  employee_id bigint unsigned not null,
  badge_id bigint unsigned not null,
  awarded_at datetime not null default current_timestamp,
  primary key (employee_id, badge_id),
  key idx_employee_badges_badge (badge_id),
  constraint fk_employee_badges_employee
    foreign key (employee_id) references employees(id) on delete cascade,
  constraint fk_employee_badges_badge
    foreign key (badge_id) references badges(id) on delete cascade
);

create table rewards (
  id bigint unsigned not null auto_increment,
  name varchar(160) not null,
  description text,
  points_required int not null,
  stock int not null,
  status enum('active', 'inactive') not null default 'active',
  primary key (id),
  constraint chk_reward_points_positive check (points_required > 0),
  constraint chk_reward_stock_non_negative check (stock >= 0)
);

create table reward_redemptions (
  id bigint unsigned not null auto_increment,
  employee_id bigint unsigned not null,
  reward_id bigint unsigned not null,
  points_spent int not null,
  redeemed_at datetime not null default current_timestamp,
  primary key (id),
  key idx_redemptions_employee (employee_id),
  key idx_redemptions_reward (reward_id),
  constraint fk_redemptions_employee
    foreign key (employee_id) references employees(id),
  constraint fk_redemptions_reward
    foreign key (reward_id) references rewards(id),
  constraint chk_redemption_points_positive check (points_spent > 0)
);
