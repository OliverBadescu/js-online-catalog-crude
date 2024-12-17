import { getAllStudents, getUserById, getUsersGrades, createGrade, createUser,getGradeById, updateGrade,deleteGrade,updateUser,deleteUser, login , register} from "./service.js";

export function createLoginPage(){

    let container = document.querySelector(".container");

    
    container.innerHTML = `
    <div class = "main-container">
    <div class="login-container">
            
    <div class="email">
        <p >Email:</p>
        <input type="email" name="email" id="email-login">
    </div>
    <div class="password">
        <p >Password:</p>
        <input type="password" name="password" id="password">
    </div>

    <button class="submit-login">Submit</button>
    <button class="register-button">Register now</button>
    </div>
    </div>

    
    `;



    let btnSubmit = document.querySelector(".submit-login");

    btnSubmit.addEventListener('click', async () => {
        const email = document.querySelector("#email-login").value;
        const password = document.querySelector("#password").value;

        const loginRequest = {
            email: email,
            password: password
        }

        const result = await login(loginRequest);
        if (result.status == '200') {
            const data = result.body;
            const role = data.userRole;

            if(role == 'ADMIN'){
                createHomePage();
            }else if( role =='CLIENT'){

                const id = data.id;
                const userData = await getUserById(id); 
                createClientHomePage(userData.body);
            }
        } else {
            const error = document.querySelector(".login-error");
            if(error){
                error.remove();
            }

            const popUp = failedLogin();
            const loginContainer = document.querySelector(".main-container");
            if(loginContainer){
                loginContainer.insertAdjacentElement('afterend', popUp);
                popUp.classList.toggle("show");
            }
            
        }
    });

    let registerBtn = document.querySelector(".register-button");

    registerBtn.addEventListener('click', () => {
        createRegisterPage();

    });

}

function failedLogin(){

    const popUp = document.createElement("div");
    popUp.classList.add("login-error");

    popUp.innerHTML = `
        <div class = "error-message">
            <p>Failed to login, email or password is incorrect. <br> Please try again!</p>
        </div>
    `;

    return popUp;

}

export function createRegisterPage(){

    let container = document.querySelector('.container');


    container.innerHTML = `
    <div class = "main-container">
    <div class="register-container">
       
        <div class="fullName">
            <p >Full Name:</p>
            <input type="name" name="fullName" id="fullName-register">
        </div>
        <div class="email">
            <p >Email:</p>
            <input type="email" name="email" id="email-register">
        </div>
        <div class="password">
            <p >Password:</p>
            <input type="password" name="password" id="password-register">
        </div>
        <div class="phone">
            <p >Phone:</p>
            <input type="number" name="phone" id="phone-register">
        </div>
    
        <button class="register-button">Register</button>
    </div>
</div>
    `

    const registerButton = document.querySelector('.register-button');

    registerButton.addEventListener('click', async () =>{

        const userRequest = {
            fullName : document.querySelector('#fullName-register').value,
            email: document.querySelector('#email-register').value,
            password:document.querySelector('#password-register').value,
            phone: document.querySelector('#phone-register').value

        }

        const result = await register(userRequest);
        console.log(result.status)
        if (result.status == '201') {
            alert("Successfully registered, please login to continue");
            createLoginPage();
          } else {
            const error = document.querySelector(".register-error");
            if (error) {
              error.remove();
            }

            const popUp = registerError();
            const registerContainer = document.querySelector(".main-container");


              
            
            if (registerContainer) {
              registerContainer.insertAdjacentElement("afterend", popUp);
              popUp.classList.toggle("show");
            }
          }

    });

}

function registerError(){

    const popUp = document.createElement("div");
    popUp.classList.add("register-error");

  popUp.innerHTML = `
    <div class="error-message">
      <p class = "error-text">Failed to register. Email already used. <br> Please try again!</p>
    </div>
  `;

  return popUp;

}

export function createHomePage() {
    loadUsers();
    let container = document.querySelector(".container");

    container.innerHTML = `
    <h1>Students</h1>
    <button class="add-student">Add New Student</button>
    <button class="log-out">Logout</button>
    <table>
        <thead>
            <tr>
                <th>Full name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Grades</th>
            </tr>
        </thead>
        <tbody class="table-body">
        </tbody>
    </table>
    `;

    let btnAdd = document.querySelector('.add-student');
    btnAdd.addEventListener('click', () => {
        createAddUserPage();
    });

    let tbody = document.querySelector('.table-body');
    tbody.addEventListener('click', async (event) => {
        let user = event.target;
        

        if (user.classList.contains("user-link")) {
            const userId = user.getAttribute("data-id"); 
            const userData = await getUserById(userId); 
            if (userData.body) {
                createUpdateDeleteUserPage(userData.body);
            } else {
                alert("Failed to load user details");
            }
        }

        if (user.classList.contains("grade-link")) {
            const userId = user.getAttribute("data-id"); 
            const userData = await getUserById(userId); 
            if (userData.body) {
                createGradePage(userData.body);
            }
        }


        
    });
    
    let btnLogout = document.querySelector('.log-out');

        
    btnLogout.addEventListener('click', () => {
        createLoginPage();
    });
}

export function createClientHomePage(user){

    let container = document.querySelector(".container");

    container.innerHTML = `
    <h1>${user.fullName}'s Grades</h1>

    <button class="log-out">Log out</button>
    <table>
        <thead>
            <tr>
                <th>Grade</th>
                <th>Feedback Title</th>
                <th>Feedback Message</th>
                <th>Create date</th>
            </tr>
        </thead>
        <tbody class="table-body">
        </tbody>
    </table>
    `;

    loadClientGrades(user.id);


    let btnLogout = document.querySelector('.log-out');

        
    btnLogout.addEventListener('click', () => {
        createLoginPage();
    });

}


export function createAddUserPage() {
    let container = document.querySelector(".container");

    container.innerHTML = `
    <h1>Add New Student</h1>
    <div class="error-container"></div>
    <div class="create-container">
        <p>
            <label for="fullName">Full Name</label>
            <input name="fullName" type="text" id="fullName">
        </p>
        <p>
            <label for="email">Email</label>
            <input name="email" type="email" id="email">
        </p>
        <p>
            <label for="password">Password</label>
            <input name="password" type="password" id="password">
        </p>
        <p>
            <label for="phone">Phone</label>
            <input name="phone" type="number" id="phone">
        </p>
        <div class="buttons-container">
            <button id="submit" disabled>Create New Student</button>
            <button id="cancel">Cancel</button>
        </div>
    </div>
    `;


    const btnSubmit = document.querySelector('#submit');
    const errorContainer = document.querySelector('.error-container');
    const cancelBtn = document.querySelector('#cancel');



    btnSubmit.addEventListener('click', async () => {
        const userData = {
            fullName: inputs.fullName.value,
            email: inputs.email.value,
            password: inputs.password.value,
            phone: inputs.phone.value
        };


        const result = await createUser(userData);
        if (result.success) {
            alert("Student added successfully!");
            createHomePage();
        } else {
            alert("Failed to add student.");
        }
    });


    cancelBtn.addEventListener('click', () => createHomePage());

}

export function createUpdateDeleteUserPage(user){
    let container = document.querySelector(".container");

    container.innerHTML = `
    
    <h1>Update Student</h1>
    <div class = "update-container">
        <p>
            <label for="name">Full name</label>
            <input name="name" type="text" id="name" value=${user.fullName}>
        </p>
        <p>
            <label for="email">Email</label>
            <input name="email" type="email" id="email" value=${user.email}>
        </p>
        <p>
            <label for="password">Password</label>
            <input name="password" type="password" id="password" value =${user.password}>
        </p>
        <p>
            <label for="phone">Phone</label>
            <input name="phone" type="number" id="phone" value=${user.phone}>
        </p>
        <div class = "buttons-container">
        <button id="update-student">Update Student</button>
        <button id="cancel">Cancel</button>
        <button id="delete">Delete Student</button>
        </div>
    </div>

    `

    let cancel = document.querySelector('#cancel');

    cancel.addEventListener('click', () =>{

        createHomePage();
    });

    let update = document.querySelector('#update-student');


    update.addEventListener('click', () =>{

        const fullName = document.querySelector('#name').value;
        const email = document.querySelector('#email').value;
        const password = document.querySelector('#password').value;
        const phone = document.querySelector('#phone').value;
        

        const userResponse = {

            fullName: fullName,
            email: email,
            password: password,
            phone: phone
        };


        updateUser(user.id, userResponse);



        alert("Student update sucessfully");
        createHomePage();

    });

    let deleteBtn = document.querySelector('#delete');

    deleteBtn.addEventListener('click', () =>{

        deleteUser(user.id);
        alert("Student deleted succesfully!");
        createHomePage();
    });



}

export function createGradePage(user) {
    let container = document.querySelector(".container");

    container.innerHTML = `
    <h1>${user.fullName}'s Grades</h1>

    <button class="return-home">Back to main page</button>
    <button class="add-grade">Add Grade</button>
    <table>
        <thead>
            <tr>
                <th>Grade</th>
                <th>Feedback Title</th>
                <th>Feedback Message</th>
                <th>Create date</th>
            </tr>
        </thead>
        <tbody class="table-body">
        </tbody>
    </table>
    `;

    loadGrades(user.id);

    document.querySelector(".return-home").addEventListener("click", createHomePage);
    let addBtn = document.querySelector(".add-grade");
    addBtn.addEventListener("click", () => createAddGradePage(user));


    let tbody = document.querySelector('.table-body');
    tbody.addEventListener('click', async (event) => {
        let grade = event.target;
        


        if (grade.classList.contains("edit-grade")) {
            const gradeId = grade.getAttribute("data-id"); 
            const gradeData = await getGradeById(gradeId); 
            if (gradeData.body) {
                createUpdateGradePage(gradeData.body,user);
            }
        }
    });
}

export function createUpdateGradePage(grade,user){

    let container = document.querySelector(".container");

    container.innerHTML = `
    
    <h1>Update Grade</h1>
    <div class = "update-container">
        <p>
            <label for="grade">Grade</label>
            <input name="grade" type="number" id="grade" value=${grade.grade}>
        </p>
        <p>
            <label for="title">Feedback title</label>
            <input name="title" type="text" id="title" value=${grade.feedback.title}>
        </p>
        <p>
            <label for="message">Feedback message</label>
            <input name="message" type="text" id="message" value=${grade.feedback.message}>
        </p>
        <div class = "buttons-container">
        <button id="update-grade">Update Grade</button>
        <button id="cancel">Cancel</button>
        <button id="delete">Delete Grade</button>
        </div>
    </div>

    `

    let cancel = document.querySelector('#cancel');

    cancel.addEventListener('click', () =>{

        createGradePage(user);
    });

    let update = document.querySelector('#update-grade');


    update.addEventListener('click', () =>{

        const gradeValue = document.querySelector('#grade').value;
        const feedbackData = {
            title: document.querySelector('#title').value,
            message: document.querySelector('#message').value
        };

        const gradeResponse = {

            grade: gradeValue,
            feedback: feedbackData
        };


        updateGrade(grade.id, gradeResponse);



        alert("Grade update sucessfully");
        createGradePage(user);

    });

    let deleteBtn = document.querySelector('#delete');

    deleteBtn.addEventListener('click', () =>{

        deleteGrade(grade.id);
        alert("Grade deleted succesfully!");
        createGradePage(user);
    });

}

export function createAddGradePage(user) {
    let container = document.querySelector(".container");

    container.innerHTML = `
    <h1>Add Grade for ${user.fullName}</h1>
    <div class="error-container"></div>
    <div class="create-container">
        <p>
            <label for="grade">Grade</label>
            <input name="grade" type="number" id="grade" >
        </p>
        <p>
            <label for="feedbackTitle">Feedback Title</label>
            <input name="feedbackTitle" type="text" maxlength="15" id="feedbackTitle">
        </p>
        <p>
            <label for="feedbackMessage">Feedback Message</label>
            <textarea name="feedbackMessage" id="feedbackMessage" maxlength="150"></textarea>
        </p>
        <div class="buttons-container">
            <button id="submit" disabled>Submit Grade</button>
            <button id="cancel">Cancel</button>
        </div>
    </div>
    `;

    const inputs = {
        grade: document.querySelector('#grade'),
        feedbackTitle: document.querySelector('#feedbackTitle'),
        feedbackMessage: document.querySelector('#feedbackMessage')
    };

    const btnSubmit = document.querySelector('#submit');
    const errorContainer = document.querySelector('.error-container');
    const cancelBtn = document.querySelector('#cancel');

    for (const key in inputs) {
        inputs[key].addEventListener('input', (e) => {
            e.preventDefault();
            updateErrors(inputs, errorContainer, btnSubmit);
        });

        inputs[key].addEventListener('mousedown',()=>{
            inputs[key].classList.add("touched");
        })
    }

    container.addEventListener("input", (event) =>{
        event.preventDefault();
    })

    btnSubmit.addEventListener('click', async () => {

        const feedbackData = {
            title: inputs.feedbackTitle.value,
            message: inputs.feedbackMessage.value
        };
        
        const gradeData = {
            grade: inputs.grade.value,
            feedback: feedbackData,
            userId: user.id
        };

        const result = await createGrade(gradeData, user.id);
        if (result.status == '201') {
            alert("Grade added successfully!");
            createGradePage(user);
        } else {
            alert("Failed to add grade.");
        }
    });


    cancelBtn.addEventListener('click', () => createGradePage(user));

    updateErrors(inputs, errorContainer, btnSubmit);

}


function createGradeCard(grade) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${grade.grade}</td>
        <td>${grade.feedback.title}</td>
        <td>${grade.feedback.message}</td>
        <td>${grade.createDate}</td>
        <td><a href ="#" class = "edit-grade" data-id = ${grade.id}> Edit grade </a>
    `;
    return tr;
}



function attachGradeCard(grades) {
    const tbody = document.querySelector(".table-body");
    grades.map(grade => createGradeCard(grade)).forEach(element => {
        tbody.appendChild(element);
    });
}

async function loadGrades(userId) {
    try {
        let response = await getUsersGrades(userId);
        let grades = response.body.gradeResponseList;
        if (Array.isArray(grades) && grades.length > 0) {
            attachGradeCard(grades);
        } else {
            attachUserHasNoGradesMessage();
        }
    } catch (err) {
        console.error(err);
    }
}

function attachUserHasNoGradesMessage(){

    let message = document.createElement("div");
    message.classList.add("no-grades");

    message.innerHTML = 
    `
    <p>This user has no registred grades </p>
    
    `;

    const tbody = document.querySelector(".table-body");
    tbody.appendChild(message);

}

function createClientGradeCard(grade) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${grade.grade}</td>
        <td>${grade.feedback.title}</td>
        <td>${grade.feedback.message}</td>
        <td>${grade.createDate}</td>
    `;
    return tr;
}

function attachClientGradeCard(grades) {
    const tbody = document.querySelector(".table-body");
    grades.map(grade => createClientGradeCard(grade)).forEach(element => {
        tbody.appendChild(element);
    });
}

async function loadClientGrades(userId) {
    try {
        let response = await getUsersGrades(userId); 
        let grades = response.body.gradeResponseList; 
        if (Array.isArray(grades) && grades.length > 0) {
            attachClientGradeCard(grades);
        } else {
            attachUserHasNoGradesMessage();
        }
        
    } catch (err) {
        console.error(err);
    }
}

function createUserCard(user) {
    const tr = document.createElement("tr");
    if(user.userRole == 'CLIENT'){
        tr.innerHTML = `
            <td><a href="#" data-id="${user.id}" class="user-link">${user.fullName}</a></td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td><a href="#" data-id="${user.id}" class="grade-link">View Grades</a></td>
        `;
    }
    return tr;
}


function attachUserCard(users) {
    let tbody = document.querySelector(".table-body");
    users.map(user => createUserCard(user)).forEach(element => {
        tbody.appendChild(element);
    });
}


async function loadUsers() {
    try {
        let response = await getAllStudents();
        let users = response.body.list;
        attachUserCard(users);
    } catch (err) {
        console.log(err);
    }
}

function updateErrors(inputs, errorContainer, btnSubmit) {
    const errors = validateInputs(inputs);
    addErrors(errors, errorContainer, btnSubmit);
}


function validateInputs(inputs) {
    let errors = [];
    for (const key in inputs) {
        if (inputs[key].classList.contains("touched")&&inputs[key].value.trim() === "") {
            errors.push(`${key} is required.`);
        }
    }
    return errors;
}

function addErrors(errors, errorContainer, btnSubmit) {
    errorContainer.innerHTML = errors.map(error => `<p>${error}</p>`).join('');
    btnSubmit.disabled = errors.length > 0;
}


function checkStatusCode(code){

    const statusCodes = {

        200: "OK - The request was successful.",
        201: "Created - The resource was successfully created.",
        204: "No Content - The request was successful, but there's no content to send back.",
        400: "Bad Request - The server couldn't understand the request.",
        401: "Unauthorized - Authentication is required and has failed.",
        403: "Forbidden - You don't have permission to access this resource.",
        404: "Not Found - The requested resource could not be found.",
        500: "Internal Server Error - Something went wrong on the server.",
        502: "Bad Gateway - The server received an invalid response from an upstream server.",
        503: "Service Unavailable - The server is currently unavailable."


    }

    return statusCodes[code] || "Undefiend status code";

}