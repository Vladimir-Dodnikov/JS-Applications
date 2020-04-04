import {
    monkeys
} from './monkeys.js';

(async () => {
    Handlebars.registerPartial(
        'monkey',
        await fetch('./templates/monkey.hbs').then((r) => r.text())
    );

    const templateSrc = await fetch('./templates/monkeys-template.hbs').then(r => r.text());

    const template = Handlebars.compile(templateSrc);

    const resultHTML = template({
        monkeys
    });

    document.querySelector('section').innerHTML += resultHTML;

    document.querySelectorAll('button').forEach((btn) => {
        btn.addEventListener('click', () => {
            const pInfo = btn.parentNode.querySelector('p');
            pInfo.style.display = pInfo.style.display === 'none' ? 'inline' : 'none';
        })
    })
})();