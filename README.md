This is  a simple web app displaying CRUD capabilities, simple authentication (session management), HTML(including nunjucks templating), Javascript(js.express, AJAX), Database Management (MY SQL).
**Quick Run**
Create a .env file containing your database info
  Run the create_sql.js file to quickly generate an sql file which can then be run directly in your preffered dbs to create an empty admin table, a student table, a lecturer, course and enroll table.
  The app it self can then be ran using "npx nodemon static/js/app.js" (allows the the app to autorestart when changes are done) or "nodemon static/js/app.js" (standard).

1. A brief description of each major feature or functionality.
      - Authentication -> The app has session management. Only authorized users are allowed to login. Without logining in one has no access to the features.
      - Creating -> Creating an admin, student, lecturer, course
      - Reading/Getting-> get/ search for one or all student,lecturers, courses, admins.
      - Updating-> Change the name of student,lecturers, courses. Assign/unassign a lecturer to a course.
      - Deleting  -> Remove a student,lecturers or courses.
    
3. System requirements or prerequisites (e.g., Node.js version, MySQL version).
4. Detailed installation steps, including how to install dependencies.
5. Configuration instructions
   -Create a .env file containing your database information.
    MYSQL_HOST= ''
    MYSQL_USER= ''
    MYSQL_PASSWORD= ''
    MYSQL_DATABASE= ''
6. Known issues or limitations.
