import {
    extractDataFromForm
} from "./form-initilizator.js";
import {
    getAllStudents,
    updateStudent
} from "./firebase-requests.js";

//step 4
function solve() {
    let form = document.querySelector('form');
    let tbody = document.querySelector('tbody');
    //step 5
    form.addEventListener('submit', formHandler);
    //step 7
    const formConfig = ['firstName', 'lastName', 'facultyNumber', 'grade'];
    //step 9 - second Ajax to initialize table
    getAllStudents()
        .then(students => {
            Object.entries(students).sort((a,b)=>Number(a.id)-Number(b.id)).map(([ id, studentData]) => {
                addTableRow(tbody, studentData, id)
            })
        });
    //step 6
    function formHandler(e) {
        e.preventDefault();
        let formResult = extractDataFromForm(e.target, formConfig);
        //Ajax
        getAllStudents().then(students => {
            let nextStudentId = !students ? 0 : Object.keys(students).length;
            updateStudent(formResult, nextStudentId)
                .then(() => getAllStudents())
                .then(students => {
                    Object.entries(students).map(([ id, studentData]) => {
                        addTableRow(tbody, studentData, id)
                    })
                });
        });
    }
}
//step 8
function addTableRow(tbody, studentData, id) {
    let tr = document.createElement('tr');
    //step 8
    tr.setAttribute('data-student-id', id);
    tr.innerHTML = `
    <td>${id}</td>
    <td>${studentData.firstName}</td>
    <td>${studentData.lastName}</td>
    <td>${studentData.facultyNumber}</td>
    <td>${studentData.grade}</td>
    <td>
        <button data-method="edit">Edit</button>
        <button data-method="delete">Delete</button>
    </td>
    `;

    tbody.appendChild(tr);
}

solve();