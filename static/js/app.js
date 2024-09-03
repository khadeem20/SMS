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
    AssignLect,
    Register,
    CourseMembers, 
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
    GetLecturer,
    DeleteLecturer,
    getLecturerWorkload,
    DeleteCourse,
    GetCourseEnrollment,
    ShowEnroll,
    searchStudents  }
    from './database.js';


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
        const students = await AllStudents();
        res.render('student.html', { students: students[0] });
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

app.get("/all_courses",async (req, res) => {
    const courses= await GetAllCourses();
    res.json(courses);
})

app.listen (5000, () => {
    console.log('Server is running on port 5000')
})

