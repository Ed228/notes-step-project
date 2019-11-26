function isFieldsEquals(keys, oldNote, newNote){
    if(typeof keys != "object" || typeof oldNote != "object" || typeof newNote != "object"){
        throw new Error("Incorrect type of inputs")
    }
    for(let i = 0; i < keys.length; i++){
        if(newNote[keys[i]] !== oldNote[keys[i]]){
            return false;
        }
    }
    return true;
}
const ObjectId = require("mongodb").ObjectId;

const MongoClient = require('mongodb').MongoClient;
const {uri, db}= require('./config');

const testConnection = async () => {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    await client.connect();
    console.log('connected');
    client.close();
};

const getAllNotes = async () => {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    await client.connect();
    const notesCollection = await client.db(db).collection("notes");
    const data = await notesCollection.find({}).toArray();
    //console.log(data);
    client.close();
    return data;
};

const addNote = async note => {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    await client.connect();
    const notesCollection = await client.db(db).collection("notes");
    await notesCollection.insertOne(note);
    console.log("1 document inserted");
    client.close();
};

const deleteNote = async id => {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    await client.connect();
    const notesCollection = await client.db(db).collection("notes");
    const item = await notesCollection.deleteOne({_id: ObjectId(id)});
    console.log('deleted one note');
    client.close();
    return item.deletedCount;
};

const getNote  = async id => {
    const client = new MongoClient(uri, { useNewUrlParser: true });
    await client.connect();
    const notesCollection = await client.db(db).collection("notes");
    const data = await notesCollection.findOne({_id: ObjectId(id)});
    client.close();
    return data;
};

const updateNote = async newNote =>{
    const client = new MongoClient(uri, { useNewUrlParser: true });
    await client.connect();
    const notesCollection = await client.db(db).collection("notes");
    const oldNote = await notesCollection.findOne({_id: ObjectId(newNote._id)});
    client.close();
    return isFieldsEquals(['title', 'note'], oldNote, newNote);
    //return data;
};

module.exports = {
    testConnection,
    getAllNotes,
    addNote,
    deleteNote,
    getNote,
    updateNote
};