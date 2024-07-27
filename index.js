// Import express, axios, and body-parser
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

// Create an express app, set the port number, set the API URL address.
const app = express();
const port = 3000;
const API_URL = "https://openlibrary.org/search.json";

// Function to find current year.
const d = new Date();
let year = d.getFullYear();

// Use the public folder for static files, and use Body Parser.
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  try {
    res.render("index.ejs", { currentYear: year });
  } catch (error) {
    res.status(404).send(error.message);
  }
});

app.post("/submit", async (req, res) => {
  try {
    const searchDate = req.body.first_publish_year;
    console.log(searchDate);
    const result = await axios.get(
      API_URL + "?first_publish_year=" + searchDate + "&subject=quest"
    );

    let searchResult = result.data;
    let documentList = searchResult.docs; // array of document objects
    let documentListSingleBook =
      documentList[Math.floor(Math.random() * documentList.length)]; //randomly select one of the objects
    console.log(documentListSingleBook);

    //If the Open Library API does not have a book for this date.
    if (documentListSingleBook == undefined) {
      res.render("emptySearchResults.ejs", {
        publicationDate: searchDate,
        currentYear: year,
      });

      //If the Open Library API has a book for this date.
    } else {
      let document = documentListSingleBook;
      let author_name = document.author_name;
      let title = document.title;
      let firstSentence = document.first_sentence;
      let publicationDate = document.first_publish_year;
      let publishYear = publicationDate[0] || publicationDate; //publishYear is generated whether the data is in an array or not.
      let noSentenceMessage =
        "We regret that the first sentence of this book is unknown to our database.";

      res.render("searchResults.ejs", {
        authorName: author_name,
        title: title,
        firstSentence: firstSentence || noSentenceMessage, //If the Open Library API does not have a first sentence for this book the "noSentenceMessage" will appear.
        publicationDate: publishYear,
        currentYear: year,
      });
    }
  } catch (error) {
    res.status(404).send(error.message);
  }
});

// Listens on predefined port and starts the server.
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
