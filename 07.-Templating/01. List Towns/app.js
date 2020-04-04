function solve() {
    const loadBtn = document.getElementById('btnLoadTowns');
    
    loadBtn.addEventListener('click', async function loadBtnHandler() {

        const townsInputHTML = document.getElementById('towns');
        const towns = townsInputHTML.value.split(', ');

        const source = await fetch('./towns.hbs')
            .then(resp => resp.text());
       
        const template = Handlebars.compile(source);
       
        const context = { towns }; //Always is Object for the template!
        
        const townsToHTML = template(context);
        
        const rootDiv = document.getElementById('root');
        rootDiv.innerHTML = townsToHTML;
    });
}

solve();