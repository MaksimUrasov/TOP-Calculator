const screenNodeNode = document.querySelector("#display");

// below object is the main "memory" objcect, it saves the pairs like this: number + operator and then add a result or number if it is too early to calculate the result.
// example below:
// you press 123.123 and "+", memoryArray gets new object1 = {digit: "123.123", signToAct: "+", result: 123.123}
// then you press 234.234 and "-", memoryArray gets one additional object2 = {digit: "234.234", signToAct: "-", result: 357.357}  
// so the result calculated using this data: first object1[result] + object1[signToAct] + object2[digit]. 
// Operator button is called action button, together with "=" sign.

let memoryArray = [
    {digit: NaN,
    signToAct:  NaN,
    result: NaN
    }
]
    
// console.log(memoryArray)
let actionButtonPressed = false;

function operations(a, op, b) {
    console.log(a, op, b )
    let n = {
        "+": a+b,
        "-": a-b,
        "x": a*b,
        "÷": a/b,
        "=": b,   // have to  "leave" on display first digit if there is no second digit yet:
        "NaN":b,  // have to  "leave" on display first digit if there is no second digit yet:
    }
    
    let result = n[`${op}`]
     // console.log(result)

    result = Number(result.toFixed(9));  // .toFixed(9)  toFixed limits the amount of numbers after the floating point, does not suit if number is 12345.123456789 etc 
    //  console.log(result)

    result = result.toPrecision(10);  //  .toPrecision limits the amount of total numbers. but there is still problem with number like 0.0000007802474017 -  still too long
    // console.log(result)
       
    result = Number.parseFloat(result); // to shorten the number if it looks like this after toPrecision 0.0000001234567890:
    // console.log(result)

    return result  
}

function proceedNumberPress(numberPressed) {

    if (screenNodeNode.textContent.includes("CALC") || actionButtonPressed ) { // clear the starting screen first or  check if the previous button pressed was action button
        screenNodeNode.textContent = "";
    }  
    // else if is not suitable, because I need to check all conditions, not one IF "or" the other IF
 
    if (!checkIfDisplayIsFull() && ( !screenNodeNode.textContent.includes(".") || numberPressed != "." ) ) { // in any case display must not be full. Then two options to contunue: 1) pressed dot and there are no dots already  or 2) pressed number, not dot again.
        singleNumberNode = document.createTextNode(`${numberPressed}`);
        screenNodeNode.appendChild(singleNumberNode);
    }

    // lastly declare that last button press was not an action button:
    actionButtonPressed = false;
}


function checkIfDisplayIsFull() {
    if (screenNodeNode.textContent.length >= 10) { 
        screenNodeNode.classList.add("blink");
        setTimeout(() => { 
            screenNodeNode.classList.remove("blink")
        }, 200);
        return true;
    } else {
        return false;
    }
}





function makeAction(signPressed) {


   
    // if action button is pressed after another action button or "=" button, then we only have to save that new action sign, 
    //do not have to make calculations as they were done on previous action button press.
    if (actionButtonPressed == true) {

        // saving the  current sign to PREVIOUS memory section
        let i =  memoryArray.length -1; 
        // console.log("i:" + i)
        memoryArray[i].signToAct = signPressed
    
        console.log(memoryArray)
        
        return
    } else {


        // first we declare that an action button has been pressed, to start collecting a fresh number by pressing number buttons
        actionButtonPressed = true;

        
        // next, save the current sign and Display number to "memoryArray"
        
        let i =  memoryArray.length; // number of inner arrays before we add a new one
        // console.log("i:" + i)
        let currentNumberAndActionObject = {digit: screenNodeNode.textContent, signToAct: signPressed};

        memoryArray.push(currentNumberAndActionObject)
    
        console.log(memoryArray)
    
        //then make calculation and display it: 
        let resultOfCaclulation = operations(
                            parseFloat(memoryArray[`${i-1}`].result),// previous calculation result (or first digit of first calculation)
                            `${memoryArray[i-1].signToAct}`, // previous operand to make a calculation 
                            parseFloat(memoryArray[i].digit), // the second digit for calculation
                            
        )
        
        
        // console.log(memoryArray[i].digit + " before for loop")
        screenNodeNode.textContent = `${resultOfCaclulation}`; 
        memoryArray[i].result = resultOfCaclulation;
    }
}
 

// rest small functions

function clearAll() {
    screenNodeNode.textContent = "0";
    memoryArray = [
        {digit: NaN,
        signToAct:  NaN,
        result: NaN
        }
    ]
}



function deleteDigit() {
    screenNodeNode.lastChild.remove()
        
}