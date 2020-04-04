//step 2
import {
    apiKey,
    createNewBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBook,
    patchBook
} from './firebase-requests.js';
//step 19
let lastSelectedBook = '';
//step 4
function solve() {
    //step 6
    let formInputs = ['title', 'author', 'isbn'];
    //step 7
    const form = document.querySelector('form');
    form.addEventListener('submit', submitHandler);
    //step 8
    function submitHandler(event) {
        event.preventDefault();
        //extract elements from form - option 1
        // let parsedForm = formInputs.reduce((acc,inputName)=>{
        //     acc[inputName] = event.target.elements[inputName].value;
        //     return acc;
        // }, {});

        let parsedForm = extractDataFromForm(form, formInputs);

        createNewBook(parsedForm);
    }
    //step 10
    const tbody = document.querySelector('tbody');
    const loadBooksBtn = document.querySelector('#loadBooks');
    loadBooksBtn.addEventListener('click', loadBooksHandler);
    //step 11
    function loadBooksHandler() {
        //AJAX
        getAllBooks().then(response => {
            tbody.innerHTML = '';
            //step 12
            //console.log(response); //check
            Object.entries(response).map(([id, bookValue]) => {
                addTableRow(tbody, bookValue, id);
            });
        })
    }
    //step 14
    tbody.addEventListener('click', tableRowHandler);
    async function tableRowHandler(e) {
        //get parent when click on tableRow element;
        let targetBookId = e.target.closest('tr').dataset.bookId;
        lastSelectedBook = targetBookId;
        //step 16
        if (e.target instanceof HTMLButtonElement) {
            const {
                method
            } = e.target.dataset;

            if (method === 'edit') {
                await updateBook(extractDataFromForm(form, formInputs), targetBookId);
            }

            if (method === 'delete') {
                await deleteBook(targetBookId);
            }

            loadBooksHandler();
            return;
        }
        //AJAX
        getBookById(targetBookId).then((response) => {
            fillFormData(form, response);
        })
    }
    //step 17
    let tags = document.querySelector('#tagForm');
    let tagInputs = ['tags'];

    tags.addEventListener('submit', tagHandler);
    //step 18
    function tagHandler(e) {
        e.preventDefault();
        let parsedForm = extractDataFromForm(tags, tagInputs);
        patchBook(parsedForm, lastSelectedBook);
    }
}
//extract elements from form - option 2
function extractDataFromForm(formRef, formConfig) {
    return formConfig.reduce((acc, inputName) => {
        acc[inputName] = formRef.elements[inputName].value;
        return acc;
    }, {});
}
//step 9
function addTableRow(tbody, bookValue, id) {
    let tr = document.createElement('tr');
    //step 13
    tr.setAttribute('data-book-id', id);
    tr.innerHTML = `
    <td>${bookValue.title}</td>
    <td>${bookValue.author}</td>
    <td>${bookValue.isbn}</td>
    <td>${bookValue.tags}</td>
    <td>
        <button data-method="edit">Edit</button>
        <button data-method="delete">Delete</button>
    </td>
    `;

    tbody.appendChild(tr);
}
//step 15
function fillFormData(form, formValue) {
    Object.entries(formValue).map(([inputName, value]) => {
        form.elements.namedItem(inputName).value = value;
    })
}

solve();