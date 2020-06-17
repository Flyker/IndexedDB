'use strict';
import { Observable } from 'rxjs';

const storeName = "tokens";

function connectDB(dbname) {
    let request = indexedDB.open(dbname, 2);
    return new Observable((sub)=> {
        request.onerror = (ev) => sub.error(ev.target.error)
        request.onupgradeneeded = (ev) => {
            let db = ev.target.result;
            /*
            let objectStore = db.createObjectStore(storeName, { keyPath: "access_token" });
            objectStore.createIndex("access_token_ind", "access_token", { unique: true });
            objectStore.createIndex("refresh_token_ind", "refresh_token", { unique: true });
            */
            sub.next(db);
        }
        request.onsuccess = (ev) => { 
            //request.result.onclose = () => sub.complete()
            sub.next(ev.target.result)
        }        
    });
}

export { connectDB }