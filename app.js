/*var budgetController = (function(){

    //private variable
    var x = 23; 

    //private function
    var add = function (a) {
        return x + a;
    }

    //public function, Closure
    return {
        publicTest: function(b){
            return add(b);
        }
    }

})();


var UIController = (function (){
    //Some Code
})();

//Funcion que conecta ambos controladores budgetController y UIController
var controller = (function(budgetCtrl, UICtrl){
    //private variable
    var z = budgetCtrl.publicTest(5);

    //public method
    return {
        anotherPublic: function(){
            console.log(z);
        }
    }
})(budgetController, UIController); 
*/
//BUDGET CONTROLLER
var budgetController = (function(){

})();
    
//UI CONTROLLER    
var UIController = (function (){
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    };
    
    return {
            getInput: function () {
                return {
                    type: document.querySelector(DOMstrings.inputType).value,
                    description: document.querySelector(DOMstrings.inputDescription).value,
                    value: document.querySelector(DOMstrings.inputValue).value
                };
            },
            getDOMstrings: function() {
                return DOMstrings;
            }
    };
})();
    
//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){
    
    var DOM = UICtrl.getDOMstrings();
    
    var ctrlAddItem = function() {
        //TODO
        //1. Obtener los valores de los inputs
        var input = UICtrl.getInput();
        console.log(input);
        //2. Agregar un Item al BudgetController

        //3. Agregar el Item a la UI

        //4. Calcular el Budget

        //5. Mostrar el budget en la UI
    }

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event){
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();            
        }


    });
        
})(budgetController, UIController); 