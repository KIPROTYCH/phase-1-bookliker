document.addEventListener('DOMContentLoaded', () => {
    const listPanel = document.getElementById('list');
    const showPanel = document.getElementById('show-panel');
    const currentUser = { id: 1, username: 'pouros' };

    // Function to fetch and render the list of books
    const fetchBooks = () => {
        fetch('http://localhost:3000/books')
            .then(response => response.json())
            .then(books => renderBooks(books))
            .catch(error => console.error('Error fetching books:', error));
    };

    // Function to render the list of books
    const renderBooks = (books) => {
        listPanel.innerHTML = '';
        books.forEach(book => {
            const li = document.createElement('li');
            li.innerText = book.title;
            li.addEventListener('click', () => showBookDetails(book));
            listPanel.appendChild(li);
        });
    };

    // Function to display the details of a book
    const showBookDetails = (book) => {
        showPanel.innerHTML = '';
        const bookTitle = document.createElement('h2');
        bookTitle.innerText = book.title;

        const bookImage = document.createElement('img');
        bookImage.src = book.img_url;

        const bookDescription = document.createElement('p');
        bookDescription.innerText = book.description;

        const likeButton = document.createElement('button');
        likeButton.innerText = 'LIKE';
        likeButton.addEventListener('click', () => likeBook(book));

        const likedBy = document.createElement('p');
        likedBy.innerText = 'Liked by:';
        book.users.forEach(user => {
            const userSpan = document.createElement('span');
            userSpan.innerText = user.username;
            likedBy.appendChild(userSpan);
        });

        showPanel.appendChild(bookTitle);
        showPanel.appendChild(bookImage);
        showPanel.appendChild(bookDescription);
        showPanel.appendChild(likeButton);
        showPanel.appendChild(likedBy);
    };

    // Function to like/unlike a book
    const likeBook = (book) => {
        const likedByCurrentUser = book.users.some(user => user.id === currentUser.id);

        if (likedByCurrentUser) {
            const updatedUsers = book.users.filter(user => user.id !== currentUser.id);
            unlikeBook(book, updatedUsers);
        } else {
            const updatedUsers = [...book.users, currentUser];
            likeBookRequest(book, updatedUsers);
        }
    };

    // Function to send a PATCH request to like a book
    const likeBookRequest = (book, updatedUsers) => {
        fetch(`http://localhost:3000/books/${book.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ users: updatedUsers }),
        })
            .then(response => response.json())
            .then(updatedBook => showBookDetails(updatedBook))
            .catch(error => console.error('Error liking book:', error));
    };

    // Function to send a PATCH request to unlike a book
    const unlikeBook = (book, updatedUsers) => {
        fetch(`http://localhost:3000/books/${book.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ users: updatedUsers }),
        })
            .then(response => response.json())
            .then(updatedBook => {
                const likedBy = showPanel.querySelector('p');
                likedBy.innerHTML = 'Liked by:';
                updatedBook.users.forEach(user => {
                    const userSpan = document.createElement('span');
                    userSpan.innerText = user.username;
                    likedBy.appendChild(userSpan);
                });
            })
            .catch(error => console.error('Error unliking book:', error));
    };

    // Initial fetch and render books
    fetchBooks();
});
