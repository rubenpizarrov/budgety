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

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        toltals: {
            exp: 0,
            inc: 0
        }

    };

    return {
        addItem: function (type, des, val) {
            var newItem, ID;
            
            // Crea un nuevo id tal que, será, ID = ultimo + 1
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;    
            } else {
                ID = 0;
            }
            // Crea un nuevo item basado en si es inc= income o exp = expense
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Expense(ID, des, val);
            }

            // Situa el nuevo elemento al final de el arreglo 
            data.allItems[type].push(newItem);
            
            // retorna un nuevo elemento
            return newItem;
        },

        testing: function(){
            console.log(data);
        }
    };

})();
    
//UI CONTROLLER    
var UIController = (function (){
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomesContainer: '.income__list',
        expensesContainer: '.expenses__list'
    };
    
    return {
            getInput: function () {
                return {
                    type: document.querySelector(DOMstrings.inputType).value,
                    description: document.querySelector(DOMstrings.inputDescription).value,
                    value: document.querySelector(DOMstrings.inputValue).value
                };
            },

            addListItem: function (obj, type) {
               var html, newHtml, element; 
                // Create HTML
                if(type === 'inc'){ 
                    element = DOMstrings.incomesContainer;

                    html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                } else if (type === 'exp'){
                    element = DOMstrings.expensesContainer;

                    html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                }

                // Replace los placeholders 
                newHtml = html.replace('%id%', obj.id);
                newHtml = newHtml.replace('%description%', obj.description);
                newHtml = newHtml.replace('%value%', obj.value);

                // Insertar el HTML en el DOM
                document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

            },


            clearFields: function(){
                var fields, fieldsArray;

                //es lo mismo que = document.querySelectorAll('.add__description','add__value')
                fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
                //Transforma el NodeList en un array
                fieldsArray = Array.prototype.slice.call(fields);
                
                fieldsArray.forEach(function(current, index, array) {
                    current.value = "";
                });
                fieldsArray[0].focus();
            },

            getDOMstrings: function() {
                return DOMstrings;
            }
    };
})();
    
//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl){
    
    var setupEventListeners = function () {
        
        var DOM = UICtrl.getDOMstrings();
        
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        
        document.addEventListener('keypress', function(event){
        if (event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();            
            }
        });
    };

    
    
    var ctrlAddItem = function() {
        var input, newItem;
        //TODO
        //1. Obtener los valores de los inputs
        input = UICtrl.getInput();
        //2. Agregar un Item al BudgetController
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        //3. Agregar el Item a la UI
        UICtrl.addListItem(newItem, input.type);
        // 3.5 Limpiar Inputs
        UICtrl.clearFields();
        //4. Calcular el Budget

        //5. Mostrar el budget en la UI
    };

   return {
        init: function(){
            console.log('Aplicacion started');
            setupEventListeners();
        }
   };
        
})(budgetController, UIController); 

controller.init();