function attachEvents() {
    const phoneBookElement = document.getElementById('phonebook');
    const personInput = document.getElementById('person');
    const phoneInput = document.getElementById('phone');

    function loadPhoneBook() {
        fetch(`https://phonebook-nakov.firebaseio.com/phonebook.json`)
            .then(res => res.json())
            .then(data => {
                Object.entries(data)
                    .forEach(([ elementId, phoneBookData ]) => {
                        console.log(phoneBookData);
                        const {
                            person,
                            number
                        } = phoneBookData;
                        const li = document.createElement('li');
                        li.textContent = `${person}: ${number}`;

                        const deleteBtn = document.createElement('button');
                        deleteBtn.setAttribute("data-target", elementId);
                        deleteBtn.addEventListener('click', deleteBtnHandler);
                        deleteBtn.textContent = 'Delete';

                        li.appendChild(deleteBtn);
                        phoneBookElement.appendChild(li);
                    })
            })
            .catch(errorHandler)
    }

    function createPhoneBook() {
        const person = personInput.value;
        const number = phoneInput.value;

        const headers = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                person,
                number
            })
        };

        fetch(`https://phonebook-nakov.firebaseio.com/phonebook.json`, headers)
            //.then(res => res.json())
            .then(() => {
                phoneBookElement.innerHTML = '';
                personInput.value = '';
                phoneInput.value = '';

                loadPhoneBook();
            })
            .catch(errorHandler);
    }

    function deleteBtnHandler() {
        const phoneBookId = this.getAttribute('data-target');

        const headers = {
            method: 'DELETE'
        }

        fetch(`https://phonebook-nakov.firebaseio.com/phonebook/${phoneBookId}.json`, headers)
        .then(()=>{
            phoneBookElement.innerHTML = '';
            loadPhoneBook();
        })
        .catch(errorHandler);
    }

    function errorHandler() {
        //TODO
    }
    return {
        loadPhoneBook,
        createPhoneBook
    }
}

let result = attachEvents();