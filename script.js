let books = [];
let editIndex = -1;

const tableBody = document.getElementById("bookTableBody");
const form = document.getElementById("bookForm");

fetch("books.xml")
    .then(response => response.text())
    .then(data => {

        const parser = new DOMParser();
        const xml = parser.parseFromString(data, "application/xml");

        const xmlBooks = xml.getElementsByTagName("book");

        for (let book of xmlBooks) {

            books.push({
                title: book.getElementsByTagName("title")[0].textContent,
                author: book.getElementsByTagName("author")[0].textContent,
                year: book.getElementsByTagName("year")[0].textContent,
                price: book.getElementsByTagName("price")[0].textContent,
                image: book.getElementsByTagName("image")[0].textContent
            });

        }

        displayBooks();

    });

function displayBooks(filteredBooks = books) {

    tableBody.innerHTML = "";

    filteredBooks.forEach((book, index) => {

        tableBody.innerHTML += `
            <tr>

                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.year}</td>
                <td>${book.price} FCFA</td>

                <td>

                    <button class="view-btn"
                        onclick="viewBook(${index})">
                        Voir
                    </button>

                    <button class="edit-btn"
                        onclick="editBook(${index})">
                        Modifier
                    </button>

                    <button class="delete-btn"
                        onclick="deleteBook(${index})">
                        Supprimer
                    </button>

                </td>

            </tr>
        `;

    });

}

form.addEventListener("submit", function(e) {

    e.preventDefault();

    const book = {

        title: title.value,
        author: author.value,
        year: year.value,
        price: price.value,
        image: image.value

    };

    if (editIndex === -1) {

        books.push(book);

    } else {

        books[editIndex] = book;
        editIndex = -1;

    }

    displayBooks();

    form.reset();

});

function deleteBook(index) {

    if (confirm("Voulez-vous supprimer ce livre ?")) {

        books.splice(index, 1);

        displayBooks();

    }

}

function editBook(index) {

    const book = books[index];

    title.value = book.title;
    author.value = book.author;
    year.value = book.year;
    price.value = book.price;
    image.value = book.image;

    editIndex = index;

}

function viewBook(index) {

    const book = books[index];

    document.getElementById("modal").style.display = "block";

    modalImage.src = book.image;
    modalTitle.textContent = book.title;
    modalAuthor.textContent = "Auteur : " + book.author;
    modalYear.textContent = "Année : " + book.year;
    modalPrice.textContent = "Prix : " + book.price + " FCFA";

}

document.querySelector(".close")
.addEventListener("click", () => {

    document.getElementById("modal").style.display = "none";

});

document.getElementById("searchInput")
.addEventListener("keyup", function() {

    const value = this.value.toLowerCase();

    const filtered = books.filter(book =>
        book.title.toLowerCase().includes(value)
    );

    displayBooks(filtered);

});