function attachEvents() {

    const messagesContainer = document.getElementById('messages');
    const authorInput = document.getElementById('author');
    const textInput = document.getElementById('content');

    function refreshMessages() {
        let inputMessages = [];

        fetch("https://rest-messanger.firebaseio.com/messanger.json")
            .then(resources => resources.json())
            .then(data => {
                Object.entries(data)
                    .forEach(([ _, message]) => {
                        const { author, content } = message;
                        inputMessages.push(`${author}: ${content}`);
                    })

                    messagesContainer.textContent = inputMessages.join('\n');
            })
            .catch(() => {
                console.log("Error!");
            });
    }

    function submitMessage() {
        const name = authorInput.value;
        const message = textInput.value;

        const headers = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                author: name,
                content: message
            })
        };

        fetch("https://rest-messanger.firebaseio.com/messanger.json", headers)
            .then(() => {
                authorInput.value = '';
                textInput.value = '';

                refreshMessages();
            })
            .catch(() => {
                console.log("Error!");
            });
    }

    return {
        refreshMessages,
        submitMessage
    };
}

const result = attachEvents();