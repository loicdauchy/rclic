/**
 * @desc Function that generates a unique identifier between a minimum and maximum number
 * @link https://www.portfolio-loic-dauchy.com
 * @param {!number} min - min number
 * @param {!number} max - max number
 * @returns 
 */
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min +1)) + min;
}

/**
 * @desc Function that allows you to delete the first parent element encountered (specified in the parameters)
 * @link https://www.portfolio-loic-dauchy.com
 * @param {!DOMElement} e - child element
 * @param {!DOMElement} parent parent element to remove
 */
function removeClosestParent(e, parent){
    e.closest(parent).remove();
}


/**
 * @desc Function that allows you to generate Cards from an Array.
 * @note The Bootstrap CSS must be called beforehand.
 * @link https://www.portfolio-loic-dauchy.com
 * @param {!string[]} array - Array on which the generation of Cards will be based.
 * @param {?function(id:number)} btnClick - Function that will be triggered at the click of the button.
 * @param {!DOMElement} container - The html object in which the cards will be contained.
 * @param {!boolean} clear - Clear the container.
 * @param {?string} imageLink - The url of the folder where the images are stored.
 * @param {?number} width - Cards width. expected number: 1, 2 or 3.
 * @param {?string} btnText - The text will be displaying inside button.
 * @param {?string} imageName - Image key name in Array.
 * @param {?string} titleName - Title key name in Array.
 * @param {?string} descriptionName - Description key name in Array.
 * @param {!boolean} image - Show image or not.
 * @param {!boolean} title - Show title or not.
 * @param {!boolean} description - Show description or not.
 * @param {!boolean} btn - Show button or not.
 */
function generateCards(
    array,
    btnClick,
    container,
    clear,
    imageLink,
    width,
    btnText, 
    imageName,
    titleName,
    descriptionName,
    image,
    title,
    description,
    btn,
){

    var largeur ;

    if(width){
        if(width === 1){
            largeur = "13";
        }else if (width === 2){
            largeur = "15";
        }else{
            largeur = "18";
        }
    }

    if(clear === true){
        container.innerHTML = "";
    }   

    container.classList.add('justify-content-center', 'row', 'align-items-center');

    for(var i = 0; i < array.length; i++){

        var cards = document.createElement('div');
            cards.classList.add('card', 'mx-1', 'my-1');
            cards.style = "width:"+largeur+"rem;";

        if(image){

            var src ;
            if(imageName === "id"){
                src = array[i][imageName]+".png";
            }else{
                src = array[i][imageName];
            }

            var img = document.createElement('img');
                img.src = imageLink+src;
                img.addEventListener('error', function(){
                    this.src = imageLink;
                })
                img.classList.add('card-img-top');
                img.alt = "Photo de la cards "+array[i][titleName];
                img.style = `
                    height:200px;
                `;

            cards.appendChild(img);
        }

        var body = document.createElement('div');
            body.classList.add('card-body');

            if(title === false && description === false){
                body.style = `
                    display: flex;
                    justify-content-center;
                    align-items-center;
                    padding: 0!important;
                `;
            }
        
        cards.appendChild(body);

        if(title){
            var name = document.createElement('h6');
                name.classList.add('card-title');
                name.innerHTML = array[i][titleName];
                name.style = `overflow: hidden;
                              text-overflow: ellipsis;
                              display: -webkit-box;
                              -webkit-line-clamp: 2; /* number of lines to show */
                              -webkit-box-orient: vertical;
                              `;
                
            body.appendChild(name);
        }

        if(description){
            var text = document.createElement('p');
                text.classList.add('card-text');
                text.style = `overflow: hidden;
                              text-overflow: ellipsis;
                              display: -webkit-box;
                              -webkit-line-clamp: 2; /* number of lines to show */
                              -webkit-box-orient: vertical;
                              `;
                text.innerHTML = array[i][descriptionName];
            
            body.appendChild(text);
        }

        if(btn){
            var id = array[i].id;
            var button = document.createElement('input');
                button.type = "submit";
                button.classList.add('btn', 'btn-primary', btnText);
                button.value = array[i][titleName] || titleName;
                button.id = id;

                if(btnClick !== null){  
                    button.addEventListener('click', function(){
                        btnClick(this.id);
                    })
                }

                if(title === false && description === false){
                    button.style = `
                        width: 100% !important;
                        height: 100% !important;
                    `;
                }
            
            body.appendChild(button);
        }

        container.appendChild(cards);

    }

}

/**
 * @desc Function that will retrieve or send data from an API.
 * @link https://www.portfolio-loic-dauchy.com
 * @param {!string} method - HTTP METHOD: "GET", "POST", "PUT", "PATCH" or 'DELETE'.
 * @param {!string} url - Url of Api request.
 * @param {?string[]} data - Data to send if method equal "POST", "PUT" or "PATCH".
 * @param {?number} id - Id parameter to add on the url
 */
function HttpRequest(method, url, data, id){

    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();

            if(id !== null){
                xhr.open(method, url+id.toString());
            }else{
                xhr.open(method, url);
            }
            
            xhr.onload = function () {

                var response = JSON.parse(xhr.response);

                if (this.status >= 200 && this.status < 300) {
                    resolve(response);
                }else {
                    reject({
                      status: this.status,
                      statusText: xhr.statusText
                    });
                }


            };
            xhr.onerror = function () {
                reject({
                  status: this.status,
                  statusText: xhr.statusText
                });
              };
            xhr.setRequestHeader("content-type", "application/json");

            if(data === null){
                xhr.send();
            }else{
                xhr.send(JSON.stringify(data));
            }
    });
        
}

