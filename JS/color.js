console.log("DOMContentLoaded");
 import { APCAcontrast, sRGBtoY, displayP3toY, calcAPCA, fontLookupAPCA } from './apca-w3.js';

const colorBlock = document.querySelector(".color_block");
const hueInput = document.querySelector(".hue");
const satInput = document.querySelector(".sat");
const ligInput = document.querySelector(".lig");

class Contraster {

    constructor() {
        this.colorTools = new Array();
        this.contrastContainer = document.getElementById("contrast_container");
        this.addButton = document.getElementById("add");
        this.checkContrast = document.getElementById("checkContrast");
        this.closeDialog = document.getElementById("alert").querySelector("button");
        this.closeDialog.addEventListener('click', () => {
            document.getElementById("alert").close();
        });
        this.addButton.addEventListener('click', () => {
            this.addColor();
        });
        this.checkContrast.addEventListener('click', () => {
            this.addContrast();
        });





    } // End Contraster constructor

    getLuminance({ red, green, blue }) {
        red /= 255;
        green /= 255;
        blue /= 255;

        red = getSrgb(red);
        green = getSrgb(green);
        blue = getSrgb(blue);

        return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
    }

    getContrastRatio(lum1, lum2) {
        let lighter = Math.max(lum1, lum2);
        let darker = Math.min(lum1, lum2);
        return (lighter + 0.05) / (darker + 0.05);
    }

    checkContrast(textRgb, bgRgb) {
        
        const textLum = getLuminance(textRgb);
        const bgLum = getLuminance(bgRgb);

        const contrastRatio = getContrastRatio(textLum, bgLum);

        if (contrastRatio >= 7) {
            return "✅ AAA Compliant";
        } else if (contrastRatio >= 4.5) {
            return "✔️ AA Compliant";
        } else {
            return "🤮 Brother Ugh ... What was that?";
        }
    }

    addColor() {
        
        const temp = new colorTool();
        this.colorTools.push(temp);
    }

    collectChecked() {
        const tempArray = new Array();
        for (const cT of this.colorTools) {
            if (cT.idCheck.checked) {
                tempArray.push(cT);
            }
        }
        //console.log(tempArray[0].hue)
        return tempArray;
    }

    addContrast() {
        const contrastArray = this.collectChecked();
        const contrasts = document.createElement("div");
        contrasts.classList.add("contrasts");
        this.contrastContainer.appendChild(contrasts);
        console.log("array length: " + contrastArray.length)
        if (contrastArray.length !== 2) {
            console.log("You must select exactly two colors to check contrast.");
            document.getElementById("alert").showModal();
            return;
        }
        for (const con of contrastArray) {
            let contrast = document.createElement("div");
            contrast.classList.add("contrast_holder");
            contrasts.appendChild(contrast);
            let hex = con.getHexColor();
            contrasts.appendChild(document.createTextNode(hex));
            let bg = con.cBlock.style.backgroundColor;
            contrast.style.backgroundColor = bg;


        }
    }




} // End class Contraster

class colorTool {
    constructor() {

        this.wrapper;
        this.cBlock;
        this.hslBar;
        this.hInput;
        this.sInput;
        this.lInput;
        this.hue = "180";
        this.sat = "100";
        this.lig = "50";
        this.id = "";
        this.idCheck;
        this.idText;

        const cContainer = document.getElementById("color_container");
        const contrastContainer = document.getElementById("contrast_container");

        const wrapper = document.createElement("div");
        cContainer.appendChild(wrapper);
        this.wrapper = wrapper;
        this.wrapper.classList.add("wrapper");

        const idLabel = document.createElement("label");
        this.wrapper.appendChild(idLabel);
        const idText = document.createTextNode(this.id);
        idLabel.appendChild(idText);
        this.idText = idText;


        const idCheck = document.createElement("input");
        idCheck.type = "checkbox";
        idLabel.appendChild(idCheck);
        this.idCheck = idCheck;


        const color = document.createElement("div");
        this.wrapper.appendChild(color);
        this.cBlock = color;
        this.cBlock.classList.add("color_block")

        const hslBar = document.createElement("div");
        this.wrapper.appendChild(hslBar);
        this.hslBar = hslBar;
        this.hslBar.classList.add("hslBar");

        // Hue
        const hueLabel = document.createElement("label");
        const hueText = document.createTextNode("Hue");
        this.hslBar.appendChild(hueLabel);
        this.hLabel = hueLabel;
        this.hLabel.appendChild(hueText);

        const hueInput = document.createElement("select");
        this.hLabel.appendChild(hueInput);
        this.hInput = hueInput;
        for (let i = 0; i < 361; i++) {
            const temp = document.createElement("option");
            temp.value = i;
            temp.innerText = i;
            this.hInput.appendChild(temp);
            this.hInput.value = this.hue;
        }
        const degrees = document.createTextNode("°");
        this.hLabel.appendChild(degrees);

        // Saturation
        const satLabel = document.createElement("label");
        const satText = document.createTextNode("Saturation");
        this.hslBar.appendChild(satLabel);
        this.sLabel = satLabel;
        this.sLabel.appendChild(satText);

        const satInput = document.createElement("select");
        this.sLabel.appendChild(satInput);
        this.sInput = satInput;
        for (let i = 0; i < 101; i++) {
            const temp = document.createElement("option");
            temp.value = i;
            temp.innerText = i;
            this.sInput.appendChild(temp);
            this.sInput.value = this.sat;
        }
        const percent1 = document.createTextNode("%");
        this.sLabel.appendChild(percent1);

        // Lightness
        const ligLabel = document.createElement("label");
        const ligText = document.createTextNode("Lightness");
        this.hslBar.appendChild(ligLabel);
        this.lLabel = ligLabel;
        this.lLabel.appendChild(ligText);

        const ligInput = document.createElement("select");
        this.lLabel.appendChild(ligInput);
        this.lInput = ligInput;
        for (let i = 0; i < 101; i++) {
            const temp = document.createElement("option");
            temp.value = i;
            temp.innerText = i;
            this.lInput.appendChild(temp);
            this.lInput.value = this.lig;
        }
        const percent = document.createTextNode("%");
        this.lLabel.appendChild(percent);

        this.attachEvents();
        this.updateColor();

    } // End colorTool constructor

    updateColor() {
        this.cBlock.style.backgroundColor = `hsl(${this.hue}, ${this.sat}%, ${this.lig}%)`;
        this.id = this.getHexColor();
        this.idText.nodeValue = this.id;
    }

    getHexColor(property = 'backgroundColor') {
        // 1. Get the computed style of the element (returns "rgb(r, g, b)" or "rgba(r, g, b, a)")
        const computedColor = window.getComputedStyle(this.cBlock)[property];

        // 2. Extract the numbers using a regex
        const rgbValues = computedColor.match(/\d+/g);
        if (!rgbValues) return null;

        // 3. Convert R, G, and B to hex chunks and pad with a leading zero if necessary
        const r = parseInt(rgbValues[0], 10).toString(16).padStart(2, '0');
        const g = parseInt(rgbValues[1], 10).toString(16).padStart(2, '0');
        const b = parseInt(rgbValues[2], 10).toString(16).padStart(2, '0');

        // 4. Combine into a hex string
        return `#${r}${g}${b}`;
    }

    parseHSL(hslString) {
        // Finds all sequences of digits in the string
        const matches = hslString.match(/\d+/g);

        if (!matches || matches.length < 3) return null;

        return {
            h: Number(matches[0]), // Hue (0 - 360)
            s: Number(matches[1]), // Saturation %
            l: Number(matches[2])  // Lightness %
        };
    }

    getCurrentRGB() {

        const rgbStr = window.getComputedStyle(this.cBlock).backgroundColor;
        return rgbStr;
    }


    rgbToHsl(rgbStr) {
        // Extract numbers from "rgb(r, g, b)"
        const [r, g, b] = rgbStr.match(/\d+/g).map(Number);

        const normR = r / 255;
        const normG = g / 255;
        const normB = b / 255;

        const max = Math.max(normR, normG, normB);
        const min = Math.min(normR, normG, normB);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case normR: h = (normG - normB) / d + (normG < normB ? 6 : 0); break;
                case normG: h = (normB - normR) / d + 2; break;
                case normB: h = (normR - normG) / d + 4; break;
            }
            h /= 6;
        }

        const hsl = [
            Math.round(h * 360),
            Math.round(s * 100),
            Math.round(l * 100)
        ];

        return hsl;

    }


    attachEvents() {
        // Hue listener
        this.hInput.addEventListener("change", (event) => {
            const rgbStr = this.getCurrentRGB();
            const currentHSL = this.rgbToHsl(rgbStr);
            this.hue = event.target.value;
            //const hue = event.target.value;
            /*const sat = currentHSL[1];
            const lig = currentHSL[2];*/
            this.updateColor();

        });

        // Saturation listener
        this.sInput.addEventListener("change", (event) => {
            const rgbStr = this.getCurrentRGB();
            const currentHSL = this.rgbToHsl(rgbStr);
            //const hue = currentHSL[0];
            this.sat = event.target.value;
            //const sat = event.target.value;
            //const lig = currentHSL[2];
            this.updateColor();

        });

        // Lightness listener
        this.lInput.addEventListener("change", (event) => {
            const rgbStr = this.getCurrentRGB();
            const currentHSL = this.rgbToHsl(rgbStr);
            //const hue = currentHSL[0]
            //const sat = currentHSL[1];
            //const lig = event.target.value;
            this.lig = event.target.value;
            this.updateColor();

        });

    };




}//End class colorTool













//const dude = new colorTool(0);




const testDude = new Contraster();



