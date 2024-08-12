import express from 'express'
import { AddCourse,
    GetAllCourses,
    StudentGetCourses,
    LectGetCourses,
     AssignLect, 
     Register, 
     AllMembers } from './database.js'

const app = express()
app.use(express.json())
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

app.get("/all_courses", async (req, res) => {
    const courses= await GetAllCourses()
    res.send(courses) 
})

app.get("/get_student_courses/:sid", async (req, res) => {
    const sid= req.params.sid
    const courses= await StudentGetCourses(sid)
    res.send(courses) 
})

app.get("/get_lecturer_courses/:lid", async (req, res) => {
    const lid = req.params.lid
    const courses= await LectGetCourses(lid)
    res.send(courses) 
})

app.get("/get_all_members/:cid", async (req, res) => {
    const cid = req.params.cid
    const members= await AllMembers(cid)
    res.send(members) 
})

app.post("/add_course", async (req, res) => {
    const { cid, cname} = req.body
    const course = await AddCourse(cid, cname)
   res.status(201).send(course)

})

app.post("/register/:cid/:sid", async (req, res) => {
    const cid = req.params.cid
    const sid = req.params.sid
    const student = await Register(cid, sid)
   res.status(201).send(student)
})

app.put("/assign_lect", async (req, res) => {
    const { cid, lid} = req.body
    const course = await AssignLect(cid, lid)
   res.status(201).send(course)

})



app.listen (5000, () => {
    console.log('Server is running on port 5000')
})

