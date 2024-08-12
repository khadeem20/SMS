import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user:  process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database:  process.env.MYSQL_DATABASE
}).promise()

async function login() {
    pool.query()
}

async function AllStudents(){
    const students = await pool.query("SELECT * FROM student;");
    return students;
}
async function AddStudent(sid, sname){
    const newStudent = await pool.query("INSERT INTO student(StudentID, Name) VALUES(${sid}, ${sname}) ")
    return GetStudent(sid);
}

async function GetStudent(sid){
    const student = await pool.query("SELECT * FROM student WHERE StudentID = ${sid} ");
    return student;
}

async function AllLecturers(){
    const lecturer = await pool.query("SELECT * FROM lecturer;");
    return lecturer;
}
/*
async function AddLecturer(lname){
    const newStudent = await pool.query("INSERT INTO student(StudentID, Name) VALUES(${sid}, ${sname}) ")
    return GetStudent(sid);
}
*/
async function AddCourse(cid, cname){
    const newCourse = await pool.query("INSERT INTO course(CourseID,CourseName,LecturerID) VALUES(${cid}, ${cname}, NULL) ");
    return GetCourse(cid);
}

async function GetCourse(cid){
    const course = await pool.query("SELECT * FROM course WHERE CourseID = ${cid};");
    return course;
}

async function GetAllCourses(){
    const allCourses = await pool.query("SELECT CourseName, CourseID FROM course;");
    return allCourses;
}

async function StudentGetCourses(sid){
    const courses = await pool.query("SELECT CourseID FROM enroll where StudentID= ${sid}");
    return courses;
}

async function LectGetCourses(lid){
    const courses = await pool.query("SELECT CourseID, CourseName FROM course where LecturerID = ${lid};");
    return courses;
}

//lid = 5; sid=6
async function AssignLect(cid , lid){
    //add functionality that tell if there's already a lecturer registered for course
    //add functionality that tells if its a lecturer or student
    

    if (sid.toString().charAt === '6'){
    
        const lecturer= await pool.query
        ('IF (SELECT COUNT(CourseName) course where LecturerID = ${lid}) <= 5 AND (SELECT LecturerID FROM course WHERE CourseID = ${cid}) IS NULL THEN UPDATE course SET LecturerID = ${lid} WHERE CourseID = ${cid}; END IF;')
        .catch((e) => {
            console.log(e);
            return false;
        });
        return GetCourse(cid)
    }
    else{
        return 'Not a lecturer!!'
    }
}

async function ShowEnroll(sid,cid){
    const course = await pool.query("SELECT * FROM enrol WHERE CourseID = ${cid} and StudentID = ${sid};");
    return course;
}

async function Register(cid , sid){
   
    if (sid.toString().charAt === '5'){
    
        const student = await pool.query('IF NOT EXISTS (SELECT * FROM enroll WHERE CourseID = ${cid} and StudentID = ${sid}) and (SELECT COUNT(StudentID) FROM enroll where StudentID = ${sid} <= 6 THEN INSERT INTO enroll (CourseID, StudentID) VALUES (${cid}, ${sid)}; END IF')
        .catch((e) => {
            console.log(e);
            return false;
        });
        return ShowEnroll(cid,sid)
    }
    else{
        return 'Not a student!!'
    }
}

async function AllMembers(cid){
    const members = await pool.query("SELECT student.StudentID, student.name FROM enroll JOIN Student ON enroll.sid = student.sid WHERE enroll.cid = ${cid};");
    return members;
}

export { login,
    AddCourse,
    GetAllCourses,
    StudentGetCourses,
    LectGetCourses,
     AssignLect, 
     Register, 
     AllMembers
};