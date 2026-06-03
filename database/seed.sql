INSERT INTO departments (name, slug) VALUES
  ('School of Engineering', 'engineering'),
  ('School of Business', 'business'),
  ('School of Information Technology', 'it'),
  ('School of Health Sciences', 'health-sciences')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO courses (department_id, name, code, slug) VALUES
  (1, 'Civil Engineering', 'CIV101', 'civil-engineering'),
  (1, 'Electrical Engineering', 'ELE201', 'electrical-engineering'),
  (1, 'Mechanical Engineering', 'MEC301', 'mechanical-engineering'),
  (2, 'Business Administration', 'BUS101', 'business-administration'),
  (2, 'Accounting', 'ACC201', 'accounting'),
  (2, 'Marketing', 'MKT301', 'marketing'),
  (3, 'Computer Science', 'CS101', 'computer-science'),
  (3, 'Information Systems', 'IS201', 'information-systems'),
  (3, 'Software Engineering', 'SE301', 'software-engineering'),
  (4, 'Nursing', 'NUR101', 'nursing'),
  (4, 'Public Health', 'PH201', 'public-health')
ON CONFLICT (department_id, code) DO NOTHING;

INSERT INTO users (name, email, password_hash, role) VALUES
  ('System Admin', 'admin@zut.edu.zm', '$2a$10$IO8J5uz1crHH.dqJVPRV1.LnI4VxIfDe9MV1/4x.l7JSetHLt/7Hu', 'admin'),
  ('Dr. Lecturer', 'lecturer@zut.edu.zm', '$2a$10$IO8J5uz1crHH.dqJVPRV1.LnI4VxIfDe9MV1/4x.l7JSetHLt/7Hu', 'lecturer'),
  ('Student User', 'student@zut.edu.zm', '$2a$10$IO8J5uz1crHH.dqJVPRV1.LnI4VxIfDe9MV1/4x.l7JSetHLt/7Hu', 'student')
ON CONFLICT (email) DO NOTHING;
