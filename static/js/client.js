document.addEventListener('DOMContentLoaded', function() {
    const addStudentForm = document.getElementById('add-student-form');
    const addStudentButton = document.getElementById('add-student-button');
    const studentTableBody = document.getElementById('student-table-body');
    const studentList = document.querySelector('ol.students');
    const courseList = document.querySelector('.courses');
    const lecturerList= document.querySelector('.lecturers');

    console.log("client - course list: " + courseList);
    console.log("client - student list: " + studentList);
//Send a post instead of a get for logout route

const logoutLink = document.getElementById('logout');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            fetch('/logout', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => response.json())
            .then(data => {
                
                if (data.success) {
                    window.location.href = '/';
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert(data.message);
            });
        });
    }

    const addForm = document.querySelector('.add-form');
    if (addForm) {
        addForm.addEventListener('submit', function(e) {
            // Your existing form submission logic here
            e.preventDefault();
            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            fetch('/add_student', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                if (data.success) {
                    this.reset();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while adding the student. Please try again.');
            });
        });
    };

//delete student logic
    if (studentList){
        studentList.addEventListener('click', function(e) {
            if (e.target.classList.contains('delete-student')) {
                e.preventDefault();
                const studentId = e.target.dataset.sid;
                console.log("client - student id:" + studentId);
                deleteStudent(studentId);
            }
        });
    }
    

function deleteStudent(studentId) {
    if (confirm('Are you sure you want to delete this student?')) {
        fetch(`/delete_student/${studentId}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            //console.log(data);  // Debugging line
            if (data.success) {
                alert(studentId + " deleted successfully");
                //location.reload();
                 // Remove the deleted student's element from the DOM
                 const studentElement = document.querySelector(`[data-sid="${studentId}"]`).closest('li');
                 studentElement.remove();
            } else {
                alert(data.message);
            }
        })
        
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while deleting the student');
        });
    }
}


//handle student update form visibility  
if (studentList){
studentList.addEventListener('click', function(e) {
        if (e.target.classList.contains('update-student')) {
            e.preventDefault();
            const studentId = e.target.dataset.sid;
            toggleUpdateForm(studentId);
        }
    });
}

    function toggleUpdateForm(studentId) {
        const form = document.getElementById(`updateForm-${studentId}`);
        form.style.display = form.style.display === 'none' ? 'inline' : 'none';
    };




//course functionalities

//handle student enrollment form visibility
if (courseList){
    courseList.addEventListener('click', function(e) {
        if (e.target.classList.contains('enroll-student')) {
            e.preventDefault();
            const courseId = e.target.dataset.cid;
            console.log("Form about to be toggled for ->" + courseId);  // Debug line
            toggleEnrollForm(courseId);
        }
    });
}


// Handles enrollment form submission submission
if (courseList){
        courseList.addEventListener('submit', function(e) {
            if (e.target.id.startsWith('enrollForm-')) {
                e.preventDefault();
                const form = e.target;
                const courseId = form.id.split('-')[1];
                
                // Extract the form data manually
                const formData = new FormData(form);
                const studentId = formData.get('StudentID');  // Get the student ID from the form
    
                // Debug: Log the student ID to verify it's being captured
                console.log("client ----- Student ID: ", studentId);
        
                // Convert form data to a JSON object
                const data = {
                    StudentID: studentId
                };
        
                fetch(`/enroll_student/${courseId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json', // Ensure you're sending JSON
                    },
                    body: JSON.stringify(data) // Convert the data object to JSON format
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert(data.message);
                        form.reset();
                        toggleEnrollForm(courseId);
                    } else {
                        alert(data.message || 'An error occurred during enrollment.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred during enrollment. Please try again.');
                });

            }
        });
}
    




function toggleEnrollForm(courseID) {
    console.log("Toggling enroll form for course ID: ", courseID);  // Debug line
    const form = document.getElementById(`enrollForm-${courseID}`);
    
    form.style.display = form.style.display === 'none' ? 'inline' : 'none';
}


//handle course update form visibility  
if (courseList){
    courseList.addEventListener('click', function(e) {
            if (e.target.classList.contains('update-course')) {
                e.preventDefault();
                const courseID = e.target.dataset.cid;
                toggleUpdateForm(courseID);
            }
        });
    }
    
        function toggleCourseUpdateForm(CourseID) {
            const form = document.getElementById(`updateForm-${CourseID}`);
            form.style.display = form.style.display === 'none' ? 'inline' : 'none';
        };
    
//Handle showing enrollment after searching for a course    
    const searchResults = document.querySelector('.searchedCourses');
    if (searchResults) {
        searchResults.addEventListener('click', function(e) {
            if (e.target.classList.contains('view-enrollment')) {
                const CourseID = e.target.dataset.cid;
                const enrollmentList = document.getElementById(`enrollment-${CourseID}`);
                
                if (enrollmentList.style.display === 'none') {
                    fetch(`/course_enrollment/${CourseID}`)
                        .then(response => response.json())
                        .then(data => {
                            enrollmentList.innerHTML = '';
                            data.forEach(student => {
                                const li = document.createElement('li');
                                li.textContent = `${student.StudentID}: ${student.Name}`;

                                // Add Unenroll button next to each student
                                const unenrollButton = document.createElement('button');
                                unenrollButton.textContent = 'Unenroll';
                                unenrollButton.classList.add('unenroll-student');
                                unenrollButton.dataset.sid = student.StudentID;
                                unenrollButton.dataset.cid = CourseID; // Add CourseID for reference
                                li.appendChild(unenrollButton); // Append the button to the list item
                        
                                enrollmentList.appendChild(li);

                            });
                            enrollmentList.style.display = 'block';
                        });
                } else {
                    enrollmentList.style.display = 'none';
                }
            }
        });
    }

    
    // Handle Unenroll button click
    if (searchResults) {
        searchResults.addEventListener('click', function(e) {
            if (e.target.classList.contains('unenroll-student')) {
                const studentID = e.target.dataset.sid;
                const courseID = e.target.dataset.cid;
                unenrollStudent(studentID, courseID, e);
            }
        })
    }

    function unenrollStudent(studentID, courseID, e) {
            if (confirm(`Are you sure you want to unenroll student ${studentID}?`)) {
                fetch(`/unenroll_student/${courseID}/${studentID}`, {
                    method: 'DELETE'
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert(data.message);
                        e.target.parentElement.remove(); // Remove the student from the list
                    } else {
                        alert(data.message);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred while unenrolling the student.');
                });
            }
        }
    


//Handle add course functionality
const courseAddForm = document.querySelector('.add-course');
if (courseAddForm) {
    courseAddForm.addEventListener('submit', function(e) {
        // Your existing form submission logic here
        e.preventDefault();
        const formData = new FormData(this);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        fetch('/add_course', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            if (data.success) {
                this.reset();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while adding the course.');
        });
    });
};


//Handle course deletion
if (courseList){
   courseList.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-course')) {
            e.preventDefault();
            const courseID = e.target.dataset.cid;
            console.log("client - course id:" + courseID);
            deleteCourse(courseID);
        }
    });
}
function deleteCourse(courseID) {
if (confirm('Are you sure you want to delete this course?')) {
    fetch(`/delete_course/${courseID}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        //console.log(data);  // Debugging line
        if (data.success) {
            alert(courseID + " deleted successfully");
            //location.reload();
             // Remove the deleted course's element from the DOM
             const courseElement = document.querySelector(`[data-cid="${courseID}"]`).closest('tr');
             courseElement.remove();
        } else {
            alert(data.message);
        }
    })
    
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while deleting the student');
    });
}
}

//Lecturer assignment form visibility
if (courseList){
    courseList.addEventListener('click', function(e) {
            if (e.target.classList.contains('assign-lecturer')) {
                //e.preventDefault();
                const courseID = e.target.dataset.cid;
                console.log("client - course id:" + courseID);
                toggleLecturerAssignmentForm(courseID);
            }
        });
    }

function toggleLecturerAssignmentForm(courseID) {
const form = document.getElementById(`lecturerAssignmentForm-${courseID}`);
form.style.display = form.style.display === 'none' ? 'inline' : 'none';
}

//assigning lecturer to course logic
const lecturerAssignmentForms = document.querySelectorAll('[id^="lecturerAssignmentForm-"]');
    if (lecturerAssignmentForms){
        lecturerAssignmentForms.forEach(form =>{
            form.addEventListener('submit', handleLecturerAssignment);
        })
    }
    
function handleLecturerAssignment(event){
    event.preventDefault();
    const form = event.target;
    const courseID = form.id.split('-')[1];
    const lecturerId = form.querySelector('input[name="LecturerID"]').value
    console.log("client - lecturer id:" + lecturerId);
    fetch(form.action, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ LecturerID: lecturerId }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message);
            this.reset();
            window.location.reload();
        }
        else {
            alert( data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while assigning lecturer.');
    });
};
    
//Unassign lecturer button event listener 

if (courseList){
    courseList.addEventListener('click', function(e) {
        if (e.target.classList.contains('unAssign')) {
            e.preventDefault();
            const courseID = e.target.dataset.cid;
            console.log("client - course id:" + courseID);
            unAssign_lecturer(courseID);
        }
    });
}
//unassign lecturer function logic
function unAssign_lecturer(courseID) {
    if (confirm('Are you sure you want to unassign this lecturer?')) {{
        fetch(`/unAssign_lecturer/${courseID}`, {
            method: 'PUT',
        })
        .then(response => response.json())
        .then(data => {
            //console.log(data);  // Debugging line
            if (data.success) {
                alert( data.message);
                location.reload();
            } else {
                alert(data.message);
            }
        })
        
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while unassigning lecturer');
        });
    }
    }
}


// Lecturer functionalitiues
const addLecturerForm = document.querySelector('.addLecturer-form');
    if (addLecturerForm) {
        addLecturerForm.addEventListener('submit', function(e) {
            // Your existing form submission logic here
            e.preventDefault();
            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            console.log("client" + data);
            fetch('/add_lecturer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                if (data.success) {
                    this.reset();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while adding the lecturerer. Please try again.');
            });
        });
    };

//delete lecturer logic
    if (lecturerList){
        lecturerList.addEventListener('click', function(e) {
            if (e.target.classList.contains('delete-lecturer')) {
                e.preventDefault();
                const lecturerID = e.target.dataset.lid;
                console.log("client - lecturer id:" + lecturerID);
                DeleteLecturer(lecturerID);
            }
        });
    }
    

function DeleteLecturer(lecturerID) {
    if (confirm('Are you sure you want to delete this lecturer?')) {
        fetch(`/delete_lecturer/${lecturerID}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            //console.log(data);  // Debugging line
            if (data.success) {
                alert(lecturerID + " deleted successfully");
                //location.reload();
                 // Remove the deleted student's element from the DOM
                 const lecturerElement = document.querySelector(`[data-lid="${lecturerID}"]`).closest('tr');
                 lecturerElement.remove();
            } else {
                alert(data.message);
            }
        })
        
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while deleting the lecturer');
        });
    }
}


//handle lecturer update form visibility  
if (lecturerList){
lecturerList.addEventListener('click', function(e) {
        if (e.target.classList.contains('update-lecturer')) {
            e.preventDefault();
            const lecturerID = e.target.dataset.lid;
            toggleLecturerUpdateForm(lecturerID);
         }
    });
}

    function toggleLecturerUpdateForm(lecturerID) {
        const form = document.getElementById(`updateForm-${lecturerID}`);
        form.style.display = form.style.display === 'none' ? 'inline' : 'none';
    };

//Handle showing assignment after searching for a lecturer    
const searchLecturers = document.querySelector('.searchedLecturers');
if (searchLecturers) {
    searchLecturers.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-assignments')) {
            const lecturerID = e.target.dataset.lid;
            const assignmentList = document.getElementById(`assignment-${lecturerID}`);
            
            if (assignmentList.style.display === 'none') {
                fetch(`/lecturer_assignments/${lecturerID}`)
                    .then(response => response.json())
                    .then(data => {
                        assignmentList.innerHTML = '';
                        data.forEach(course => {
                            const li = document.createElement('li');
                            li.textContent = `${course.CourseID}: ${course.CourseName}`;

                            // Add Unenroll button next to each student
                            const unAssignButton = document.createElement('button');
                            unAssignButton.textContent = 'Unassign';
                            unAssignButton.classList.add('unassign-course');
                            unAssignButton.dataset.lid = lecturerID;
                            unAssignButton.dataset.cid = course.CourseID; // Add CourseID for reference
                            li.appendChild(unAssignButton); // Append the button to the list item
                    
                            assignmentList.appendChild(li);

                        });
                        assignmentList.style.display = 'block';
                    });
            } else {
                assignmentList.style.display = 'none';
            }
        }
    });
}

//unassign lecturer from course button event listener
if (searchLecturers) {
    searchLecturers.addEventListener('click', function(e) {
       if (e.target.classList.contains('unassign-course')) {
        //    const lecturerID = e.target.dataset.lid;
            console.log("unassign button clicked");
           const courseID = e.target.dataset.cid;
           unAssign_lecturer(courseID);
   
       }
   });
   
}   


if (searchLecturers) {
    searchLecturers.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-assignments')) {
            const lecturerID = e.target.dataset.lid;
            const assignmentList = document.getElementById(`assignment-${lecturerID}`);
            
            if (assignmentList.style.display === 'none') {
                fetch(`/lecturer_assignments/${lecturerID}`)
                    .then(response => response.json())
                    .then(data => {
                        assignmentList.innerHTML = '';
                        data.forEach(course => {
                            const li = document.createElement('li');
                            li.textContent = `${course.CourseID}: ${course.CourseName}`;

                            // Add Unenroll button next to each student
                            const unAssignButton = document.createElement('button');
                            unAssignButton.textContent = 'Unassign';
                            unAssignButton.classList.add('unassign-course');
                            unAssignButton.dataset.lid = lecturerID;
                            unAssignButton.dataset.cid = course.CourseID; // Add CourseID for reference
                            li.appendChild(unAssignButton); // Append the button to the list item
                    
                            assignmentList.appendChild(li);

                        });
                        assignmentList.style.display = 'block';
                    });
            } else {
                assignmentList.style.display = 'none';
            }
        }
    });
}

if (searchLecturers) {
    searchLecturers.addEventListener('click', function(e) {
       if (e.target.classList.contains('unassign-course')) {
        //    const lecturerID = e.target.dataset.lid;
            console.log("unassign button clicked");
           const courseID = e.target.dataset.cid;
           unAssign_lecturer(courseID);
   
       }
   });
   
   }   

   
//Handle showing students courses  after searching    
const searchedStudents = document.querySelector('.searchedStudents');
if (searchedStudents) {
    searchedStudents.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-courses')) {
            const studentID = e.target.dataset.sid;
            // console.log("client:" + studentID);
            const courseList = document.getElementById(`courses-${studentID}`);
            
            if (courseList.style.display === 'none') {
                fetch(`/student_courses/${studentID}`)
                    .then(response => response.json())
                    .then(data => {
                        courseList.innerHTML = '';
                        data.forEach(course => {
                            const li = document.createElement('li');
                            li.textContent = `${course.CourseID}: ${course.CourseName}`;

                            // Add Unenroll button next to each student
                            const unenrollButton = document.createElement('button');
                            unenrollButton.textContent = 'Unenroll';
                            unenrollButton.classList.add('Unenroll-course');
                            unenrollButton.dataset.sid = studentID;
                            unenrollButton.dataset.cid = course.CourseID; // Add CourseID for reference
                            li.appendChild(unenrollButton); // Append the button to the list item
                    
                            courseList.appendChild(li);

                        });
                        courseList.style.display = 'block';
                    });
            } else {
                courseList.style.display = 'none';
            }
        }
    });
}

//unenroll button event listener
if (searchedStudents) {
    searchedStudents.addEventListener('click', function(e) {
        if (e.target.classList.contains('Unenroll-course')) {
            const studentID = e.target.dataset.sid;
            const courseID = e.target.dataset.cid;
            console.log(`Unenrolling student ${studentID} from course ${courseID}`);
            unenrollStudent(studentID, courseID);
        }
    })
}



//The end
})
