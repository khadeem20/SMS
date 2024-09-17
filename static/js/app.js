import express from 'express';
import nunjucks from 'nunjucks';
import path from 'path';
import bcrypt from 'bcrypt';
import session from 'express-session';



import  {login, 
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
    GetCourse, 
    isAdminTableEmpty,
    addAdmin, 
    GetAdmin,
    DeleteStudent,
    updateStudentInfo,
    getLecturerWorkload,
    DeleteCourse,
    GetCourseEnrollment,
    ShowEnroll,
    searchStudents, 
    enroll,
    unenroll,
    updateCourse,
    searchCourses,
    searchLecturers,
    AddLecturer,
    GetLecturer,
    UpdateLecturer,
    DeleteLecturer,
}
    from './database.js';
import { Console } from 'console';


const app = express();
app.use(express.json());
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using https
  }));
app.use(express.urlencoded({ extended: true }));
app.use('/static', express.static('static'));

  

// Configure Nunjucks to work with Express
nunjucks.configure(path.resolve('./views'), {
    autoescape: true,
    express: app
});

app.use((req, res, next) => {
    res.locals.isAuthenticated = !!req.session.admin;
    next();
});


//const helmet = require("helmet");

//const cors = require("cors");
//const customerInfoRouter = require("./routes/customer/customer.router");

//app.use(helmet());
//app.use
//  cors({
  //  origin: "*",
  //})
//);

//app.use(express.json());
//app.use("/", customerInfoRouter);

//Allows the app to handle data recieved through post (forms)

//option to make the admind see all the tables available
/*app.get('/admin', async (req, res) => {
    const courses = await GetAllCourses();
    const students = await AllStudents();
    const lecturers = await AllLecturers();
    res.render('admin.html', { courses, students, lecturers });
});*/


app.get('/about', (req, res) => {
    res.render('about.html');
});
//Home page runs the setup func which checks if there is an admin in the database
app.get ("/", async(req, res) => {
    if (await isAdminTableEmpty()) {
        res.redirect('/admin_form');
    } else {
        res.render('home.html');
    }
})
app.get('/admin_form', (req, res) => {
    res.render('admin_form.html');
  });

app.get('/dashboard', isAuthenticated, async (req, res) =>{
    res.render('dashboard.html');
})
app.post('/add-Admin', async (req, res) => {
    const { id, password } = req.body;
    try {
        const result = await addAdmin(id, password);
        console.log('Admin added:', result);
        res.redirect('/login_form');
    } catch (error) {
        console.error('Error adding admin:', error.message);
        res.status(500).render('admin_form.html', { error: 'Failed to add admin' });
    }
});



app.get('/login_form', (req, res) => {
    res.render('login_form.html');
  });

app.post('/login', async (req, res) => {
    //gets the id and password values from the form
    const { id, password } = req.body;
    const result = await login(id, password);
    
    if (result.success) {
        req.session.admin = result.admin;
        //res.status(200).send("Logged in successfully"););
        res.render('dashboard.html', { isAuthenticated: true });
    } else {
        res.status(401).send(result.message);
    }
});

app.post('/logout', isAuthenticated, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ success: false, message: "Logout failed" });
        }
        res.status(200).json({ success: true, message: "Logged out successfully" });
    });
});

function isAuthenticated(req, res, next) {
    if (req.session.admin) {
      next();
    } else {
      res.redirect('/login_form');
    }
  }

app.get('/get_admin' , async (req, res) => {
    const admin = await GetAdmin();
    res.json(admin);
});

app.get("/course_page", async (req, res) => {
    res.render("courses.html");
})

app.get("/lecturer_page", async (req, res) => {
    res.render("lecturer.html")
})

app.get("/student_page", async (req, res) => {
    res.render('student.html')
})

app.get("/admin_page", async(req, res) => {
    res.render('admin.html');
})

app.get("/all_students", async (req, res) => {
    const students = await AllStudents();
    res.render('student.html', { students: students[0] });
});


app.post("/add_student", async (req, res) => {
    const { id, name} = req.body;
    console.log("server:" + req.body.id + " " + req.body.name);
    const result = await AddStudent(id, name);
    if (result) {
        res.json({ success: true, message: result.message });
    } else {
        res.json({ success: false, message: result.message });
    }
});

app.delete("/delete_student/:id", async (req, res) => {
    const studentId = req.params.id;
    //console.log("serverside:" + studentId);
    const result = await DeleteStudent(studentId);
    if (result) {
        res.json({ success: true, message: 'Student deleted successfully' });
    } else {
        res.json({ success: false, message: 'Failed to delete student' });
    }
});

app.post("/update_student/:id", async (req, res) => {
    const studentId = req.params.id;
    const { newName } = req.body;
    const result = await updateStudentInfo(studentId, newName);
    if (result) {
        res.redirect('/all_students');
    } else {
        res.status(400).send('Update failed');
    }
});

app.post("/search_student/", async (req, res) => {
    const {search} = req.body;
    console.log("search for: " + search);
    const students = await searchStudents(search);
    if (students) {
        res.render('student.html', { searchedStudents: students, searchTerm: search });
    } else {
        res.status(404).send('No Student found');
    }
});

app.get("/student_courses/:id", async (req, res) => {
    const studentID = req.params.id;
    // console.log("app.js:  " + studentID);
    const courses = await StudentGetCourses(studentID);
    res.json(courses);
});

app.get("/all_courses",async (req, res) => {
    const courses= await GetAllCourses();
    res.render('courses.html', { courses: courses[0] });
})


app.post("/enroll_student/:courseID", async (req, res)=>{
    const StudentID = req.body.StudentID;
    const courseID = req.params.courseID;
    const result = await enroll(StudentID, courseID);
    if (result) {
        res.json({ success: true, message: result.message });
    } else {
        res.json({ success: false, message: result.message });
    }
})

app.delete("/unenroll_student/:courseID/:studentID", async (req, res) => {
    const courseID = req.params.courseID;
    const studentID = req.params.studentID;
    console.log("server:" + courseID + " " + studentID);
    const result = await unenroll(courseID, studentID);
    if (result) {
        res.json({ success: true, message: result.message });
    } else {
        res.json({ success: false, message: result.message });
    }
});

//course related routes

app.post("/add_course", async (req, res) => {
    const { id, name} = req.body;
    //console.log("server:" + req.body.id + " " + req.body.name);
    const result = await AddCourse(id, name);
    if (result) {
        res.json({ success: true, message: result.message});
    }
    else {
        res.json({ success: false, message: result.message });
    }
})
app.post("/update_course/:id", async (req, res) => {
    const courseID = req.params.id;
    const { newName } = req.body;
    const result = await updateCourse(courseID, newName);
    if (result) {
        res.redirect('/all_courses');
    } else {
        res.status(400).send('Update failed');
    }
});

app.delete("/delete_course/:cid", async (req, res) => {
    const courseID = req.params.cid;
    console.log("serverside:" + courseID);
    const result = await DeleteCourse(courseID);
    if (result) {
        res.json({ success: true, message: result.message });
    } else {
        res.json({ success: false, message: result.message });
    }
});
app.post("/search_course/", async (req, res) => {
    const {search} = req.body;
    console.log("Searching for: " + search);

    const courses = await searchCourses(search);
    console.log("Search results:", courses);

    if (courses && courses.length > 0) {
        //console.log("Rendering courses with results");
        res.render('courses.html', { searchedCourses: courses, searchTerm: search });
    } else {
        //console.log("Rendering courses with no results message");
        res.render('courses.html', { 
            searchedCourses: [], 
            searchTerm: search, 
            message: 'No courses found matching your search criteria.' 
        });
    }
});

app.get("/course_enrollment/:cid", async (req, res) => {
    const cid = req.params.cid;
    //console.log("Course ID:", cid);
    const enrollment = await GetCourseEnrollment(cid);
    res.json(enrollment);
})

app.post("/assign_lecturer/:cid", async (req, res) => {
    const cid = req.params.cid;
    const lecturerID = req.body.LecturerID;
    //console.log("Course ID:", cid);
    //console.log("Lecturer ID:", lecturerID);
    const result = await AssignLecturer(cid, lecturerID);
    //console.log("Result:", result);
    if (result) {
        res.json({ success: true, message: result.message });
    } else {
        res.json({ success: false, message: result.message });
    }                    
})

app.put("/unAssign_lecturer/:cid", async (req, res) => {
    const cid = req.params.cid;
    console.log("Course ID:", cid);
    const result = await unAssignLecturer(cid);
    console.log("Result:", result);
    if (result) {
        res.json({ success: true, message: result.message });
    } else {
        res.json({ success: false, message: result.message });
    }                    
})

app.post("/search_lecturer/", async (req, res) => {
    const {search} = req.body;
    console.log("search for: " + search);
    const lecturers = await searchLecturers(search);
    if (lecturers) {
        res.render('lecturer.html', { searchedLecturers: lecturers, searchTerm: search });
    } else {
        res.status(404).send('No Lecturer found');
    }
});

app.get("/all_lecturers",async (req, res) => {
    const lecturers= await AllLecturers();
    res.render('lecturer.html', { lecturers: lecturers [0] });
})

app.post("/add_lecturer", async (req, res) => {
    const { id, name} = req.body;
    //console.log("server:" + req.body.id + " " + req.body.name);
    const result = await AddLecturer(id, name);
    if (result) {
        console.log("server:" + result.message);
        res.json({ success: true, message: result.message });
    } else {
        res.json({ success: false, message: result.message });
    }
});

app.delete("/delete_lecturer/:id", async (req, res) => {
    const lecturerId = req.params.id;
    //console.log("serverside:" + lecturerId);
    const result = await DeleteLecturer(lecturerId);
    if (result) {
        res.json({ success: true, message: result.message });
    } else {
        res.json({ success: false, message: result.message });
    }
});

app.post("/update_lecturer/:id", async (req, res) => {
    const lecturerId = req.params.id;
    const { newName } = req.body;
    const result = await UpdateLecturer(lecturerId, newName);
    if (result) {
        res.redirect('/all_lecturers');
    } else {
        res.status(400).send('Update failed');
    }
});

app.get("/lecturer_assignments/:lid", async (req, res) => {
    const lid = req.params.lid;
    //console.log("Lecturer ID:", lid);
    const assignments = await LectGetCourses(lid);
    res.json(assignments);
})



    app.listen (5000, () => {
    console.log('Server is running on port 5000')
})

