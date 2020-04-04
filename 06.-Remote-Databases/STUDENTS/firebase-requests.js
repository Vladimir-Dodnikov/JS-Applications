//step 2
export const apiKey = `https://books-6e718.firebaseio.com/`; //use your database URL here to Run the API

//step 3
export const getAllStudents = () => {
    return fetch(apiKey + 'students.json').then(r=>r.json());
};

export const createNewStudent = (studentBody) =>{
    return fetch(apiKey + 'students.json', {
        method: 'POST',
        body: JSON.stringify(studentBody)
    }).then(r=>r.json());
};

export const updateStudent = (studentBody, studentId) =>{
    return fetch(`${apiKey}students/${studentId}.json`, {
        method: 'PUT',
        body: JSON.stringify(studentBody)
    }).then(r=>r.json());
};

export const deleteStudent = (studentId) =>{
    return fetch(`${apiKey}students/${studentId}.json`, {
        method: "DELETE"
    }).then(r=>r.json());
};

export const getStudentById = (studentId) => {
    return fetch(`${apiKey}students/${studentId}.json`).then(r=>r.json());
};

export const patchStudent = (studentBody, studentId) =>{
    return fetch(`${apiKey}students/${studentId}.json`, {
        method: 'PATCH',
        body: JSON.stringify(studentBody)
    }).then(r=>r.json());
};