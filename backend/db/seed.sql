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
  (1, 1, 220.00, 156.20, '2026-07-01 10:00:00'),
  (1, 4, 18.00, 19.80, '2026-07-03 14:00:00'),
  (2, 1, 90.00, 63.90, '2026-07-02 11:00:00'),
  (3, 3, 800.00, 120.00, '2026-07-04 09:30:00'),
  (4, 2, 75.00, 201.00, '2026-07-05 17:00:00'),
  (4, 1, 310.00, 220.10, '2026-07-06 12:00:00');

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
