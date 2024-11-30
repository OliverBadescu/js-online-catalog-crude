import { getAllStudents, getUserById, getUsersGrades, createGrade, createUser } from "./service.js";

// Create Home Page
export function createHomePage() {
    loadUsers();
    let container = document.querySelector(".container");

    container.innerHTML = `
    <h1>Students</h1>
    <button class="add-student">Add New Student</button>
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
        
        // View user details on click
        if (user.classList.contains("user-link")) {
            const userId = user.getAttribute("data-id"); 
            const userData = await getUserById(userId); 
            if (userData) {
                createUserPage(userData);
            } else {
                alert("Failed to load user details");
            }
        }

        // View grades on click
        if (user.classList.contains("grade-link")) {
            const userId = user.getAttribute("data-id"); 
            const userData = await getUserById(userId); 
            if (userData) {
                createGradePage(userData);
            }
        }
    });
}

// Create Add User Page
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
            <label for="phone">Phone</label>
            <input name="phone" type="tel" id="phone">
        </p>
        <div class="buttons-container">
            <button id="submit" disabled>Create New Student</button>
            <button id="cancel">Cancel</button>
        </div>
    </div>
    `;

    const inputs = {
        fullName: document.querySelector('#fullName'),
        email: document.querySelector('#email'),
        phone: document.querySelector('#phone')
    };

    const btnSubmit = document.querySelector('#submit');
    const errorContainer = document.querySelector('.error-container');
    const cancelBtn = document.querySelector('#cancel');

    for (const key in inputs) {
        inputs[key].addEventListener('input', () => {
            updateErrors(inputs, errorContainer, btnSubmit);
        });
    }


    btnSubmit.addEventListener('click', async () => {
        const userData = {
            fullName: inputs.fullName.value,
            email: inputs.email.value,
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


    updateErrors(inputs, errorContainer, btnSubmit);
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
}

export function createAddGradePage(user) {
    let container = document.querySelector(".container");

    container.innerHTML = `
    <h1>Add Grade for ${user.fullName}</h1>
    <div class="error-container"></div>
    <div class="create-container">
        <p>
            <label for="grade">Grade</label>
            <input name="grade" type="number" id="grade">
        </p>
        <p>
            <label for="feedbackTitle">Feedback Title</label>
            <input name="feedbackTitle" type="text" id="feedbackTitle">
        </p>
        <p>
            <label for="feedbackMessage">Feedback Message</label>
            <textarea name="feedbackMessage" id="feedbackMessage"></textarea>
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
        inputs[key].addEventListener('input', () => {
            updateErrors(inputs, errorContainer, btnSubmit);
        });
    }


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
        if (result.success) {
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
        let grades = response.gradeResponseList;
        attachGradeCard(grades);
    } catch (err) {
        console.error(err);
    }
}

function createUserCard(user) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td><a href="#" data-id="${user.id}" class="user-link">${user.fullName}</a></td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
        <td><a href="#" data-id="${user.id}" class="grade-link">View Grades</a></td>
    `;
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
        let users = response.list;
        attachUserCard(users);
    } catch (err) {
        console.log(err);
    }
}


async function getUser(userId) {
    try {
        let userData = await getUserById(userId);
        return userData;
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
        if (inputs[key].value.trim() === "") {
            errors.push(`${key} is required.`);
        }
    }
    return errors;
}

function addErrors(errors, errorContainer, btnSubmit) {
    errorContainer.innerHTML = errors.map(error => `<p>${error}</p>`).join('');
    btnSubmit.disabled = errors.length > 0;
}
