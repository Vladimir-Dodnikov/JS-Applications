function extendObj(){
    let myObj = {
        extend: function (template) {
            Object.keys(template).forEach(key=>{
                if (typeof template[key] === 'function') {
                    Object.getPrototypeOf(this)[key] = template[key];
                    //Object.prototype[key] = template[key];
                } else {
                    this[key]=template[key];
                }
            });
        }
    };
    // myObj.extend({
    //     some: 123,
    //     someFunc: ()=>console.log('func')
    // })
    // console.log(myObj);
    return myObj;
} 
extendObj();
