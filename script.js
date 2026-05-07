let books = [];

let editIndex = null;

/* =========================
   DOM ELEMENTS
========================= */

const tableBody =
document.getElementById("bookTableBody");

const form =
document.getElementById("bookForm");

const searchInput =
document.getElementById("searchInput");

const modal =
document.getElementById("bookModal");

const closeBtn =
document.querySelector(".close-btn");

const toast =
document.getElementById("toast");

/* =========================
   LOAD XML
========================= */

function loadXMLBooks(){

    const xhr =
    new XMLHttpRequest();

    xhr.open("GET", "books.xml", true);

    xhr.onload = function(){

        if(this.status === 200){

            const xml =
            this.responseXML;

            const bookElements =
            xml.getElementsByTagName("book");

            books = [];

            for(let i = 0; i < bookElements.length; i++){

                books.push({

                    title:
                    bookElements[i]
                    .getElementsByTagName("title")[0]
                    .textContent.trim(),

                    author:
                    bookElements[i]
                    .getElementsByTagName("author")[0]
                    .textContent.trim(),

                    year:
                    bookElements[i]
                    .getElementsByTagName("year")[0]
                    .textContent.trim(),

                    price:
                    bookElements[i]
                    .getElementsByTagName("price")[0]
                    .textContent.trim(),

                    image:
                    bookElements[i]
                    .getElementsByTagName("image")[0]
                    .textContent.trim()
                });
            }

            displayBooks(books);

            saveToLocalStorage();
        }
    };

    xhr.send();
}

/* =========================
   DISPLAY BOOKS
========================= */

function displayBooks(bookArray){

    tableBody.innerHTML = "";

    if(bookArray.length === 0){

        tableBody.innerHTML = `

            <tr>

                <td colspan="5"
                    style="
                    text-align:center;
                    padding:40px;
                    color:#cbd5e1;">

                    Aucun livre trouvé

                </td>

            </tr>
        `;

        return;
    }

    bookArray.forEach((book, index) => {

        const row =
        document.createElement("tr");

        row.innerHTML = `

            <td>${book.title}</td>

            <td>${book.author}</td>

            <td>${book.year}</td>

            <td>${book.price} FCFA</td>

            <td>

                <div class="action-buttons">

                    <button
                    class="view-btn"
                    onclick="viewBook(${index})">

                        <i class="fa-solid fa-eye"></i>

                    </button>

                    <button
                    class="edit-btn"
                    onclick="editBook(${index})">

                        <i class="fa-solid fa-pen"></i>

                    </button>

                    <button
                    class="delete-btn"
                    onclick="deleteBook(${index})">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </td>
        `;

        tableBody.appendChild(row);
    });
}

/* =========================
   ADD / UPDATE BOOK
========================= */

form.addEventListener("submit", function(e){

    e.preventDefault();

    const title =
    document.getElementById("title")
    .value.trim();

    const author =
    document.getElementById("author")
    .value.trim();

    const year =
    document.getElementById("year")
    .value.trim();

    const price =
    document.getElementById("price")
    .value.trim();

    const image =
    document.getElementById("image")
    .value.trim();

    if(
        !title ||
        !author ||
        !year ||
        !price ||
        !image
    ){

        showToast(
            "Veuillez remplir tous les champs"
        );

        return;
    }

    const book = {

        title,
        author,
        year,
        price,
        image
    };

    /* ADD */

    if(editIndex === null){

        books.push(book);

        showToast(
            "Livre ajouté avec succès"
        );
    }

    /* UPDATE */

    else{

        books[editIndex] = book;

        showToast(
            "Livre modifié avec succès"
        );

        editIndex = null;

        document.querySelector(".submit-btn")
        .innerHTML = `

            <i class="fa-solid fa-plus"></i>

            Ajouter
        `;
    }

    saveToLocalStorage();

    displayBooks(books);

    form.reset();
});

/* =========================
   DELETE BOOK
========================= */

function deleteBook(index){

    const confirmation =
    confirm(
        "Voulez-vous supprimer ce livre ?"
    );

    if(confirmation){

        books.splice(index, 1);

        saveToLocalStorage();

        displayBooks(books);

        showToast(
            "Livre supprimé"
        );
    }
}

/* =========================
   EDIT BOOK
========================= */

function editBook(index){

    const book =
    books[index];

    document.getElementById("title")
    .value = book.title;

    document.getElementById("author")
    .value = book.author;

    document.getElementById("year")
    .value = book.year;

    document.getElementById("price")
    .value = book.price;

    document.getElementById("image")
    .value = book.image;

    editIndex = index;

    document.querySelector(".submit-btn")
    .innerHTML = `

        <i class="fa-solid fa-pen"></i>

        Modifier
    `;

    window.scrollTo({

        top:
        document.body.scrollHeight,

        behavior:"smooth"
    });
}

/* =========================
   SEARCH
========================= */

searchInput.addEventListener("keyup", () => {

    const value =
    searchInput.value.toLowerCase();

    const filteredBooks =

    books.filter(book =>

        book.title
        .toLowerCase()
        .includes(value)
    );

    displayBooks(filteredBooks);
});

/* =========================
   VIEW BOOK
========================= */

function viewBook(index){

    const book =
    books[index];

    document.getElementById("modalImage")
    .src = book.image;

    document.getElementById("modalTitle")
    .textContent = book.title;

    document.getElementById("modalAuthor")
    .textContent =
    "Auteur : " + book.author;

    document.getElementById("modalYear")
    .textContent =
    "Année : " + book.year;

    document.getElementById("modalPrice")
    .textContent =
    "Prix : " + book.price + " FCFA";

    modal.style.display = "block";
}

/* =========================
   CLOSE MODAL
========================= */

closeBtn.addEventListener("click", () => {

    modal.style.display = "none";
});

window.addEventListener("click", (e) => {

    if(e.target === modal){

        modal.style.display = "none";
    }
});

/* =========================
   TOAST
========================= */

function showToast(message){

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);
}

/* =========================
   LOCAL STORAGE
========================= */

function saveToLocalStorage(){

    localStorage.setItem(

        "books",

        JSON.stringify(books)
    );
}

function loadFromLocalStorage(){

    const data =
    localStorage.getItem("books");

    if(data){

        books = JSON.parse(data);

        displayBooks(books);

    } else {

        loadXMLBooks();
    }
}

/* =========================
   INIT
========================= */

loadFromLocalStorage();