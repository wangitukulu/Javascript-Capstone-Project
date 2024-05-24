//Build a Javascript application that interacts with The Meal DB API to take and complete orders of the chefs

function takeOrder() { // take order function
    const main_ingredient = prompt("What is your main ingredient for the order ")// To take the user order
    const main_ingredient_lower = main_ingredient.replace(" ", "_").toLowerCase();
    console.log(main_ingredient_lower)

//Call the API to retrieve a list of the chef s favourite meals 
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${main_ingredient_lower}`)
        .then((res) => res.json())
        .then((result) => {
            if (result.meals == null) {
                alert("No Meals found with this ingredient. Please try again")
                takeOrder()
            } else {
                const favorite_meal_index = Math.floor(Math.random() * result.meals.length)//To randomly select a chef favorite meal and set it as order
                const favorite_meal = result.meals[favorite_meal_index]

                // Define the order details by its description,order number and completion status
                let meal_order = {
                    description: favorite_meal.strMeal,
                    orderNumber: generatingOrderNumber(),
                    completionStatus: "incomplete"
                }
                storeOrder(meal_order)
            }
        }
        )
}


function generatingOrderNumber() {
    let lastOrderNumber = parseInt(sessionStorage.getItem("lastOrderNumber")) || 0
    return lastOrderNumber + 1
}

//storing order
function storeOrder(order) {
    let orders = JSON.parse(sessionStorage.getItem('orders')) || [];

    //  Ensure each new order has a unique order number
    order.orderNumber = generatingOrderNumber();

    //  Update the last generated order number in sessionStorage
    sessionStorage.setItem('lastOrderNumber', order.orderNumber);

    orders.push(order);

    // Store the collection of orders as a single value in a JSON array
    sessionStorage.setItem('orders', JSON.stringify(orders));

    console.log(orders)
}
// Displaying and completing orders
function displayAndCompleteOrders() {
    let orders = JSON.parse(sessionStorage.getItem('orders')) || [];
    let incompleteOrders = orders.filter(order => order.completionStatus === "incomplete");
    console.log(incompleteOrders)


    // Step 3.1: Display incomplete orders
    const incompleteOrderNumbers = incompleteOrders.map(order => `${order.orderNumber}: ${order.description}`).join('\n');//Present order number and description only
    const userInput = prompt(`Incomplete Orders:\n${incompleteOrderNumbers}\nEnter the order number to mark as complete (or enter 0 for not completing):`);

    if (userInput !== null && userInput !== "") {
        const orderNumber = parseInt(userInput);
        console.log(orderNumber)

        // Step 3.5: Use filter() to select only incomplete orders
        const selectedOrder = incompleteOrders.find(order => order.orderNumber === orderNumber);

        if (selectedOrder) {
            // Step 3.2: Prompt the user to mark the order as complete
            const completionInput = prompt(`Mark Order ${orderNumber} as complete? (Enter 'yes' or 'no')`);

            if (completionInput.toLowerCase() === 'yes') {
                // Step 3.3: Update the order's completion status in sessionStorage
                selectedOrder.completionStatus = "complete";
                sessionStorage.setItem('orders', JSON.stringify(incompleteOrders));

                alert(`Order ${orderNumber} marked as complete!`);
            } else {
                alert("Order completion cancelled.");
            }
        } else {
            // Step 3.4: Display an appropriate response if the order number doesn't exist
            alert(`Order ${orderNumber} does not exist or is already completed.`);
        }
    } else {
        alert("Operation cancelled.");
    }

}

//takeOrder()
//displayAndCompleteOrders()
