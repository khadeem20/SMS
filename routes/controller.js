import{ login,
    addCourse,
    GetAllCourses,
    StudentGetCourses,
    LectGetCourses,
     AssignLect, 
     Register, 
     AllMembers
} from ('./database.js');


//Add functionality that makes this an admin only function
async function httpAddCourse(req, res) {

    try {
        const newCourse = req.body;
        if (!newCourse) {
        return res.status(404).json({
            error: "Data not Valid",
        });
        }
    
        const addNewCustomer = await addCustomer(newCustomer);

        if (!addNewCustomer) {
            return res.status(404).json({
                error: "Did not add customer",
            });
        }
        return res.json({ status: "Customer added" });
    } 
    catch (e) {
        console.error(e);
    }
    }