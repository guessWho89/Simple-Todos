const tmp = {
    colors: {
        blue: '#00b4eb',
        pink: '#e22b4c',
        green: '#3bc563',
        gray: '#aeaeae'
    },
    styles: {
        boxHolder: `        
            box-sizing: border-box;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.7);
            position: fixed;
            left: 0;
            top: 0; 
            z-index: 99;
        `,
        box: `
            box-sizing: border-box;
            max-width: 450px;
            width: 90%;
            min-height: 150px; 
            background: #fff;
            padding: 20px; 
            font-size: 14px; 
            color: #555;
            position: absolute; 
            left: 50%; 
            top: 50%;
            transform: translate(-50%, -50%);
            -webkit-box-shadow: 0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12), 0 11px 15px -7px rgba(0,0,0,0.2);
            -ms-box-shadow: 0 24px 38px 3px rgba(0,0,0,0.14),0 9px 46px 8px rgba(0,0,0,0.12),0 11px 15px -7px rgba(0,0,0,0.2);
            box-shadow: 0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12), 0 11px 15px -7px rgba(0,0,0,0.2)
        `,
        boxTextHolder: `
            box-sizing: border-box;
            margin: 0 auto 20px;
        `,
        boxText: `
            box-sizing: border-box;
            font-family: Verdana, Geneva, sans-serif;
            color: #00012d;
            line-height: 1.4;
            word-break: break-word;
            margin: auto;
        `,
        boxInput: `
            box-sizing: border-box;
            font-family: Verdana, Geneva, sans-serif;
            font-size: 14px;
            padding: 5px 10px;
            width: 100%;
            height: auto;
            border: none;
            border-bottom: 1px solid #ccc;
            outline: none;
        `,
        boxInputHolder: `
            box-sizing: border-box;
            margin: 20px auto 20px;
        `,
        btnHolder: `
            display: flex;
            width: 180px;
            margin: 20px auto 0;
            position: absolute;
            left: 50%;
            bottom: 0%;
            transform: translate(-50%, -50%);
            box-sizing: border-box;
        `,
        btnOk: `
            box-sizing: border-box;
            font-family: Verdana, Geneva, sans-serif;
            padding: 10px;
            width: 80px;
            height: auto;
            display: inline-block;
            margin: auto;
            font-size: 14px;
            color: #fff;
            background: #00b4eb;
            border: none;
            outline: none;
            cursor: pointer;
        `,
        btnCancel: `
            box-sizing: border-box;
            font-family: Verdana, Geneva, sans-serif;
            padding: 10px;
            width: 80px;
            height: auto;
            display: inline-block;
            margin: auto;
            color: #fff;
            font-size: 14px;
            background: #a0a0ae;
            border: none;
            outline: none;
            cursor: pointer;
        `,
    },
}

let promptBool;
let promptVal;
const promptBox = (msg, bool, val) => {
    const el = `  
        <div id="promptBox" style="` + tmp.styles.box +  `">
            <div id=promptTextHolder style="` + tmp.styles.boxTextHolder + `">
                <p id="promptText" style="` + tmp.styles.boxText + `"></p>
            </div>
            <div id="promptInputHolder" style="` + tmp.styles.boxInputHolder + `">
                <input type="text" id="promptInput" style="` + tmp.styles.boxInput + `">
            </div>
            <br>
            <br>
            <div id="promptBtns" style="` + tmp.styles.btnHolder + `">
                <button id="promptOk" data-res="true" style="` + tmp.styles.btnOk + `">Ok</button>
                <button id="promptCancel" data-res="false" style="` + tmp.styles.btnCancel + `">Cancel</button>
            </div>
        </div>
    `;
    const promptHolder = document.createElement('div');
    promptHolder.setAttribute('id', 'promptHolder');
    promptHolder.style.cssText = tmp.styles.boxHolder;
    document.body.appendChild(promptHolder);
    promptHolder.innerHTML = el;    
    const promptText = document.querySelector('#promptText');
    promptText.innerText = msg;
    promptHolder.animate(
        [
            { transform: 'scale(0)' },
            { transform: 'scale(1)' }
        ],
        {
            duration: 250,
            function: setTimeout(() => {
                promptHolder.style.backdropFilter = 'blur(10px)';
            }, 255)
        }
    );
    
    document.addEventListener('keyup', (e) => {
        if (e.srcElement.id == 'promptInput') {
            promptVal = e.target.value;
        }
    });
    const promptInput = document.querySelector('#promptInput');
    !bool ? promptInput.style.display = 'none' : promptInput.style.display = 'block';
    val !== undefined ? promptInput.setAttribute('placeholder', val) : promptInput.setAttribute('placeholder', '');
    promptVal = promptInput.value;

    document.addEventListener('click', (e) => {
        if (e.srcElement.id == 'promptOk') {
            promptBool = e.target.dataset.res;
            promptHolder.animate(
                [
                    { transform: 'scale(1)' },
                    { transform: 'scale(0)' }
                ],
                {
                    duration: 300,                    
                }
            );
            setTimeout(() => {
                promptHolder.remove();
            }, 290);
        } else if (e.srcElement.id == 'promptCancel') {
            promptBool = e.target.dataset.res;
            promptHolder.animate(
                [
                    { transform: 'scale(1)' },
                    { transform: 'scale(0)' }
                ],
                {
                    duration: 300,
                }
            );
            setTimeout(() => {
                promptHolder.remove();
            }, 290);
        }
    });

    document.onkeydown = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            promptOk.click();
        } else if (e.keyCode === 27) {
            e.preventDefault();
            promptCancel.click();
        }
    }
}

const alertBox = (msg) => {
    const el = `
        <div id="alertBox" style="` + tmp.styles.box +  `">
            <div id="alertTextHolder" style="` + tmp.styles.boxTextHolder + `">
                <p id="alertText" style="` + tmp.styles.boxText + `"></p>
            </div>
            <br>
            <br>
            <div id="alertBtns" style="` + tmp.styles.btnHolder +`">
                <button id="alertOk" style="` + tmp.styles.btnOk + `">Ok</button>
            </div>
        </div>
    `;
    const alertHolder = document.createElement('div');
    alertHolder.setAttribute('id', 'alertHolder');
    alertHolder.style.cssText = tmp.styles.boxHolder;
    document.body.appendChild(alertHolder);
    alertHolder.innerHTML = el;
    const alertText = document.querySelector('#alertText');
    alertText.innerText = msg;
    alertHolder.animate(
        [
            { transform: 'scale(0)' },
            { transform: 'scale(1)' },
        ],
        {
            duration: 250,
            function: setTimeout(() => {
                alertHolder.style.backdropFilter = 'blur(10px)';
            }, 255)
        }
    );

    const alertOk = document.querySelector('#alertOk');
    alertOk.addEventListener('click', () => {
        alertHolder.animate(
            [
                { transform: 'scale(1)' },
                { transform: 'scale(0)' }
            ],
            {
                duration: 300,
            }
        );
        setTimeout(() => {
            alertHolder.remove();
        }, 290);
    });

    document.onkeydown = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            promptOk.click();
        } 
    }
}
