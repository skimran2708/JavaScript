const menuItems = [
    {
        id : 1,
        name : "Paneer Tikka",
        price : 150.00,
        category : "starter"
    },
    {
        id : 2,
        name : "Veg Manchurian",
        price : 120.00,
        category : "starter"
    },
    {
        id : 3,
        name : "Seekh Kabab",
        price : 200.00,
        category : "main course"
    },
    {
        id : 4,
        name : "Butter Naan",
        price : 60.00,
        category : "starter"
    },
    {
        id : 5,
        name : "Veg Biryani",
        price : 300.00,
        category : "main course"
    },
    {
        id : 6,
        name : "Paneer biryani",
        price : 350.00,
        category : "main course"
    },
    {
        id : 7,
        name : "Chicken biryani",
        price : 400.00,
        category : "main course"
    },
    {
        id : 8,
        name : "Gulab Jamun",
        price : 150.00,
        category : "dessert"

    },
    {
        id : 9,
        name : "Kheer",
        price : 120.00,
        category : "dessert"

    },
    {
        id : 10,
        name : "Jalebi",
        price : 130.00,
        category : "dessert"

    }
];

//showing menu items
for(let i=0;i<menuItems.length;i++){
    let menuList = document.getElementsByClassName('menu-items')[0];
    menuList.insertAdjacentHTML("beforeBegin",`
        <div class="item-body" id="item${menuItems[i]['id']}" draggable=true ondragstart="onDragStart(event,${menuItems[i]['id']})">
            <h2 class="itemName">${menuItems[i]['name']}</h2>
            <p class="itemPrice">${menuItems[i]['price'].toFixed(2)}</p>
        </div>
    `);
}


//search item by name or category
const searchForItems = () => {
    let input = document.getElementById('myMenuInput').value.toLowerCase();
    const cards = document.getElementsByClassName("item-body");
    for(let i=0;i<cards.length;i++){
        let itemName = cards[i].querySelector('.item-body h2.itemName');
        if(itemName.innerHTML.toLowerCase().indexOf(input) > -1 || menuItems[i]['category'].toLowerCase().indexOf(input)>-1){
            cards[i].style.display="";
        }else{
            cards[i].style.display="none";
        }
    }
};


const table = [
    {
        id : 1,
        name : "Table-1",
        itemList : new Map(),
        price : 0,
        quantity : 0       
    },
    {
        id : 2,
        name : "Table-2",
        itemList : new Map(),
        price : 0,
        quantity : 0       
    },
    {
        id : 3,
        name : "Table-3",
        itemList : new Map(),
        price : 0,
        quantity : 0       
    }
    
];

//showing tables
for(let i=0;i<table.length;i++){
    let tableList = document.getElementsByClassName('table')[0];
    tableList.insertAdjacentHTML("beforeBegin",
        `<div class="table-body" id="table${table[i].id}"  ondrop="drop(event)" ondragover="allowDrop(event)"  onclick="orderDetails(event)"
            ondragenter="dragEnter(event)" ondragleave="dragLeave(event)">
            <h2 class="tableName">${table[i]['name']}</h2>
            <p id="table-totalPrice${table[i].id}">Total : Rs. ${table[i]['price']} </p>
            <p id="table-totalItems${table[i].id}">Total items : ${table[i]['quantity']} </p>
        </div>`
    );
}

//search for particular table
function searchForTable(){
    let input = document.getElementById('myTableInput').value.toLowerCase(); 
    const table = document.getElementsByClassName("table-body");
    for(let i=0;i<table.length;i++){
        let tableName = table[i].querySelector(".table-body h2.tableName");
        if(tableName.innerHTML.toLowerCase().indexOf(input) > -1){
            table[i].style.display="";
        }else{
            table[i].style.display="none";
        }

    }
}

var selectedItemId;
function onDragStart(e,id){
    selectedItemId = id;
    e.dataTransfer.setData("text", e.target.id);
}

function allowDrop(e) {
    e.preventDefault();
}

function drop(e){
    e.preventDefault();
    let tableId = e.target.id.match(/\d+/g);
    let items = table[tableId-1].itemList;
    console.log(table[tableId-1].itemList.size);
    if(items.size > 0 && items.get(selectedItemId)!=undefined){
        items.set(selectedItemId,items.get(selectedItemId)+parseInt(1));
    }else{
        items.set(selectedItemId,1);
    }
    table[tableId-1]['price'] += menuItems[selectedItemId-1]['price'];
    table[tableId-1]['quantity']++;
    document.getElementById(e.target.id).style.backgroundColor="inherit";
    document.getElementById("table-totalPrice"+tableId).textContent = "Total : Rs. " + table[tableId-1]['price']; 
    document.getElementById("table-totalItems"+tableId).textContent = "Total items : " +table[tableId-1]['quantity'];
}

function dragEnter(e){
    document.getElementById(e.target.id).style.backgroundColor="lightgreen";
}

function dragLeave(e){
    document.getElementById(e.target.id).style.backgroundColor="inherit";
}

function orderDetails(e){
    document.querySelector(".table-details").style.visibility = "visible";
    document.querySelector('body').style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    document.getElementById(e.target.id).style.backgroundColor="lightblue";
    document.querySelector('.tables').className += " child-events";
    let tableId = e.target.id.match(/\d+/g); 
    console.log(tableId);
    let header = document.getElementById('order-header');
    header.textContent = `Table-${tableId} | Order Details`;
    displayOrderItems(tableId);
}

function displayOrderItems(tableId){
    if(table[tableId-1].quantity>0){
        let htmlString = "";
        htmlString += 
            `<tr>
                <th>S.No</th>
                <th>Item</th>
                <th>Price</th>
                <th>No. of Servings</th>
            </tr>`;
        let i = 1;

        for (const [key, value] of table[tableId-1].itemList.entries()) {
            if(i<=table[tableId-1]['itemList'].size){

                htmlString +=`
                <tr>
                    <td><center>${i}</center></td>
                    <td><center>${menuItems[key-1]['name']}</center></td>
                    <td><center>${menuItems[key-1]['price'].toFixed(2)}</center></td>
                    <td><center><input type=number id=quantity${key} class="quantity${key}" min=0  value="${value}" onchange="updateQuantity(${tableId},${key})"></center></td> 
                    <td><center><img class="delete-icon" id="delete-icon${key}" onclick="deleteItem('${tableId-1}',${key})" src="https://img.icons8.com/carbon-copy/100/000000/filled-trash.png" width=auto height="35px" /></center></td>
                </tr>`; 
                i++;
            }
            document.getElementById("table-items").innerHTML = htmlString;
        }
        document.querySelector('#total-price').textContent = table[tableId-1].price.toFixed(2);
    }else{
        document.getElementById("table-items").innerHTML = `<div style="margin : 22px 159px;font-size:25px">Order&nbsp;list&nbsp;is&nbsp;empty</div>`;
        document.querySelector('#total-price').textContent = table[tableId-1].price;
    }
    document.querySelector('.closeButton').id = tableId;
}

function closeTableDetails(e){
    document.querySelector(".table-details").style.visibility = "hidden";
    document.querySelector('.tables').className = "tables";
    document.querySelector('body').style.backgroundColor = "white";
    document.getElementById(`table${e.target.id}`).style.backgroundColor="inherit";
}

function deleteItem(tableId,itemId){
    var count = table[tableId].itemList.get(itemId);
    price = menuItems[itemId-1].price;
    table[tableId].price -= price * count;
    table[tableId].quantity -= count;
    table[tableId].itemList.delete(itemId);
    document.getElementById("table-totalPrice"+(parseInt(tableId)+1)).textContent = "Total : Rs. " + table[tableId]['price']; 
    document.getElementById("table-totalItems"+(parseInt(tableId)+1)).textContent = "Total items : " +table[tableId]['quantity'];
    displayOrderItems(parseInt(tableId)+1);
}

function updateQuantity(tableId,itemId){
    let newQuantity = document.querySelector(".quantity"+itemId).value;
    if(newQuantity==0){
        deleteItem(tableId-1,itemId);
    }
    else{
        let oldQuantity = table[tableId-1].itemList.get(itemId);
        let price = menuItems[itemId-1].price;
        let oldPrice = (oldQuantity*price);
        let newPrice = (newQuantity*price);
        table[tableId-1].price += (newPrice-oldPrice);
        table[tableId-1].quantity += (newQuantity - oldQuantity);
        table[tableId-1].itemList.set(itemId,newQuantity);
    }
    document.getElementById("table-totalPrice"+(parseInt(tableId))).textContent = "Total : Rs. " + table[tableId-1]['price']; 
    document.getElementById("table-totalItems"+(parseInt(tableId))).textContent = "Total items : " +table[tableId-1]['quantity'];
    displayOrderItems(parseInt(tableId));
    
}

function generateBill(e) {
    let bill = document.getElementById("total-price").textContent;
    alert(`Total Bill : Rs. ${bill}`,location.reload());
}