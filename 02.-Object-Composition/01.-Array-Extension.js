//IIFE 
(() => {
    Array.prototype.last = function () {
        return this[this.length - 1];
    }
    Array.prototype.skip = function (n) {
        let newArr = [];
        for (let i = n; i < this.length; i++) {
            let element = this[i];
            newArr.push(element);
        }
        return newArr;
        //return this.slice(n);
    }
    Array.prototype.take = function (n) {
        return this.slice(0, n);
    }
    Array.prototype.sum = function () {
        let sum = 0;
        for (const num of this) {
            sum += num;
        }
        return sum;
        //return this.reduce((acc, n)=> acc + n, 0);
    }
    Array.prototype.average = function () {
        return this.sum() / this.length;
    }
    // let arr = [1, 2, 3, 4];
    // console.log(arr.average());

})();