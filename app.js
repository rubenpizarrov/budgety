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

    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        });
        data.totals[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1

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

        calculateBudget: function(){
            //calcular total de incomes y expenses
            calculateTotal('exp');
            calculateTotal('inc');
            //calcular el total inconme - expenses
            data.budget = data.totals.inc - data.totals.exp;
            // calcular el porcentaje de gastos respecto a los incomes 2000/1500= 133,333 = 133%
            if(data.totals.exp > 0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }

        },

        getBudget: function(){
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
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
        expensesContainer: '.expenses__list',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        budgetLabel: '.budget__value',
        percentageLabel: '.budget__expenses--percentage'
    };
    
    return {
            getInput: function () {
                return {
                    type: document.querySelector(DOMstrings.inputType).value,
                    description: document.querySelector(DOMstrings.inputDescription).value,
                    value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
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

            //Muestra los datos del objeto getBudget en la UI
            displayBudget: function(obj) {
                document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
                document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;
                document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
                if ( obj.percentage > 0 ) {
                    document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
                } else {
                    document.querySelector(DOMstrings.percentageLabel).textContent = '---';
                }
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

    var updateBudget = function(){
        //1. Calcular el Budget
        budgetCtrl.calculateBudget();
        //2. Return de budget
        var budget = budgetCtrl.getBudget();
        //3. Display en la UI
        UICtrl.displayBudget(budget);
    };
    
    var ctrlAddItem = function() {
        var input, newItem;
        //TODO
        //1. Obtener los valores de los inputs
        input = UICtrl.getInput();
        if(input.description !== "" && !isNaN(input.value) && input.value > 0){
            //2. Agregar un Item al BudgetController
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            //3. Agregar el Item a la UI
            UICtrl.addListItem(newItem, input.type);
            // 3.5 Limpiar Inputs
            UICtrl.clearFields();
            //4. Calcular y actualizar el Budget
            updateBudget();
            //5. Mostrar el budget en la UI
        }
    };

   return {
        init: function(){
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
   };
        
})(budgetController, UIController); 

controller.init();