import express from 'express';
import nunjucks from 'nunjucks';
import path from 'path';
import bcrypt from 'bcrypt';
import session from 'express-session';



import  { login, AddCourse, GetAllCourses,
     StudentGetCourses,LectGetCourses, AssignLect,
     Register,AllMembers, AllStudents,AddStudent, GetStudent,
       AllLecturers,GetCourse, isAdminTableEmpty, addAdmin,GetAdmin }
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
        //res.status(200).send("Logged in successfully");
        res.redirect('/');
    } else {
        res.status(401).send(result.message);
    }
});

app.get('/logout', isAuthenticated, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send("Logout failed");
        }
        res.status(200).send("Logged out successfully");
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
app.get("/all_courses",async (req, res) => {
    const courses= await GetAllCourses();
    res.json(courses);
})

app.get("/get_student_courses/:sid", isAuthenticated, async (req, res) => {
    const sid= req.params.sid
    const courses= await StudentGetCourses(sid)
    res.send(courses) 
})

app.get("/get_lecturer_courses/:lid", isAuthenticated,async (req, res) => {
    const lid = req.params.lid
    const courses= await LectGetCourses(lid)
    res.send(courses) 
})

app.get("/get_all_members/:cid", isAuthenticated, async (req, res) => {
    const cid = req.params.cid
    const members= await AllMembers(cid)
    res.send(members) 
})

app.post("/add_course", isAuthenticated, async (req, res) => {
    const { cid, cname} = req.body
    const course = await AddCourse(cid, cname)
   res.status(201).send(course)

})

app.post("/register/:cid/:sid",isAuthenticated, async (req, res) => {
    const cid = req.params.cid
    const sid = req.params.sid
    const student = await Register(cid, sid)
   res.status(201).send(student)
})

app.put("/assign_lect",isAuthenticated, async (req, res) => {
    const { cid, lid} = req.body
    const course = await AssignLect(cid, lid)
   res.status(201).send(course)

})



app.listen (5000, () => {
    console.log('Server is running on port 5000')
})

