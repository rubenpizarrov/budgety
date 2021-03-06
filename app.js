//BUDGET CONTROLLER
var budgetController = (function(){

    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome){
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);    
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function(){
        return this.percentage;
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
                newItem = new Income(ID, des, val);
            }

            // Situa el nuevo elemento al final de el arreglo 
            data.allItems[type].push(newItem);
            
            // retorna un nuevo elemento
            return newItem;
        },

        deleteIten: function(type, id){
            var ids, index;
            ids = data.allItems[type].map(function(current){
                return current.id; 
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
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

        calculatePercentages: function() {
            data.allItems.exp.forEach(function(cur){
                cur.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function(){
            var allPerc = data.allItems.exp.map(function(cur){
                return cur.getPercentage();
            });
            return allPerc;
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
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expPercentageLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };
    
    var formatNumber = function(num, type){
        var numSplit, int, dec;
        num = Math.abs(num);
        num = num.toFixed(2);
        numSplit = num.split('.');
        int = numSplit[0];
        if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3 , 3);
        }
        dec = numSplit[1];
        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
    };

    var nodeListForEach = function(list, callback){
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
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

                    html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                } else if (type === 'exp'){
                    element = DOMstrings.expensesContainer;

                    html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                }

                // Replace los placeholders 
                newHtml = html.replace('%id%', obj.id);
                newHtml = newHtml.replace('%description%', obj.description);
                newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

                // Insertar el HTML en el DOM
                document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

            },

            deleteListItem: function(selectorId){
                var el =  document.getElementById(selectorId);
                el.parentNode.removeChild(el);
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
                var type;

                obj.budget > 0 ? type = 'inc' : type = 'exp';

                document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, type);
                document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'inc');
                document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, 'exp');
                if ( obj.percentage > 0 ) {
                    document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
                } else {
                    document.querySelector(DOMstrings.percentageLabel).textContent = '---';
                }
            },

            displayPercentages: function(percentages){
                var fields = document.querySelectorAll(DOMstrings.expPercentageLabel);

                //Custom ForEach NodeList
                nodeListForEach(fields, function(current, index){
                    if (percentages[index] > 0) {
                        current.textContent = percentages[index] + '%';
                    } else { 
                        current.textContent = '---';
                    }
                });

            },

            displayDate: function(){
                var now, months, month, year;
                
                now = new Date();
                months = ['Enero', 'Feberero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Dieciembre'];
                year = now.getFullYear();
                month = now.getMonth();

                document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
            },

            changedType: function(){
                var fields = document.querySelectorAll(
                    DOMstrings.inputType + ',' +
                    DOMstrings.inputDescription + ',' + 
                    DOMstrings.inputValue);

                nodeListForEach(fields, function(current){
                    current.classList.toggle('red-focus');
                });

                document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
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
        //Event delegation
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType)
    };

    var updateBudget = function(){
        //1. Calcular el Budget
        budgetCtrl.calculateBudget();
        //2. Return de budget
        var budget = budgetCtrl.getBudget();
        //3. Display en la UI
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function(){
        //1.- Calcular los porcentajes
        budgetCtrl.calculatePercentages();
        //2. Leerlos desde el budgetController
        var percentages = budgetCtrl.getPercentages();
        //3. Update de UI
        UICtrl.displayPercentages(percentages);
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
            //5. Mostrar el budget en la UI
            updateBudget();
            //6. Actualizar Porcentajes
            updatePercentages();

        }
    };

    var ctrlDeleteItem = function(event){
        var itemID, splitID, type, ID;
        //Bubbling
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemID) {
            //inc-0
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //1- Borrar un item de la data
            budgetCtrl.deleteIten(type, ID);
            //2- Borrar un item de la UI
            UICtrl.deleteListItem(itemID);
            //3- Actualizar el valor del Budget
            updateBudget();
            //4.- Actualizar los porcentajes
            updatePercentages();
        }
    };

   return {
        init: function(){
            UICtrl.displayDate();
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