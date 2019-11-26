
const express = require('express');
const app = express();
const db = require('./db/');
const bodyParser = require('body-parser');
const path = require('path');
const {testConnection, getAllNotes} = require('./db/index');
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");
const ObjectId = require("mongodb").ObjectId;
/*-------------------------------------------------------------------------
Routes for notes
----------------------------------------------------------------------------*/

app.get("/", async function(req, res){
    const notes = await getAllNotes();
    res.render("index", {
        isNotes: await notes.length,
        notesArr: await notes
    });
});
app.get("/note", function (req, res) {
   res.render("createItem", {
       MainTitle: "Create Note"
   });
});
app.get("/notes/:id", async function (req, res) {
    const id = req.params.id;
    res.render("detailNotePage", {
        oneNote: await db.getNote(id)
    });
});
app.post("/api/notes", async function (req, res) {
    console.log(req.body);
    //res.send("Note created");
    await db.addNote(req.body);
    res.end();
});
app.delete('/api/notes/:id', async function (req, res) {
    const id = req.params.id;
    const deleteCount = await db.deleteNote(`${id.slice(1, id.length)}`);
    //console.log(Number(`${id.slice(1, id.length)}`));
    res.send(deleteCount.toString());
    res.end();
});

app.put('/api/notes/:id', async function (req, res) {
    // const newNote = req.body;
    // newNote._id = ObjectId(req.body._id);
    // newNote.date = new Date(req.body.date);
    // console.log(newNote);
    console.log( await db.updateNote(req.body));
    res.end()
});
console.log("app start");
app.listen(3000);


