function getFibonator(){
    function fibonacci(n) {
        if (n <= 1) {
            return 1;
        }
        return fibonacci(n - 2) + fibonacci(n - 1);
    }

    let counter = 0;

    return function closureFunc(){
        let result = fibonacci(counter);
        counter++;
        
        return result;  
    }
}

let fib = getFibonator();
console.log(fib());
console.log(fib());
console.log(fib());
console.log(fib());
console.log(fib());
console.log(fib());