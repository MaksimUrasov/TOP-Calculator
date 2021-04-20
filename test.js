const displayNode = document.querySelector("#display");
const mrButton = document.querySelector("#mr");

let actionButtonPressed = false;
let memoryButtonPressed = false;
let mr = 0;

// below object is the main "memory" objcect, it saves the pairs like this: number + operator and then add a result or number if it is too early to calculate the result.
// example below:
// you press 123.123 and "+", memoryArray gets new object1 = {digit: "123.123", signToAct: "+", result: 123.123}
// then you press 234.234 and "-", memoryArray gets one additional object2 = {digit: "234.234", signToAct: "-", result: 357.357}  
// so the result calculated using this data: first object1[result] + object1[signToAct] + object2[digit]. 
// Operator buttons are called action buttons, together with "=" sign.

let memoryArray = [
    {digit: NaN,
    signToAct:  NaN,
    result: NaN
    }
]
    

function operations(a, op, b) {
    console.log(a, op, b )
    let n = {
        "+": a+b,
        "-": a-b,
        "*": a*b,
        "/": a/b,
        "Enter": b,   // have to  "leave" on display first digit if there is no second digit yet:
                    // can not change Enter to "=" to have enabled keyboard support
        "NaN":b,  // have to  "leave" on display first digit if there is no second digit yet:
    }
    
    let result = Number(n[`${op}`])
    //  console.log(result)

    result = result.toPrecision(6); 
    console.log(result)
       
    // result = Number.parseFloat(result); // to shorten the number if it looks like this after toPrecision 0.0000001234567890:
    // console.log(result)

    //to solve 0.300000
    result = !result.toString().includes("e") ? result = parseFloat(result) : result;
    // to solve 0.00000123457
    result = result.toString().includes("0.00000") ? result.toFixed(10) : result;
    // more info why this mathematical decision was used is explained there: 
    // https://maksimurasov.github.io/TOP-testing-MATH-for-calculator/ 
    // https://github.com/MaksimUrasov/TOP-testing-MATH-for-calculator.git

    return result;  
}

function proceedNumberPress(numberPressed) {

    // first clear the starting screen first or  check if the previous button pressed was action button or memory operation button:
    if (displayNode.textContent.includes("CALC") || actionButtonPressed || memoryButtonPressed) { 
        displayNode.textContent = "";
    } // "else if" is not suitable, because I need to apply both IF conditions, not one or the other.  

    // if the first digit to enter is zero (like 000005), we do not add it to display 
    if (numberPressed == "0" && displayNode.textContent === "0" ) {
        // do nothing
    }
    // in any case display must not be full. Then two options to contunue: 1) pressed dot and there are no dots already  or 2) pressed number, not dot again.
    else if (!checkIfDisplayIsFull() && ( !displayNode.textContent.includes(".") || numberPressed != "." ) ) { 
        singleNumberNode = document.createTextNode(`${numberPressed}`);
        displayNode.appendChild(singleNumberNode);
    }

    // lastly declare that last button press was not an action or memory button:
    actionButtonPressed = false;
    memoryButtonPressed = false;
}


function checkIfDisplayIsFull() {
    if (displayNode.textContent.length >= 10) { 
        displayNode.classList.add("blink");
        setTimeout(() => { 
            displayNode.classList.remove("blink")
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
        let currentNumberAndActionObject = {digit: displayNode.textContent, signToAct: signPressed};

        memoryArray.push(currentNumberAndActionObject)
    
        console.log(memoryArray)
    
        //then make calculation: 
        let resultOfCaclulation = operations(
                            parseFloat(memoryArray[`${i-1}`].result),// previous calculation result (or first digit of first calculation)
                            `${memoryArray[i-1].signToAct}`, // previous operand to make a calculation 
                            parseFloat(memoryArray[i].digit), // the second digit for calculation
                            
        )

        // and display result:
        displayNode.textContent = `${resultOfCaclulation}`; 
        memoryArray[i].result = resultOfCaclulation;
    }
}
 


// rest small functions

function clearAll() {
    displayNode.textContent = "0";
    memoryArray = [
        {digit: NaN,
        signToAct:  NaN,
        result: NaN
        }
    ]
}



function deleteDigit() {
    displayNode.lastChild.remove()
}



function memoryButtonActions(action) {

     // first we declare that an action button has been pressed, to start collecting a fresh number
     // by pressing number buttons after memory action is finished, 
    memoryButtonPressed = true;
    switch(action) {
        case `M+`:
            mr += parseFloat(displayNode.textContent);
            mrButton.classList.add("mr");
            break;
        case `M-`:
            mr -= parseFloat(displayNode.textContent);
            mrButton.classList.add("mr")
            break;
        case `MR`:
            displayNode.textContent = mr; 
            break;
        case `MC`:
            mr = 0;
            mrButton.classList.remove("mr")
            break;
        } 
}


// keyboard support below

document.addEventListener('keydown', (e) => {  
// console.log(e.key)
    switch(e.key) {
        case `0`:
        case `1`:
        case `2`:
        case `3`:
        case `4`:
        case `5`:
        case `6`:
        case `7`:
        case `8`:
        case `9`:
        case `.`:
            proceedNumberPress(e.key);
            break;

        case `/`:
        case `*`:
        case `-`:
        case `+`:
        case `Enter`:
            makeAction(e.key)
            break;
        case `c`:
            clearAll()
            break;
        case `Backspace`:
            deleteDigit()
            break;
        case `m`:
            memoryButtonActions("MR")     
        default:
            return;
        } 
        

 }) 

