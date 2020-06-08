const express = require("express");
const app = express();

app.use(express.static("./public"));
////-----------------------------Home Page------------------------------------------------//
app.get("/", (req, res) => {
    res.render("index");
});

////-----------------------------File-sources------------------------------------------------//

////------Listen on a port------////
// app.listen(8080, console.log("ehportfolio server listening..."));
app.listen(process.env.PORT || 8080, () =>
    console.log("spotify-search-api server is running...")
);
