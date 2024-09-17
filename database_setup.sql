
DROP DATABASE IF EXISTS school_management;

CREATE DATABASE school_management;

USE school_management;


CREATE TABLE course (
  CourseID VARCHAR(10) PRIMARY KEY,
  CourseName VARCHAR(100) NOT NULL,
  LecturerID VARCHAR(10)
);

CREATE TABLE student (
  StudentID VARCHAR(10) PRIMARY KEY,
  Name VARCHAR(100) NOT NULL
);

CREATE TABLE lecturer(
  LecturerID VARCHAR(10) PRIMARY KEY,
  Name VARCHAR(100) NOT NULL
);

CREATE TABLE enroll (
  EnrollmentID INT PRIMARY KEY AUTO_INCREMENT,
  CourseID VARCHAR(10),
  StudentID VARCHAR(10),
  FOREIGN KEY (CourseID) REFERENCES course(CourseID),
  FOREIGN KEY (StudentID) REFERENCES student(StudentID)
);

CREATE TABLE admin(
  ID VARCHAR(20) PRIMARY KEY,
  Password VARCHAR(255)
);

-- Insert students
INSERT INTO student (StudentID, Name) VALUES ('6001', 'Lukas Mueller');
INSERT INTO student (StudentID, Name) VALUES ('6002', 'Sophie Dupont');
INSERT INTO student (StudentID, Name) VALUES ('6003', 'John Smith');
INSERT INTO student (StudentID, Name) VALUES ('6004', 'Emma Bauer');
INSERT INTO student (StudentID, Name) VALUES ('6005', 'Marie Lefevre');
INSERT INTO student (StudentID, Name) VALUES ('6006', 'Thomas Schmidt');
INSERT INTO student (StudentID, Name) VALUES ('6007', 'David Johnson');
INSERT INTO student (StudentID, Name) VALUES ('6008', 'Isabella Wagner');
INSERT INTO student (StudentID, Name) VALUES ('6009', 'Claire Martin');
INSERT INTO student (StudentID, Name) VALUES ('6010', 'Michael Brown');
INSERT INTO student (StudentID, Name) VALUES ('6011', 'Hannah Fischer');
INSERT INTO student (StudentID, Name) VALUES ('6012', 'Louis Dubois');
INSERT INTO student (StudentID, Name) VALUES ('6013', 'Emily Davis');
INSERT INTO student (StudentID, Name) VALUES ('6014', 'Jurgen Meyer');
INSERT INTO student (StudentID, Name) VALUES ('6015', 'Chloe Moreau');
INSERT INTO student (StudentID, Name) VALUES ('6016', 'Jacob Wilson');
INSERT INTO student (StudentID, Name) VALUES ('6017', 'Stefanie Weber');
INSERT INTO student (StudentID, Name) VALUES ('6018', 'Elodie Lambert');
INSERT INTO student (StudentID, Name) VALUES ('6019', 'James Taylor');
INSERT INTO student (StudentID, Name) VALUES ('6020', 'Laura Hoffmann');
INSERT INTO student (StudentID, Name) VALUES ('6021', 'Camille Petit');
INSERT INTO student (StudentID, Name) VALUES ('6022', 'William Anderson');
INSERT INTO student (StudentID, Name) VALUES ('6023', 'Karl Schulz');
INSERT INTO student (StudentID, Name) VALUES ('6024', 'Sophie Blanc');
INSERT INTO student (StudentID, Name) VALUES ('6025', 'Oliver Harris');
INSERT INTO student (StudentID, Name) VALUES ('6026', 'Leonie Keller');
INSERT INTO student (StudentID, Name) VALUES ('6027', 'Nicolas Girard');
INSERT INTO student (StudentID, Name) VALUES ('6028', 'Henry Clark');
INSERT INTO student (StudentID, Name) VALUES ('6029', 'Anna Richter');
INSERT INTO student (StudentID, Name) VALUES ('6030', 'Juliette Robert');
INSERT INTO student (StudentID, Name) VALUES ('6031', 'Charles Moore');
INSERT INTO student (StudentID, Name) VALUES ('6032', 'Maximilian Wolf');
INSERT INTO student (StudentID, Name) VALUES ('6033', 'Alice Leroy');
INSERT INTO student (StudentID, Name) VALUES ('6034', 'Samuel Martinez');
INSERT INTO student (StudentID, Name) VALUES ('6035', 'Nina Becker');
INSERT INTO student (StudentID, Name) VALUES ('6036', 'Lucas Martin');
INSERT INTO student (StudentID, Name) VALUES ('6037', 'Sarah Robinson');
INSERT INTO student (StudentID, Name) VALUES ('6038', 'Johannes Schneider');
INSERT INTO student (StudentID, Name) VALUES ('6039', 'Louise Laurent');
INSERT INTO student (StudentID, Name) VALUES ('6040', 'Daniel King');
INSERT INTO student (StudentID, Name) VALUES ('6041', 'Lea Zimmermann');
INSERT INTO student (StudentID, Name) VALUES ('6042', 'Mathieu Bernard');
INSERT INTO student (StudentID, Name) VALUES ('6043', 'Charlotte Scott');
INSERT INTO student (StudentID, Name) VALUES ('6044', 'Tim Lehmann');
INSERT INTO student (StudentID, Name) VALUES ('6045', 'Victor Richard');
INSERT INTO student (StudentID, Name) VALUES ('6046', 'Elizabeth White');
INSERT INTO student (StudentID, Name) VALUES ('6047', 'Tobias Krause');
INSERT INTO student (StudentID, Name) VALUES ('6048', 'Emilie Dupuis');
INSERT INTO student (StudentID, Name) VALUES ('6049', 'Alexander Thompson');
INSERT INTO student (StudentID, Name) VALUES ('6050', 'Mia Hoffmann');
INSERT INTO student (StudentID, Name) VALUES ('6051', 'Marc Dubois');
INSERT INTO student (StudentID, Name) VALUES ('6052', 'Andrew Garcia');
INSERT INTO student (StudentID, Name) VALUES ('6053', 'Katharina Klein');
INSERT INTO student (StudentID, Name) VALUES ('6054', 'Antoine Lefevre');
INSERT INTO student (StudentID, Name) VALUES ('6055', 'Christopher Lee');
INSERT INTO student (StudentID, Name) VALUES ('6056', 'Miriam Wagner');
INSERT INTO student (StudentID, Name) VALUES ('6057', 'Julien Fontaine');
INSERT INTO student (StudentID, Name) VALUES ('6058', 'Matthew Walker');
INSERT INTO student (StudentID, Name) VALUES ('6059', 'Julia Neumann');
INSERT INTO student (StudentID, Name) VALUES ('6060', 'Gabriel Perrin');
INSERT INTO student (StudentID, Name) VALUES ('6061', 'George Hall');
INSERT INTO student (StudentID, Name) VALUES ('6062', 'Sandra Braun');
INSERT INTO student (StudentID, Name) VALUES ('6063', 'Jules Rousseau');
INSERT INTO student (StudentID, Name) VALUES ('6064', 'Joseph Young');
INSERT INTO student (StudentID, Name) VALUES ('6065', 'Nadine Vogel');
INSERT INTO student (StudentID, Name) VALUES ('6066', 'Pierre Simon');
INSERT INTO student (StudentID, Name) VALUES ('6067', 'Patrick Allen');
INSERT INTO student (StudentID, Name) VALUES ('6068', 'Clara Schulz');
INSERT INTO student (StudentID, Name) VALUES ('6069', 'Aurelien Lucas');
INSERT INTO student (StudentID, Name) VALUES ('6070', 'Anthony Hernandez');
INSERT INTO student (StudentID, Name) VALUES ('6071', 'Theresa Kruger');
INSERT INTO student (StudentID, Name) VALUES ('6072', 'Pauline Brun');
INSERT INTO student (StudentID, Name) VALUES ('6073', 'Kevin Baker');
INSERT INTO student (StudentID, Name) VALUES ('6074', 'Kerstin Lange');
INSERT INTO student (StudentID, Name) VALUES ('6075', 'Hugo Rey');
INSERT INTO student (StudentID, Name) VALUES ('6076', 'Richard Adams');
INSERT INTO student (StudentID, Name) VALUES ('6077', 'Nicole Schmitt');
INSERT INTO student (StudentID, Name) VALUES ('6078', 'Thierry Lefebvre');
INSERT INTO student (StudentID, Name) VALUES ('6079', 'Brandon Gonzalez');
INSERT INTO student (StudentID, Name) VALUES ('6080', 'Sarah Seidel');
INSERT INTO student (StudentID, Name) VALUES ('6081', 'Benoit Fournier');
INSERT INTO student (StudentID, Name) VALUES ('6082', 'Robert Edwards');
INSERT INTO student (StudentID, Name) VALUES ('6083', 'Ingrid Walter');
INSERT INTO student (StudentID, Name) VALUES ('6084', 'Amelie Bouchard');
INSERT INTO student (StudentID, Name) VALUES ('6085', 'Joshua Murphy');
INSERT INTO student (StudentID, Name) VALUES ('6086', 'Melanie Klein');
INSERT INTO student (StudentID, Name) VALUES ('6087', 'Etienne Rousseau');
INSERT INTO student (StudentID, Name) VALUES ('6088', 'Justin Martinez');
INSERT INTO student (StudentID, Name) VALUES ('6089', 'Sophia Bauer');
INSERT INTO student (StudentID, Name) VALUES ('6090', 'Florent Gautier');
INSERT INTO student (StudentID, Name) VALUES ('6091', 'Jason Wilson');
INSERT INTO student (StudentID, Name) VALUES ('6092', 'Monika Peters');
INSERT INTO student (StudentID, Name) VALUES ('6093', 'Jean Lefevre');
INSERT INTO student (StudentID, Name) VALUES ('6094', 'Benjamin Wright');
INSERT INTO student (StudentID, Name) VALUES ('6095', 'Sabine Vogel');
INSERT INTO student (StudentID, Name) VALUES ('6096', 'Yves Garnier');
INSERT INTO student (StudentID, Name) VALUES ('6097', 'Charles Parker');
INSERT INTO student (StudentID, Name) VALUES ('6098', 'Birgit Lehmann');
INSERT INTO student (StudentID, Name) VALUES ('6099', 'Rene Caron');
INSERT INTO student (StudentID, Name) VALUES ('6100', 'Diane Hughes');
INSERT INTO student (StudentID, Name) VALUES ('6101', 'Frank Zimmer');
INSERT INTO student (StudentID, Name) VALUES ('6102', 'Claire Duval');
INSERT INTO student (StudentID, Name) VALUES ('6103', 'Michael Carter');

-- Insert lecturers
INSERT INTO lecturer (LecturerID, Name) VALUES ('5001', 'Amanda Turner');
INSERT INTO lecturer (LecturerID, Name) VALUES ('5002', 'Brian Harris');
INSERT INTO lecturer (LecturerID, Name) VALUES ('5003', 'Cecilia Wong');
INSERT INTO lecturer (LecturerID, Name) VALUES ('5004', 'David Mitchell');
INSERT INTO lecturer (LecturerID, Name) VALUES ('5005', 'Emily Clarke');
INSERT INTO lecturer (LecturerID, Name) VALUES ('5006', 'Fiona Roberts');
INSERT INTO lecturer (LecturerID, Name) VALUES ('5007', 'George Thompson');
INSERT INTO lecturer (LecturerID, Name) VALUES ('5008', 'Hannah Evans');
INSERT INTO lecturer (LecturerID, Name) VALUES ('5009', 'Ian Bennett');
INSERT INTO lecturer (LecturerID, Name) VALUES ('5010', 'Julia Martinez');

-- Insert course
INSERT INTO course (CourseID, CourseName) VALUES ('20001', 'Introduction to Data Structures');
INSERT INTO course (CourseID, CourseName) VALUES ('20002', 'Advanced Web Development');
INSERT INTO course (CourseID, CourseName) VALUES ('20003', 'Fundamentals of Artificial Intelligence');
INSERT INTO course (CourseID, CourseName) VALUES ('20004', 'Database Management Systems');
INSERT INTO course (CourseID, CourseName) VALUES ('20005', 'Software Engineering Principles');
INSERT INTO course (CourseID, CourseName) VALUES ('20006', 'Computer Networks and Security');
INSERT INTO course (CourseID, CourseName) VALUES ('20007', 'Mobile Application Development');
INSERT INTO course (CourseID, CourseName) VALUES ('20008', 'Operating Systems Concepts');
INSERT INTO course (CourseID, CourseName) VALUES ('20009', 'Machine Learning Techniques');
INSERT INTO course (CourseID, CourseName) VALUES ('20010', 'Cloud Computing Essentials');
