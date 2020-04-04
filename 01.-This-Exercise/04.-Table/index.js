function solve() {
   let tableBody = document.querySelector('tbody');
   let tableRows = document.querySelectorAll('tbody tr');

   tableBody.addEventListener('click', (e) => {
      e.preventDefault();

      let trRef = e.target.parentNode;

      Array.from(tableRows).forEach(x=>{
         if (x!== trRef && x.style.cssText) {
            x.style.cssText = '';
         }
      })
      trRef.style.cssText = trRef.style.cssText ? '' : 'background-color: rgb(65, 63, 94);';

   })
}