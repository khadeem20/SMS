import mysql from 'mysql2';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user:  process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database:  process.env.MYSQL_DATABASE
}).promise()

async function login(id, password) {
    //debugging purposes
    //console.log("Login function - ID:", id, "Password:", password);
    const [rows] = await pool.query("SELECT * FROM admin WHERE ID = ?", [id]);
    
    if (rows.length === 0) {
        return { success: false, message: "User not found" };
    }

    const admin = rows[0];
    //debuging
    //console.log("Admin from DB:", admin);

    if (!password || !admin.Password) {
        return { success: false, message: "Invalid password data" };
    }

    try {
        const match = await bcrypt.compare(password, admin.Password);
        if (match) {
            return { success: true, admin };
        } else {
            return { success: false, message: "Incorrect password" };
        }
    } catch (error) {
        console.error("Error in bcrypt compare:", error);
        return { success: false, message: "An error occurred during login" };
    }
}




async function addAdmin(id, password) {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const [newAdmin] = await pool.query("INSERT INTO admin(ID, Password) VALUES(?, ?)", [id, hashedPassword]);
        console.log('New admin inserted:', newAdmin);
        return { message: "Admin added successfully" };
    } catch (error) {
        console.error('Error in addAdmin:', error.message);
        throw error; // Re-throw the error to be caught by the route handler
    }
}


async function isAdminTableEmpty() {
    const [result] = await pool.query("SELECT COUNT(*) as count FROM admin");
    return result[0].count === 0;
}

async function GetAdmin() {
    const admin = await pool.query("SELECT ID FROM admin;");
    return admin;
}
async function AllStudents(){
    const students = await pool.query("SELECT * FROM student;");
    return students;
}
async function AddStudent(sid, sname){
    // First, check if the student already exists
    const [existingStudent] = await pool.query("SELECT * FROM student WHERE StudentID = ?", [sid]);
    
    if (existingStudent.length > 0) {
        return { success: false, message: "Student with this ID already exists" };
    }
    
    try{
        const newStudent = await pool.query("INSERT INTO student(StudentID, Name) VALUES(?, ?)", [sid, sname]);
    return { success: true, message: "Student was succesfully added" };
    }
    catch(error){
        console.error('Error in addStudent:', error.message);
        throw error; // Re-throw the error to be caught by the route handler
    }
}

async function DeleteStudent(sid){
    const student = await pool.query("DELETE FROM student WHERE StudentID = ? ", [sid]);
    return student[0].affectedRows > 0;
}

async function updateStudentInfo(sid, updatedInfo) {
    const result = await pool.query("UPDATE student SET Name = ? WHERE StudentID = ?", [updatedInfo, sid]);
        // Check if any rows were affected
    const show = await pool.query("SELECT * FROM student WHERE StudentID = ?", [sid]);
    return show;
}

async function GetStudent(sid){
    const student = await pool.query("SELECT * FROM student WHERE StudentID = ?", [sid]);
    return student;
}

async function StudentGetCourses(sid){
    // console.log("database.js: StudentGetCourses - sid:", sid);
    const [courses] = await pool.query("SELECT CourseID FROM enroll where StudentID=?", [sid]);
    if (courses.length > 0) {
        const courseIds = courses.map(course => course.CourseID);
        const [result] = await pool.query(
            "SELECT CourseID, CourseName FROM course WHERE CourseID IN (?)",[courseIds]);
        return result;
    }
    else {
        return [];
    }
}

async function GetLecturer(lid){
    const lecturer = await pool.query("SELECT * FROM lecturer WHERE LecturerID = ${lid} ");
    return lecturer;
}
async function AllLecturers(){
    const lecturers = await pool.query("SELECT * FROM lecturer;");
    return lecturers;
}

async function AddLecturer(lid,lname){
    // First, check if the lecturer already exists
    const [existingLecturer] = await pool.query("SELECT * FROM lecturer WHERE LecturerID = ?", [lid]);
    if (existingLecturer.length > 0) {
        return { success: false, message: "Lecturer with this ID already exists" };
    }
    try {
        const newLecturer = await pool.query("INSERT INTO lecturer( LecturerID,Name) VALUES(?,?)", [lid, lname]);
        return { success: true, message: lname + " was succesfully added" };
    } catch (error) {
        console.error('Error in addLecturer:', error.message);
        throw error; // Re-throw the error to be caught by the route handler
    }
}
 
async function DeleteLecturer(lid){
    const lecturer = await pool.query("DELETE FROM lecturer where LecturerID = ?", [lid]);
    console.log("database file-->" + lecturer);
    return lecturer[0].affectedRows > 0;
}

async function UpdateLecturer(lid, lname){
    const result = await pool.query("UPDATE lecturer SET Name = ? WHERE LecturerID = ?", [lname, lid]);
        // Check if any rows were affected
    const show = await pool.query("SELECT * FROM lecturer WHERE LecturerID = ?", [lid]);
    return show;    
}

async function LectGetCourses(lid){
    // console.log("database file-->" + lid);
    const [courses] = await pool.query("SELECT CourseID, CourseName FROM course where LecturerID = ?", [lid]);
    return courses;
}

//lid = 5; sid=6
async function AssignLecturer(cid , lid){
    //check if the id is a lecturer
    const [isLecturer] = await pool.query("SELECT * FROM lecturer WHERE LecturerID = ? ", [lid]);
    if (isLecturer.length === 0){
        return { success: false, message: "Not a Lecturer" };
    }
    //check if the lecturer is already assigned to the course
    const [assignment]= await pool.query("SELECT * FROM course WHERE CourseID = ? AND LecturerID = ?", [cid,lid]);
    if (assignment.length > 0){
        return { success: false, message: 'Lecturer is already assigned to the course.' };   
    }

    try{
        const [result] = await pool.query("UPDATE course SET LecturerID = ? WHERE CourseID = ?", [lid, cid]);
        return { success: true, message: "Lecturer assigned successfully" };
    } catch (error) {
        console.error("Error in AssignLect:", error);
        return { success: false, message: "An error occurred during lecturer assignment" };
    }
}

async function unAssignLecturer(cid){
    //check if a lecturer is assigned to the course
    const [assignment]= await pool.query("SELECT * FROM course WHERE CourseID = ? AND LecturerID IS NOT NULL", [cid]);
    if (assignment.length === 0){
        return { success: false, message: 'No lecturer is assigned to the course.' };
    }
    try{
        const [result] = await pool.query("UPDATE course SET LecturerID = NULL WHERE CourseID = ?", [cid]);
        return { success: true, message: "Lecturer unassigned successfully" };
    } catch (error) {
        console.error("Error in unAssignLect:", error);
        return { success: false, message: "An error occurred during lecturer unassignment" };
    }
}

async function searchLecturers(searchTerm) {
    const [results] = await pool.query(
        "SELECT * FROM lecturer WHERE Name LIKE ? OR LecturerID LIKE ?",
        [`%${searchTerm}%`, `%${searchTerm}%`]
    );
    return results;
}
async function getLecturerWorkload() {
    const [result] = await pool.query(`
        SELECT l.LecturerID, l.Name, COUNT(c.CourseID) as CourseCount
        FROM lecturer l
        LEFT JOIN course c ON l.LecturerID = c.LecturerID
        GROUP BY l.LecturerID, l.Name
    `);
    return result;
}


async function AddCourse(cid, cname){
    // First, check if the course already exists
    const [existingCourse] = await pool.query("SELECT * FROM course WHERE CourseID = ?", [cid]);
    
    if (existingCourse.length > 0) {
        return { success: false, message: "Course already exists" };
    }
    
    try {
        const newCourse = await pool.query("INSERT INTO course(CourseID,CourseName,LecturerID) VALUES(?, ?, NULL)", [cid, cname]);
        return { success: true, message: "Course was succesfully added" };
    } catch (error) {
        console.error('Error in addCourse:', error.message);
        throw error; // Re-throw the error to be caught by the route handler
    }
}

async function unenrollAllStudents(cid) {
    // Unenroll all students from the course
    await pool.query("DELETE FROM enroll WHERE CourseID = ?", [cid]);
}
async function DeleteCourse(cid){
    // Unenroll all students from the course
    await unenrollAllStudents(cid);
    const course = await pool.query("DELETE FROM course WHERE CourseID = ? ", [cid]);
    return course;
}

async function GetCourse(cid){
    const course = await pool.query("SELECT * FROM course WHERE CourseID = ${cid};");
    return course;
}

async function GetAllCourses(){
    const allCourses = await pool.query("SELECT * FROM course;");
    return allCourses;
}

async function GetCourseEnrollment(cid) {
    const [enrollments] = await pool.query("SELECT StudentID FROM enroll WHERE CourseID = ?", [cid]);
    
    if (enrollments.length > 0) {
        const studentIds = enrollments.map(enrollment => enrollment.StudentID);
        const [students] = await pool.query(
            "SELECT StudentID, Name FROM student WHERE StudentID IN (?)",[studentIds]);
        return students;
    } 
    else {
        return [];
    }
}

async function ShowEnroll(cid){
    const courses = await pool.query("SELECT * FROM enroll WHERE StudentID = ?;", [sid]);
    return courses;
}

async function enroll(sid, cid) {
    console.log("Enrolling student:", sid, "in course:", cid);
    // Check if the student is already enrolled in the course
    const [existingEnrollment] = await pool.query("SELECT * FROM enroll WHERE StudentID = ? AND CourseID = ?", [sid, cid]);
    if (existingEnrollment.length > 0) {
        return { success: false, message: "Student is already enrolled in the course" };
    }

    //Check if student exists
    const [student] = await GetStudent(sid);
    if (!student) {
        return { success: false, message: "Student not found" };
    }

    try {
        await pool.query("INSERT INTO enroll(StudentID, CourseID) VALUES(?, ?)", [sid, cid]);
        return { success: true, message: "Enrollment successful" };
    } catch (error) {
        console.error("Error enrolling student:", error);
        return { success: false, message: "Enrollment failed" };
    }
}

async function unenroll(cid, sid) {
    // Check if the student is enrolled in the course
    console.log("Checking enrollment for:", { sid, cid }); // 
    const [existingEnrollment] = await pool.query("SELECT * FROM enroll WHERE StudentID = ? AND CourseID = ?", [sid, cid]);
    console.log("Existing Enrollment:", existingEnrollment); 
    if (existingEnrollment.length === 0) {
        return { success: false, message: "Student is not enrolled in the course" };
    }

    try {
        await pool.query("DELETE FROM enroll WHERE StudentID = ? AND CourseID = ?", [sid, cid]);
        return { success: true, message: sid + "Unenrolled successful from course: " + cid };
    } catch (error) {
        console.error("Error unenrolling student:", error);
        return { success: false, message: "Unenrollment failed" };
    }
}

async function updateCourse(cid, cname){
    const course = await pool.query("UPDATE course SET CourseName = ? WHERE CourseID = ?;", [cname, cid]);
    return course;
}

async function searchCourses(searchTerm) {
    const [results] = await pool.query(
        "SELECT * FROM course WHERE CourseName LIKE ? OR CourseID LIKE ?",
        [`%${searchTerm}%`, `%${searchTerm}%`]
    );
    return results;
}

async function searchStudents(searchTerm) {
    const [results] = await pool.query(
        "SELECT * FROM student WHERE Name LIKE ? OR StudentID LIKE ?",
        [`%${searchTerm}%`, `%${searchTerm}%`]
    );
    return results;
}

export { 
    login, 
    AddCourse, 
    GetAllCourses, 
    StudentGetCourses,
    LectGetCourses, 
    AssignLecturer,
    unAssignLecturer,
    AllStudents,
    AddStudent, 
    GetStudent, 
    AllLecturers,
    UpdateLecturer,
    GetCourse, 
    isAdminTableEmpty,
    addAdmin, 
    GetAdmin,
    DeleteStudent,
    updateStudentInfo,
    DeleteCourse,
    GetCourseEnrollment,
    ShowEnroll,
    searchStudents,
    enroll,
    unenroll,
    updateCourse,
    searchCourses,
    searchLecturers,
    GetLecturer,
    DeleteLecturer,
    getLecturerWorkload,
    AddLecturer
};
