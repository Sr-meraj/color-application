/***
 * Data: 18-11-22
 * 
 * Author: SR Meraj
 * 
 * Description: Color Picker Application with huge dom functionalities
 * 
 *  */

// * steps ---->

//* global variable

let toastContainer = null;

/* Creating a new Audio object. */
const audio = new Audio('./tink.wav')

// default values

const defaultColor = { red: 221, green: 222, blue: 238 }

const colorsArr = [
    '#c20dff', '#00f7ff', '#00ff1a', '#ffd000', '#0008ff', '#6600ff', '#f60039', '#000000', '#ff00c3',
    '#00046f', '#d0ff00', '#00ab17', '#9CEE8F', '#39CCFB', '#DDDEEE', '#A67D20', '#2A4756', '#940323'
]

/* Declaring a variable named `customColor` and assigning it a new array. */
let customColor = new Array()

//* onload handler

window.onload = () => { 
    main();
    updateColorCodeToDOM(defaultColor)

    displayColorBoxs(document.getElementById('color-plate'), colorsArr)

    colors = localStorage.getItem('custom-colours')
    customColor = JSON.parse(colors)
    console.log(customColor);
    displayColorBoxs(document.getElementById('custom-color-plate'),customColor)
}

/**
 * main or boot fucntion, this function will take care of getting all the DOM refarences
 */

function main() {
    const genarateColorBtn = document.getElementById('change-btn')
    const hexCodeInput = document.getElementById('input-hex')
    const colorSliderRed = document.getElementById('color-slider-red')
    const colorSliderGreen = document.getElementById('color-slider-green')
    const colorSliderBlue = document.getElementById('color-slider-blue')
    const copyToClipboard = document.getElementById('copy-to-clipboard')
    const presetColorParent = document.getElementById('color-plate')
    const save = document.getElementById('save')
    const customColorParent = document.getElementById('custom-color-plate')
    
    copyToClipboard.addEventListener('click', handelCopyToClipboard)
    genarateColorBtn.addEventListener('click', handleGenerateRandomColorBtn)
    
    /* Listening for a keyup event on the input field. */
    hexCodeInput.addEventListener('keyup', handleHexCodeInp)

    colorSliderRed.addEventListener('change', handelColorSliderInp(colorSliderRed,colorSliderGreen,colorSliderBlue))
    colorSliderRed.addEventListener('mousemove', handelColorSliderInp(colorSliderRed,colorSliderGreen,colorSliderBlue))
    colorSliderGreen.addEventListener('change', handelColorSliderInp(colorSliderRed,colorSliderGreen,colorSliderBlue))
    colorSliderGreen.addEventListener('mousemove', handelColorSliderInp(colorSliderRed,colorSliderGreen,colorSliderBlue))
    colorSliderBlue.addEventListener('mousemove', handelColorSliderInp(colorSliderRed,colorSliderGreen,colorSliderBlue))
    colorSliderBlue.addEventListener('change', handelColorSliderInp(colorSliderRed,colorSliderGreen,colorSliderBlue))

    // * copyBtn EventListener Function
    presetColorParent.addEventListener('click', handelPresetColorParent)
    customColorParent.addEventListener('click', handelPresetColorParent)

    save.addEventListener('click', handelSaveToCustomBtn(customColorParent,hexCodeInput))
}

// Event handlers

function handleGenerateRandomColorBtn() {
        const colorCode = generateColorDecimal()
        updateColorCodeToDOM(colorCode)
};

 function handelPresetColorParent(e) {
        let event = e.target
        if (event.className == 'color-box') {
            navigator.clipboard.writeText(event.getAttribute('data-color'))
            audio.play()
            check()
            generateToastMessage(`${event.getAttribute('data-color').toUpperCase()} Copied`)
        }
    }

function handleHexCodeInp (e) {
    let hexColor = e.target.value 
    if (hexColor) {
        this.value = hexColor.toUpperCase()
        if (isHexValid(hexColor)) {
            const color = hexToDecimal(hexColor)
            updateColorCodeToDOM(color)
        }
    }
}

function handelColorSliderInp(colorSliderRed, colorSliderGreen, colorSliderBlue) {
    return function () {
        const color = {
            red: parseInt(colorSliderRed.value),
            green: parseInt(colorSliderGreen.value),
            blue: parseInt(colorSliderBlue.value)
        }
        updateColorCodeToDOM(color)
    }
}

function handelCopyToClipboard() {
    const colorMode = document.getElementsByName('color-mode')
    audio.play()

    let mode = getValueCheckedFromRadio(colorMode)
    if (mode === null) {
        throw new Error('Invalid Radio Input')
    }
    
    if (mode === 'hex') {
        const hexCode = document.getElementById('input-hex').value
        if (hexCode && isHexValid(hexCode)) {
            navigator.clipboard.writeText(`#${hexCode}`);
            check();
            generateToastMessage(`#${hexCode} Copied`)
        } else { alert('enter valid hex code') }
        
    } else {
        const rgbCode = document.getElementById('input-rgb').value
        if (rgbCode) {       
            navigator.clipboard.writeText(rgbCode);
            check();
            generateToastMessage(`${rgbCode} Copied`)
        } else { alert('enter valid hex code') }
        
    }

    setTimeout(
    function removeToast() {
       check()
    }, 5000);
}

 function handelSaveToCustomBtn(customColorParent, hexCodeInput) {
     return function () {
         const color = `#${hexCodeInput.value}`
         if (customColor.includes(color)) {
             alert('Already Saved')
             return;
         }
         customColor.unshift(color)
         
         if (customColor.length > 12) {
            customColor = customColor.slice(0,12)
         }
         localStorage.setItem('custom-colours',JSON.stringify(customColor))
         removeChildren(customColorParent)
         displayColorBoxs(customColorParent, customColor)
         check()
         generateToastMessage('Saved')

          setTimeout(
            function removeToast() {
               check()
            }, 5000);
        }
    }

// DOM functions

/**
 * find the checked elements from the list of radio buttons
 * @param {array} nodes 
 * @returns {string | null}
 */

function getValueCheckedFromRadio(nodes) {
    let CheckedValue = null;
    for (let i = 0; i < nodes.length; i++) {
        // console.log(nodes[i].checked);
        if (nodes[i].checked) {
            CheckedValue = nodes[i].value
            break
        }
    }
    return CheckedValue
}


/**
 * It creates a div, adds a class to it, adds an event listener to it, and then adds it to the
 * body.
 * @param msg - The message to be displayed in the toast.
 * @returns {string} msg
 */

function generateToastMessage(msg){
    toastContainer = document.createElement('div')
    toastContainer.innerHTML = msg;
    toastContainer.className = 'toast-message toast-message-slide-in';
    
    toastContainer.addEventListener('click', function () {
        toastContainer.classList.remove('toast-message-slide-in')
        toastContainer.classList.add('toast-message-slide-out')
        toastContainer.addEventListener('animationend', function () {
            toastContainer.remove();
            toastContainer = null;
        });
    })
    document.body.appendChild(toastContainer)
}


/**
 * It removes the toastContainer element from the DOM.
 */
const check = () => { if (toastContainer !== null) { toastContainer.remove(); toastContainer = null; } } 
    

/**
 * update DOM elements with calculated color values
 * @params {object} color
 */

function updateColorCodeToDOM(color) {
    const RGBCode = generateRGBColor(color)
    const hexCode = generateHEXColor(color)

    document.getElementById('color-display').style.backgroundColor = hexCode
    document.getElementById('input-hex').value = hexCode.substring(1)
    document.getElementById('input-rgb').value = RGBCode
    document.getElementById('color-slider-red').value = color.red
    document.getElementById('color-slider-red-label').innerText = color.red
    document.getElementById('color-slider-green').value = color.green
    document.getElementById('color-slider-green-label').innerText = color.green
    document.getElementById('color-slider-blue').value = color.blue
    document.getElementById('color-slider-blue-label').innerText = color.blue
}

/**
 * create a div element with class name color-box
 * @param {string} color 
 * @returns {object}
 */
function generateColorBox(color) {
    let div = document.createElement('div')
    div.className = 'color-box'
    div.style.backgroundColor = color
    div.setAttribute('data-color', color)
    
    return div
}

/**
 * this function will create and append new color box it's parent
 * @param {object} parent 
 * @param {Array} colors 
 */

function displayColorBoxs(parent,colors) {
    colors.forEach((color) => {
        const colorBox = generateColorBox(color)
        parent.appendChild(colorBox)
    })
}

/**
 * remove all children form parent
 * @param {object} parent 
 */
function removeChildren(parent) {
    let child = parent.lastElementChild;  
        while (child) { 
            parent.removeChild(child); 
            child = parent.lastElementChild; 
        }
}


// utils functions

/**
 * generate and return an object of three color decimal values
 * @returns {object}
 */

function generateColorDecimal() {
    const red = Math.floor(Math.random() * 255)
    const green = Math.floor(Math.random() * 255)
    const blue = Math.floor(Math.random() * 255)
    
    return {
        red,
        green,
        blue
    }
    
}


/**
 * take of color object of three decimal values and return a hexadecimal color code
 * @param {object} color 
 * @returns {string}
 */

function generateHEXColor({ red, green, blue } ) {
    // const { red, green, blue } = generateColorDecimal()
    
    // const twoCodeRed = red <= 9 ? `0${red}` : red.toString(16) 
    // const twoCodeGreen = green <= 9 ? `0${green}` : green.toString(16) 
    // const twoCodeBlue = blue <= 9 ? `0${blue}` : blue.toString(16) 
    
    const twoCode = (value) => {
        const hex = value.toString(16) 
        return hex.length === 1 ? `0${hex}` : hex
    }
    return `#${twoCode(red)}${twoCode(green)}${twoCode(blue)}`.toUpperCase()
}

/**
 * take of color object of three decimal values and retrn a RGB color code
 * @param {object} color 
 * @returns {string}
 */

function generateRGBColor({ red, green, blue } ) {
    // const { red, green, blue } = generateColorDecimal()

    return `rgb(${red},${green},${blue})`
}

/**
 * convert hex color to decimal
 * @param {*} Hex
 * @returns {object}  
 */

function hexToDecimal(hex) {
    const red = parseInt(hex.slice(0, 2), 16)
    const green = parseInt(hex.slice(2, 4), 16)
    const blue = parseInt(hex.slice(4), 16)
    // return `rgb(${red},${green},${blue})`
    return {
        red,
        green,
        blue
    }
}

/**
 * validate hex color code 
 * @param {string} color 
 * @returns {boolean}
 */

function isHexValid(color) {
    if (color.length !== 6) return false    
    /* A regular expression that checks if the string is a valid hex code. */
    return /^[0-9-A-Fa-f]{6}/i.test(color)
}

