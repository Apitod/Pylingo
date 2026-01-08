-- PyLingo Sample Seed Data
-- Run after schema.sql

-- =============================================
-- COURSE: Python Fundamentals
-- =============================================
INSERT INTO courses (id, title, description, image_url, order_index) VALUES
('11111111-1111-1111-1111-111111111111', 'Python Fundamentals', 'Learn the basics of Python programming from scratch', '/images/python-fundamentals.png', 1);

-- =============================================
-- UNITS
-- =============================================
INSERT INTO units (id, course_id, title, description, order_index, color) VALUES
('22222222-2222-2222-2222-222222222221', '11111111-1111-1111-1111-111111111111', 'Getting Started', 'Introduction to Python and your first program', 1, '#58CC02'),
('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Variables & Types', 'Understanding data types and variables', 2, '#CE82FF'),
('22222222-2222-2222-2222-222222222223', '11111111-1111-1111-1111-111111111111', 'Control Flow', 'If statements, loops, and logic', 3, '#00CD9C');

-- =============================================
-- LESSONS
-- =============================================
-- Unit 1: Getting Started
INSERT INTO lessons (id, unit_id, title, order_index, xp_reward) VALUES
('33333333-3333-3333-3333-333333333331', '22222222-2222-2222-2222-222222222221', 'Hello World', 1, 10),
('33333333-3333-3333-3333-333333333332', '22222222-2222-2222-2222-222222222221', 'Print Statements', 2, 10),
('33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222221', 'Comments', 3, 10);

-- Unit 2: Variables & Types
INSERT INTO lessons (id, unit_id, title, order_index, xp_reward) VALUES
('33333333-3333-3333-3333-333333333341', '22222222-2222-2222-2222-222222222222', 'Variables Intro', 1, 15),
('33333333-3333-3333-3333-333333333342', '22222222-2222-2222-2222-222222222222', 'Numbers', 2, 15),
('33333333-3333-3333-3333-333333333343', '22222222-2222-2222-2222-222222222222', 'Strings', 3, 15);

-- =============================================
-- CHALLENGES
-- =============================================
-- Lesson: Hello World
INSERT INTO challenges (id, lesson_id, type, question, options, correct_answer, order_index) VALUES
('44444444-4444-4444-4444-444444444441', '33333333-3333-3333-3333-333333333331', 'SELECT', 
 'What is the correct way to print "Hello World" in Python?',
 '[{"id": 1, "text": "print(\"Hello World\")", "imageSrc": null}, {"id": 2, "text": "echo \"Hello World\"", "imageSrc": null}, {"id": 3, "text": "console.log(\"Hello World\")", "imageSrc": null}, {"id": 4, "text": "printf(\"Hello World\")", "imageSrc": null}]',
 'print("Hello World")', 1),

('44444444-4444-4444-4444-444444444442', '33333333-3333-3333-3333-333333333331', 'SELECT',
 'Python is a...',
 '[{"id": 1, "text": "Low-level language", "imageSrc": null}, {"id": 2, "text": "High-level language", "imageSrc": null}, {"id": 3, "text": "Machine language", "imageSrc": null}, {"id": 4, "text": "Assembly language", "imageSrc": null}]',
 'High-level language', 2),

('44444444-4444-4444-4444-444444444443', '33333333-3333-3333-3333-333333333331', 'FILL_BLANK',
 'Complete the code to print "Welcome": ___("Welcome")',
 '{"sentence": "_____(\"Welcome\")", "blank_index": 0, "hints": ["pr", "pri", "prin"]}',
 'print', 3),

('44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333331', 'SELECT',
 'Which file extension is used for Python files?',
 '[{"id": 1, "text": ".python", "imageSrc": null}, {"id": 2, "text": ".py", "imageSrc": null}, {"id": 3, "text": ".pyt", "imageSrc": null}, {"id": 4, "text": ".p", "imageSrc": null}]',
 '.py', 4);

-- Lesson: Print Statements
INSERT INTO challenges (id, lesson_id, type, question, options, correct_answer, order_index) VALUES
('44444444-4444-4444-4444-444444444451', '33333333-3333-3333-3333-333333333332', 'SELECT',
 'What will print(1 + 1) output?',
 '[{"id": 1, "text": "1 + 1", "imageSrc": null}, {"id": 2, "text": "2", "imageSrc": null}, {"id": 3, "text": "11", "imageSrc": null}, {"id": 4, "text": "Error", "imageSrc": null}]',
 '2', 1),

('44444444-4444-4444-4444-444444444452', '33333333-3333-3333-3333-333333333332', 'SELECT',
 'Which is correct to print multiple items?',
 '[{"id": 1, "text": "print(\"Hello\", \"World\")", "imageSrc": null}, {"id": 2, "text": "print \"Hello\" + \"World\"", "imageSrc": null}, {"id": 3, "text": "print[\"Hello\", \"World\"]", "imageSrc": null}, {"id": 4, "text": "print{\"Hello\", \"World\"}", "imageSrc": null}]',
 'print("Hello", "World")', 2),

('44444444-4444-4444-4444-444444444453', '33333333-3333-3333-3333-333333333332', 'FILL_BLANK',
 'Fill in: print("Score:", ___)',
 '{"sentence": "print(\"Score:\", ___)", "blank_index": 1, "hints": ["1", "10", "100"]}',
 '100', 3);

-- Lesson: Variables Intro
INSERT INTO challenges (id, lesson_id, type, question, options, correct_answer, order_index) VALUES
('44444444-4444-4444-4444-444444444461', '33333333-3333-3333-3333-333333333341', 'SELECT',
 'Which is a valid variable name in Python?',
 '[{"id": 1, "text": "my_variable", "imageSrc": null}, {"id": 2, "text": "1variable", "imageSrc": null}, {"id": 3, "text": "my-variable", "imageSrc": null}, {"id": 4, "text": "class", "imageSrc": null}]',
 'my_variable', 1),

('44444444-4444-4444-4444-444444444462', '33333333-3333-3333-3333-333333333341', 'SELECT',
 'How do you assign the value 5 to a variable x?',
 '[{"id": 1, "text": "x = 5", "imageSrc": null}, {"id": 2, "text": "int x = 5", "imageSrc": null}, {"id": 3, "text": "x := 5", "imageSrc": null}, {"id": 4, "text": "var x = 5", "imageSrc": null}]',
 'x = 5', 2),

('44444444-4444-4444-4444-444444444463', '33333333-3333-3333-3333-333333333341', 'FILL_BLANK',
 'Create a variable: name ___ "Alice"',
 '{"sentence": "name ___ \"Alice\"", "blank_index": 1, "hints": ["=", "==", ":"]}',
 '=', 3),

('44444444-4444-4444-4444-444444444464', '33333333-3333-3333-3333-333333333341', 'SELECT',
 'Variables in Python are...',
 '[{"id": 1, "text": "Statically typed", "imageSrc": null}, {"id": 2, "text": "Dynamically typed", "imageSrc": null}, {"id": 3, "text": "Not typed", "imageSrc": null}, {"id": 4, "text": "Strongly typed only", "imageSrc": null}]',
 'Dynamically typed', 4);
