//step 1
export const apiKey = `https://books-6e718.firebaseio.com/`; //use your database URL here to Run the API

//step 3
export const getAllBooks = () => {
    return fetch(apiKey + 'books.json').then(r=>r.json());
};

export const createNewBook = (bookBody) =>{
    return fetch(apiKey + 'books.json', {
        method: 'POST',
        body: JSON.stringify(bookBody)
    }).then(r=>r.json());
};

export const updateBook = (bookBody, bookId) =>{
    return fetch(`${apiKey}books/${bookId}.json`, {
        method: 'PUT',
        body: JSON.stringify(bookBody)
    }).then(r=>r.json());
};

export const deleteBook = (bookId) =>{
    return fetch(`${apiKey}books/${bookId}.json`, {
        method: "DELETE"
    }).then(r=>r.json());
};
//step 14
export const getBookById = (bookId) => {
    return fetch(`${apiKey}books/${bookId}.json`).then(r=>r.json());
};
//step 19
export const patchBook = (bookBody, bookId) =>{
    return fetch(`${apiKey}books/${bookId}.json`, {
        method: 'PATCH',
        body: JSON.stringify(bookBody)
    }).then(r=>r.json());
};