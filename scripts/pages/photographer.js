//Mettre le code JavaScript lié à la page photographer.html
const params = (new URL(document.location)).searchParams;
let paramsValues = {};

// Adds the params to the object paramsValues
for(const param of params){
    //exemple of param : ['id','240']
    paramsValues[param[0]] = param[1];
}
console.log(paramsValues);
