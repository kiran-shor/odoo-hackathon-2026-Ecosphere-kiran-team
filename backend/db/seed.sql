use ecosphere;

insert into departments (name, code) values
  ('Operations', 'OPS'),
  ('Human Resources', 'HR'),
  ('IT', 'IT'),
  ('Facilities', 'FAC');

insert into employees (name, email, department_id, points, role) values
  ('Asha Rao', 'asha@ecosphere.test', 1, 80, 'employee'),
  ('Vikram Shah', 'vikram@ecosphere.test', 1, 20, 'employee'),
  ('Priya Nair', 'priya@ecosphere.test', 2, 45, 'admin'),
  ('Rahul Mehta', 'rahul@ecosphere.test', 2, 0, 'employee'),
  ('Sana Iqbal', 'sana@ecosphere.test', 3, 150, 'employee'),
  ('Karan Malhotra', 'karan@ecosphere.test', 3, 30, 'employee'),
  ('Divya Menon', 'divya@ecosphere.test', 4, 60, 'employee'),
  ('Arjun Kapoor', 'arjun@ecosphere.test', 4, 0, 'employee');

insert into emission_factors (activity_type, unit, co2_per_unit) values
  ('Electricity', 'kWh', 0.7100),
  ('Diesel Fuel', 'Liter', 2.6800),
  ('Air Travel', 'km', 0.1500),
  ('Paper Usage', 'kg', 1.1000);

insert into carbon_transactions
  (department_id, emission_factor_id, quantity, co2_calculated, txn_date)
values
  (1, 1, 180.00, 127.80, '2026-01-12 10:00:00'),
  (2, 4, 20.00, 22.00, '2026-01-16 11:00:00'),
  (3, 3, 500.00, 75.00, '2026-01-20 09:30:00'),
  (4, 2, 55.00, 147.40, '2026-01-24 15:00:00'),
  (1, 1, 165.00, 117.15, '2026-02-10 10:00:00'),
  (2, 1, 75.00, 53.25, '2026-02-14 11:00:00'),
  (3, 4, 14.00, 15.40, '2026-02-18 09:30:00'),
  (4, 1, 280.00, 198.80, '2026-02-22 15:00:00'),
  (1, 4, 22.00, 24.20, '2026-03-09 10:00:00'),
  (2, 3, 350.00, 52.50, '2026-03-13 11:00:00'),
  (3, 1, 190.00, 134.90, '2026-03-17 09:30:00'),
  (4, 2, 48.00, 128.64, '2026-03-21 15:00:00'),
  (1, 1, 200.00, 142.00, '2026-04-08 10:00:00'),
  (2, 4, 18.00, 19.80, '2026-04-12 11:00:00'),
  (3, 3, 620.00, 93.00, '2026-04-16 09:30:00'),
  (4, 1, 260.00, 184.60, '2026-04-20 15:00:00'),
  (1, 2, 35.00, 93.80, '2026-05-07 10:00:00'),
  (2, 1, 82.00, 58.22, '2026-05-11 11:00:00'),
  (3, 4, 16.00, 17.60, '2026-05-15 09:30:00'),
  (4, 2, 52.00, 139.36, '2026-05-19 15:00:00'),
  (1, 1, 210.00, 149.10, '2026-06-06 10:00:00'),
  (2, 3, 420.00, 63.00, '2026-06-10 11:00:00'),
  (3, 1, 205.00, 145.55, '2026-06-14 09:30:00'),
  (4, 4, 25.00, 27.50, '2026-06-18 15:00:00'),
  (1, 1, 220.00, 156.20, '2026-07-01 10:00:00'),
  (1, 4, 18.00, 19.80, '2026-07-03 14:00:00'),
  (2, 1, 90.00, 63.90, '2026-07-02 11:00:00'),
  (3, 3, 800.00, 120.00, '2026-07-04 09:30:00'),
  (4, 2, 75.00, 201.00, '2026-07-05 17:00:00'),
  (4, 1, 310.00, 220.10, '2026-07-06 12:00:00');

insert into environmental_goals
  (department_id, emission_factor_id, metric_label, target_value, unit, start_date, deadline)
values
  (1, null, 'Total Carbon Emissions', 500.00, 'kg CO2e', '2026-01-01', '2026-12-31'),
  (4, 2, 'Diesel Fuel Consumption', 60.00, 'Liter', '2026-01-01', '2026-12-31'),
  (3, 3, 'Air Travel', 1000.00, 'km', '2026-01-01', '2026-12-31'),
  (2, 1, 'Electricity Usage', 500.00, 'kWh', '2026-01-01', '2026-12-31'),
  (1, 1, 'Electricity Usage', 1200.00, 'kWh', '2026-01-01', '2026-12-31'),
  (4, 1, 'Electricity Usage', 900.00, 'kWh', '2026-01-01', '2026-12-31'),
  (2, null, 'Total Carbon Emissions', 400.00, 'kg CO2e', '2026-01-01', '2026-12-31');

insert into csr_activities
  (title, category, description, department_id, points_reward)
values
  ('Tree Plantation Drive', 'Environment', 'Plant saplings around the campus', null, 50),
  ('Blood Donation Camp', 'Health', 'Company-organized donation drive', null, 40),
  ('E-Waste Collection', 'Environment', 'Collect and responsibly dispose of e-waste', 3, 30),
  ('Community Clean-up', 'Community', 'Clean up a local public space', 4, 25);

insert into participation
  (employee_id, activity_id, proof, status, points_awarded, created_at)
values
  (1, 1, 'Uploaded plantation photo', 'approved', 50, '2026-07-07 09:00:00'),
  (3, 2, 'Blood donation certificate', 'approved', 40, '2026-07-07 10:00:00'),
  (5, 3, 'E-waste receipt', 'approved', 30, '2026-07-08 11:00:00'),
  (7, 4, 'Cleanup drive photo', 'approved', 25, '2026-07-08 12:00:00'),
  (2, 1, 'Pending review photo', 'pending', 0, '2026-07-09 15:00:00');

insert into policies (title, description) values
  ('Code of Conduct', 'Standard workplace conduct expectations for all employees'),
  ('Data Privacy Policy', 'How employee and customer data must be handled'),
  ('Anti-Harassment Policy', 'Zero-tolerance policy on workplace harassment');

insert into policy_acknowledgements (employee_id, policy_id) values
  (1, 1), (1, 2), (1, 3),
  (3, 1), (3, 2),
  (5, 1), (5, 2), (5, 3),
  (7, 1);

insert into badges (name, description, icon, unlock_type, unlock_value) values
  ('Green Starter', 'Earned your first 50 points', 'leaf', 'points_threshold', 50),
  ('Sustainability Champion', 'Reached 150 ESG points', 'trophy', 'points_threshold', 150),
  ('Community Hero', 'Completed 5 approved activities', 'spark', 'participation_count', 5);

insert into employee_badges (employee_id, badge_id) values
  (1, 1),
  (5, 1),
  (5, 2),
  (7, 1);

insert into rewards (name, description, points_required, stock) values
  ('Company Merch Kit', 'Branded swag bag', 100, 20),
  ('Extra Day Off', 'One additional paid day off', 300, 5),
  ('Coffee Voucher', 'Free coffee for a week', 50, 50);
