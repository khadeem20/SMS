/*window.onload= function(){

    function deleteStudent(studentId) {
        if (confirm('Are you sure you want to delete this student?')) {
            fetch(`/delete_student/${studentId}`, {
                method: 'DELETE',
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Student deleted successfully');
                    location.reload();
                } else {
                    alert('Failed to delete student');
                }
            });
        }
    }


}
*/
document.addEventListener('DOMContentLoaded', function() {
    const addStudentForm = document.getElementById('add-student-form');
    const addStudentButton = document.getElementById('add-student-button');
    const studentTableBody = document.getElementById('student-table-body');

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

document.querySelector('.add-form').addEventListener('submit', function(e) {
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

//delete student logic
const studentList = document.querySelector('ol'); 
    studentList.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-student')) {
            e.preventDefault();
            const studentId = e.target.dataset.sid;
            console.log("client - student id:" + studentId);
            deleteStudent(studentId);
        }
    });

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


//handle update form visibility  
studentList.addEventListener('click', function(e) {
        if (e.target.classList.contains('update-student')) {
            e.preventDefault();
            const studentId = e.target.dataset.sid;
            toggleUpdateForm(studentId);
        }
    });

    function toggleUpdateForm(studentId) {
        const form = document.getElementById(`updateForm-${studentId}`);
        form.style.display = form.style.display === 'none' ? 'inline' : 'none';
    }
});