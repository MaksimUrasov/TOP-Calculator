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
    } ]
    

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
    // console.log(result)
       
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



// let check = /a/;

// console.log(check.test(displayNode.textContent))



function proceedNumberPress(numberPressed) {  // there are many options there, depending on button pressed and a display value, 
                                                // so I have created a tree of switch statements to clarify all cases.

    // such  usage of regex in switch statement I have borrowed from there:
    //  https://www.sitepoint.com/community/t/using-regexp-in-switch-case-statement/4880/3
    
    
    if (actionButtonPressed || memoryButtonPressed) {
        clearDisplay();
    }

    
    const rX= /^(([A-Z ]+)|(0)|(\d+)|(\d*\.\d*)|(^(?![\s\S])))$/  
                //greeting|"0"| int |  float   | empty string  
    let test= rX.exec(displayNode.textContent)

    switch (test[1]) { //switch according dispaly value
        case test[2]: //when display is welcome greeting
            switch (numberPressed) {
                case ".": // pressed dot
                    displayNode.textContent = "0";
                    addButtonValueToDisplay();     
                    break;

                case "0": // pressed zero
                default: //when a number is pressed
                    clearDisplay();
                    addButtonValueToDisplay();
                    break;
            }
        break;

        case test[3]: //when display only one "0", after pressing C
            switch (numberPressed) {
                case ".": // pressed dot
                    addButtonValueToDisplay();
                    break;

                case "0": // pressed zero
                    // do nothing
                    break;
        
                default: //when a number is pressed
                    clearDisplay();
                    addButtonValueToDisplay();
                    break;
            }
        break;

        case test[4]: //when display contains any integer numbers, no floats
            switch (numberPressed) {
                case ".": // pressed dot
                case "0": // pressed zero
                default: //when a number is pressed
                    addButtonValueToDisplay();
                    break;
            }
        break;

        case test[5]: //when display contains float number, with "."
            switch (numberPressed) {
                case ".": // pressed dot
                    // do nothing
                    break;

                case "0": // pressed zero
                default: //when a number is pressed
                    addButtonValueToDisplay();
                    break;
            }
        break;

        case test[6]: // empty display 
        switch (numberPressed) {
            case ".": // pressed dot
                displayNode.textContent = "0";
                addButtonValueToDisplay(); 
                break;

            case "0": // pressed zero
            default: //when a number is pressed
                addButtonValueToDisplay();
                break;
        }
        break;
        // default:
        //     break;
    }

    

    function clearDisplay(){
        displayNode.textContent = "";
    }

    function addButtonValueToDisplay(){
        if (!checkIfDisplayIsFull() ) {
            singleNumberNode = document.createTextNode(`${numberPressed}`);
            displayNode.appendChild(singleNumberNode)
        }
        
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

    // lastly declare that last button press was not an action or memory button:
    actionButtonPressed = false;
    memoryButtonPressed = false;
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

    if (displayNode.textContent.length > 1) {
        displayNode.textContent = displayNode.textContent.slice(0,-1)
    } else {
        displayNode.textContent = "0";
    }
    
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

