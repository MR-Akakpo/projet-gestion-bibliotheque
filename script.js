let books = [];

const booksBody = document.getElementById("booksBody");

const searchInput = document.getElementById("searchInput");

const form = document.getElementById("bookForm");

const modal = document.getElementById("bookModal");

const closeModal = document.querySelector(".close");

let editIndex = -1;

/* CHARGEMENT XML */

fetch("books.xml")

.then(response => response.text())

.then(data => {

    const parser = new DOMParser();

    const xml = parser.parseFromString(data, "text/xml");

    const xmlBooks = xml.getElementsByTagName("book");

    books = [];

    for(let book of xmlBooks){

        books.push({

            title: book.getElementsByTagName("title")[0].textContent,

            author: book.getElementsByTagName("author")[0].textContent,

            year: book.getElementsByTagName("year")[0].textContent,

            price: book.getElementsByTagName("price")[0].textContent,

            image: book.getElementsByTagName("image")[0].textContent

        });

    }

    displayBooks(books);

});

/* AFFICHAGE */

function displayBooks(data){

    booksBody.innerHTML = "";

    data.forEach((book, index) => {

        booksBody.innerHTML += `

        <tr>

            <td>${book.title}</td>

            <td>${book.author}</td>

            <td>${book.year}</td>

            <td>${book.price} FCFA</td>

            <td>

                <div class="actions">

                    <button class="view-btn" onclick="viewBook(${index})">

                        Voir

                    </button>

                    <button class="edit-btn" onclick="editBook(${index})">

                        Modifier

                    </button>

                    <button class="delete-btn" onclick="deleteBook(${index})">

                        Supprimer

                    </button>

                </div>

            </td>

        </tr>

        `;

    });

}

/* RECHERCHE */

searchInput.addEventListener("keyup", () => {

    const value = searchInput.value.toLowerCase();

    const filtered = books.filter(book =>

        book.title.toLowerCase().includes(value)

    );

    displayBooks(filtered);

});

/* AJOUT */

form.addEventListener("submit", function(e){

    e.preventDefault();

    const newBook = {

        title: document.getElementById("title").value,

        author: document.getElementById("author").value,

        year: document.getElementById("year").value,

        price: document.getElementById("price").value,

        image: document.getElementById("image").value

    };

    if(editIndex === -1){

        books.push(newBook);

    } else {

        books[editIndex] = newBook;

        editIndex = -1;

    }

    displayBooks(books);

    form.reset();

});

/* SUPPRESSION */

function deleteBook(index){

    if(confirm("Voulez-vous supprimer ce livre ?")){

        books.splice(index, 1);

        displayBooks(books);

    }

}

/* MODIFICATION */

function editBook(index){

    const book = books[index];

    document.getElementById("title").value = book.title;

    document.getElementById("author").value = book.author;

    document.getElementById("year").value = book.year;

    document.getElementById("price").value = book.price;

    document.getElementById("image").value = book.image;

    editIndex = index;

}

/* VOIR */

function viewBook(index){

    const book = books[index];

    document.getElementById("modalTitle").innerText = book.title;

    document.getElementById("modalAuthor").innerText = book.author;

    document.getElementById("modalYear").innerText = book.year;

    document.getElementById("modalPrice").innerText = book.price + " FCFA";

    document.getElementById("modalImage").src = book.image;

    modal.style.display = "block";

}

/* FERMER MODAL */

closeModal.onclick = function(){

    modal.style.display = "none";

}

window.onclick = function(event){

    if(event.target == modal){

        modal.style.display = "none";

    }

}