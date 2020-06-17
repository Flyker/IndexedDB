"use strict";
//import { connectDB } from './db_apis/db_apis';

if (!indexedDB) throw new Error("indexedDB not supported...");
//
const myBaseName = "clientBase";
const tokenStoreName = "tokens";
const namesStoreName = "names";
const dbVersion = 3;
//
function GetObjectStoreNames(objectStoreNames) {
    let StoreNames = [];
    for (let i = 0; i < objectStoreNames.length; i++)
        StoreNames.push(objectStoreNames[i]);
    return StoreNames;
}
//
function createObjectStore(db) {
    let StoreNames = GetObjectStoreNames(db.objectStoreNames);
    if (StoreNames.find((el) => el == tokenStoreName)) {
        db.deleteObjectStore(tokenStoreName);
    }
    let objectStore = db.createObjectStore(tokenStoreName, {
        keyPath: "id",
        autoIncrement: true,
    });
    objectStore.createIndex("access_token", "access_token", { unique: true });
    objectStore.createIndex("refresh_token", "refresh_token", { unique: true });
}
//
function createObjectStore2(db) {
    let StoreNames = GetObjectStoreNames(db.objectStoreNames);
    if (StoreNames.find((el) => el == namesStoreName)) {
        db.deleteObjectStore(namesStoreName);
    }
    let objectStore = db.createObjectStore(namesStoreName, {
        keyPath: "id",
        autoIncrement: true,
    });
    objectStore.createIndex("name", "name", { unique: true });
}
//
function GetTokensStore(db) {
    let transaction = db.transaction(tokenStoreName, "readwrite");
    return transaction.objectStore(tokenStoreName);
}
//
function GetNamesStore(db) {
    let transaction = db.transaction(namesStoreName, "readwrite");
    return transaction.objectStore(namesStoreName);
}
//
let request = indexedDB.open(myBaseName, dbVersion);
request.onerror = (ev) => console.log(ev.target.error);
//
request.onupgradeneeded = (ev) => {
    let db = ev.target.result;
    createObjectStore(db);
    createObjectStore2(db);
};
//
request.onsuccess = (ev) => {
    let db = ev.target.result;
    let tokenTransaction = db.transaction(namesStoreName, "readwrite");
    let tokenStore = tokenTransaction.objectStore(namesStoreName);
    /*
    tokenStore.add({
        access_token: "access_token_12345",
        refresh_token: "refresh_token_12345",
    });
    */
    let tokens = [];
    //let getTokens = tokenStore.getAll()
    tokenStore.openCursor().onsuccess = (event) => {
        let reader = event.target.result
        if (reader) {
            tokens.push(reader.value)
            reader.continue()
        }
        else {
            console.log(tokens)
        }
    };
    //
    let names = []
    let namesTransaction = db.transaction(namesStoreName);
    let namesStore = namesTransaction.objectStore(namesStoreName);
    //namesStore.add({ name: "John" });
    namesStore.openCursor().onsuccess = (event) => {
        let reader = event.target.result
        if (reader) {
            names.push(reader.value)
            reader.continue()
        }
        else {
            console.log(names)
        }
    };
    db.close();
    /*
    objectStore.openCursor().onsuccess = function(event) {
        let reader = event.target.result;
        if (reader) {
            tokens.push(reader.value);
            reader.continue();
        }
    };
    */
};
