// 'resp' is object, 'docs' is prop of resp, 'docs' is arr
// 'data' is elem of arr, 'data' is object

//extract data from 
export default function(docs){
    return {...docs.data(), id: docs.id};
}