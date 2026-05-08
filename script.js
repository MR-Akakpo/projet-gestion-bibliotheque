let books = [];

const tableBody = document.getElementById("bookTableBody");

// Charger XML
function loadXMLBooks(){

    const xhr = new XMLHttpRequest();

    xhr.open("GET","books.xml",true);

    xhr.onload = function(){

        if(this.status === 200){

            const xml = this.responseXML;

            const bookElements = xml.getElementsByTagName("book");

            for(let i=0; i<bookElements.length; i++){

                books.push({

                    title: bookElements[i]
                    .getElementsByTagName("title")[0]
                    .textContent,

                    author: bookElements[i]
                    .getElementsByTagName("author")[0]
                    .textContent,

                    year: bookElements[i]
                    .getElementsByTagName("year")[0]
                    .textContent,

                    price: bookElements[i]
                    .getElementsByTagName("price")[0]
                    .textContent
                });
            }

            displayBooks();
        }
    }

    xhr.send();
}

// Affichage
function displayBooks(){

    tableBody.innerHTML = "";

    books.forEach(book => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.year}</td>
            <td>${book.price} FCFA</td>
            <td>
                <button>Voir</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

loadXMLBooks();