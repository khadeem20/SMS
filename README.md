This is a simple web app demonstrating basic CRUD capabilities, authentication (session management), templating with HTML and Nunjucks, AJAX requests, and database management using MySQL. The system allows users to manage admins, students, lecturers, cou

**Quick Run**
1. Create a .env file containing your database information (detailed below).

2. Run the create_sql.js file to quickly generate an SQL file. This SQL file can be used in your preferred DBMS to create the following tables: admin, student, lecturer, course, and enroll.

3. Start the app using:
  - npx nodemon static/js/app.js (recommended for automatic restarts upon code changes)
  - or nodemon static/js/app.js (for standard running).
 

**Features**
**Authentication**
- The app uses session management to restrict access to authorized users only. Without logging in, users cannot access key features of the system.

**CRUD Operations**
- Create: Add new admins, students, lecturers, and courses. Enroll Students in Courses.
- Read/Get: Search for one or all students, lecturers, courses, or admins. Display lists of students, courses, and lecturers.
- Update: Modify the name of a student, lecturer, or course. Assign or unassign lecturers to/from courses.
- Delete: Remove students, lecturers, or courses from the system. Unenroll students from courses.

**Database Management**
The app interacts with a MySQL database for data persistence. The following tables are used:
- admin: Stores admin credentials.
- student: Stores student details.
- lecturer: Stores lecturer details.
- course: Stores course details.
- enroll: Stores student-course enrollments.
    
**System Requirements**
Node.js: Version 14.x or later.
MySQL: Version 8.x or later.
Nodemon: For development purposes (optional but recommended).

**Installation Steps**
1. Clone the repository.
  git clone https://github.com/yourusername/school-management-system.git
  cd school-management-system

2. Install Dependencies: Make sure you have Node.js and MySQL installed. Then, install the required packages:
  npm install

3. Create .env file: Create a .env file in the root of your project with the following variables:
  MYSQL_HOST= 'your_mysql_host'
  MYSQL_USER= 'your_mysql_username'
  MYSQL_PASSWORD= 'your_mysql_password'
  MYSQL_DATABASE= 'your_mysql_database'

4. Generate SQL File and Setup the Database: Run the create_sql.js file to generate the necessary SQL commands:
  node create_sql.js

5. Run the App: Start the app using:
  npx nodemon static/js/app.js
or 
  nodemon static/js/app.js





**Configuration instructions**
- Database Configuration: As mentioned in the .env section, you need to set the correct MySQL credentials.
- Nunjucks Templating: The app uses Nunjucks for rendering dynamic HTML pages. 
   

**Known Issues or Limitations**
- Session Timeout: Sessions are currently not timed, so users may remain logged in indefinitely.

- No Validation on Forms: Some forms may lack proper input validation, leading to issues like empty fields being submitted.

- No CSS: The app lacks CSS styling, resulting in a barebones interface.

- Authentication: Authentication has not been added to all routes. This is deliberate to allow ease of testing. When the creator is satisfied with the state of the app, this will be added.

**Additional Features**
- AJAX Handling: The app uses AJAX requests for asynchronous operations such as enrolling or unenrolling students without refreshing the page, along with alerts being returned telling the user whether the operation was successful or not.

- Error Handling: The app includes error handling for various scenarios, such as invalid credentials, attempts to create duplicate records, and more.

- Session Management: Admins are authenticated using sessions, preventing unauthorized access.
