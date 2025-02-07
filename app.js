const express = require("express");
const mysql = require("mysql2");

const app = express();
app.use(express.json()); // Fix JSON middleware

// Configure MySQL connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Rahoofxd2@",
    database: "library"
});

// Connect to MySQL
connection.connect((err) =>  {
    if (err) {
        console.log("Error connecting to MySQL:", err);
    }
});

// Books Table

// 1- Add a new book
app.post("/books", (req, res) => {
    const { id, name, title } = req.body;
    const query = "INSERT INTO books (id, name, title) VALUES (?, ?, ?)";
    
    connection.query(query, [id, name, title], (err) => {
        if (err) {
            return res.status(500).json({ error: "Error adding new book", details: err.message });
        }
        res.status(201).json({ message: "Book has been added" });
    });
});

// 2 - Get all books
app.get("/books", (req, res) => {
    const query = "SELECT * FROM books";
    
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error retrieving the books", details: err.message });
        }
        res.json(results);
    });
});

// 3 - Get book by ID
app.get("/books/:id", (req, res) => {
    const query = "SELECT * FROM books WHERE id = ?";
    
    connection.query(query, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error retrieving the book", details: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.json(results[0]);
    });
});

// 4 - Update book by ID
app.put("/books/:id", (req, res) => {
    const { name, title } = req.body;
    const query = "UPDATE books SET name = ?, title = ? WHERE id = ?";
    
    connection.query(query, [name, title, req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error updating the book", details: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json({ message: "Book has been updated" });
    });
});

// 5 - Delete book by ID
app.delete("/books/:id", (req, res) => {
    const query = "DELETE FROM books WHERE id = ?";
    
    connection.query(query, [req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error deleting the book", details: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json({ message: "Book has been deleted" });
    });
});

// 6 - Update translation by book ID
app.patch("/books/:id/translation", (req, res) => {
    const { language } = req.body; // Fixed typo

    if (!language || typeof language !== "string") {
        return res.status(400).json({ error: "Invalid or missing language" });
    }

    const query = "UPDATE books SET title = CONCAT(title, ' - (', ?, ')') WHERE id = ?";
    
    connection.query(query, [language, req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error updating translation", details: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json({ message: "Book translation has been updated" });
    });
});


// Bookshop Table

// 1 - Add a new bookshop
app.post("/bookshop", (req, res) => {
    const { shop_id, city, name, contactNumber, email, Address } = req.body;

    const queryToCheck = "SELECT * FROM bookshop WHERE shop_id = ? OR city = ? OR name = ? OR contactNumber = ? OR email = ? OR Address = ?";
    
    connection.query(queryToCheck, [shop_id, city, name, contactNumber, email, Address], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Bookshop exists with this info", details: err.message });
        }

        const query = "INSERT INTO bookshop (shop_id, city, name, contactNumber, email, Address) VALUES (?, ?, ?, ?, ?, ?)";
        
        connection.query(query, [shop_id, city, name, contactNumber, email, Address], (err) => {
            if (err) {
                return res.status(500).json({ error: "Error adding new bookshop", details: err.message });
            }
            res.status(201).json({ message: "Bookshop has been added successfully" });
        });
    });
});


// 2 - Get bookshop by ID
app.get("/bookshop/:shop_id", (req, res) => {
    const query = "SELECT * FROM bookshop WHERE shop_id = ?";
    
    connection.query(query, [req.params.shop_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error retrieving the bookshop", details: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Bookshop not found" });
        }
        res.json(results[0]);
    });
});

// 3 - get cities 
app.get("/cities", (req, res) => {
    const query = "SELECT DISTINCT city FROM bookshop";
    
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error retrieving the cities", details: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "No cities found" });
        }

        res.json(results);
    });
});

// 4 - Get bookshop by name
app.get("/bookshop/:name/name", (req, res) => {
    const query = "SELECT * FROM bookshop WHERE name = ?";
    connection.query(query, [req.params.name], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error retrieving the bookshop", details: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Bookshop not found" });
        }
        res.json(results[0]);
    });
});

// 5 - Get bookshop by email id
app.get("/bookshop/:email/email", (req, res) => {
    const query = "SELECT * FROM bookshop WHERE email = ?";
    connection.query(query, [req.params.email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error retrieving the bookshop", details: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Bookshop not found" });
        }
        res.json(results[0]);
    });
});

// 6 - Delete bookshop by ID
app.delete("/bookshop/:shop_id", (req, res) => {
    const query = "DELETE FROM bookshop WHERE shop_id = ?";
    
    connection.query(query, [req.params.shop_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error deleting the bookshop", details: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Bookshop not found" });
        }
        res.status(200).json({ message: "Bookshop has been deleted successfully" });
    });
});

// 7 - Update name of bookshop by ID
app.put("/bookshop/:shop_id/name", (req, res) => {
    const { name } = req.body;
    const query = "UPDATE bookshop SET name = ? WHERE shop_id = ?";
    
    connection.query(query, [name, req.params.shop_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error updating the bookshop name", details: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Bookshop not found" });
        }
        res.status(200).json({ message: "Bookshop name has been updated" });
    });
});

// 8 - Update email of bookshop by ID
app.put("/bookshop/:shop_id/email", (req, res) => {
    const { email } = req.body;
    const query = "UPDATE bookshop SET email = ? WHERE shop_id = ?";
    
    connection.query(query, [email, req.params.shop_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Error updating the bookshop email", details: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Bookshop not found" });
        }
        res.status(200).json({ message: "Bookshop email has been updated" });
    });
});

// Start the server
const port = 3002;
app.listen(port, () => {
    console.log(`Server has been started on http://localhost:${port}`);
});
