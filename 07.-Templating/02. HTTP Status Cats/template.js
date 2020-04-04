function toggle(e) {
    e.textContent = e.textContent.trim() === 'Show status code' ? 'Hide status code' : 'Show status code';

    const statusDiv = e.parentNode.getElementsByClassName('status')[0];
    statusDiv.style.display = statusDiv.style.display === 'none' ? 'inline' : 'none';
}

(() => {
    renderCatTemplate();

    async function renderCatTemplate() {
        // TODO: Render cat template and attach events
        const source = await fetch('./templates/cats.hbs')
            .then(res => res.text());

        const template = Handlebars.compile(source);

        const context = {
            cats: window.cats
        };
        const catsHTML = template(context);
        const html = document.getElementById('allCats');
        html.innerHTML = catsHTML;
    }

})()