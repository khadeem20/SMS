import fs from 'fs';

function generateSQL() {
  let sql = '';

  // Drop existing database if it exists
  sql += `
DROP DATABASE IF EXISTS school_management;

CREATE DATABASE school_management;

USE school_management;

`

  // Create tables (existing code)
  sql += `
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
  CourseID VARCHAR(10),
  StudentID VARCHAR(10),
  PRIMARY KEY (CourseID, StudentID),
  FOREIGN KEY (CourseID) REFERENCES course(CourseID),
  FOREIGN KEY (StudentID) REFERENCES student(StudentID)
);

CREATE TABLE admin(
  ID VARCHAR(20) PRIMARY KEY,
  Password VARCHAR(255)
);
`;

  // Read student names from file
  const studentData = fs.readFileSync('students.txt', 'utf8');
  const studentNames = studentData.split('\n').filter(name => name.trim() !== '');

  // Generate INSERT statements for students
  sql += '\n-- Insert students\n';
  studentNames.forEach((name, index) => {
    const studentID = `6${(index + 1).toString().padStart(3, '0')}`;
    sql += `INSERT INTO student (StudentID, Name) VALUES ('${studentID}', '${name.trim()}');\n`;
  });

   // Read Lecturer names from file
   const lecturerData = fs.readFileSync('lecturers.txt', 'utf8');
   const lecturerNames = lecturerData.split('\n').filter(name => name.trim() !== '');
 
   // Generate INSERT statements for lecturers
   sql += '\n-- Insert lecturers\n';
   lecturerNames.forEach((name, index) => {
     const lecturerID = `5${(index + 1).toString().padStart(3, '0')}`;
     sql += `INSERT INTO lecturer (LecturerID, Name) VALUES ('${lecturerID}', '${name.trim()}');\n`;
   });
 

  // Read course names from file
  const courseData = fs.readFileSync('courses.txt', 'utf8');
  const courseNames = courseData.split('\n').filter(name => name.trim() !== '');

  // Generate INSERT statements for students
  sql += '\n-- Insert course\n';
  courseNames.forEach((name, index) => {
    const courseID = `2${(index + 1).toString().padStart(4, '0')}`;
    sql += `INSERT INTO course (CourseID, CourseName) VALUES ('${courseID}', '${name.trim()}');\n`;
  });

  return sql;
}

const sqlContent = generateSQL();
fs.writeFileSync('database_setup.sql', sqlContent);
console.log('SQL file generated successfully with student, lecturer, course inserts and the empty admin table!');
