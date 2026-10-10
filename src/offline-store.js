const DATABASE='agraharam-offline-v1';
let connection;
function open(){return connection ||=new Promise((resolve,reject)=>{const r=indexedDB.open(DATABASE,1);r.onupgradeneeded=()=>r.result.createObjectStore('data');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
export async function get(key){const db=await open();return new Promise((resolve,reject)=>{const r=db.transaction('data').objectStore('data').get(key);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)})}
export async function set(key,value){const db=await open();return new Promise((resolve,reject)=>{const t=db.transaction('data','readwrite');t.objectStore('data').put(value,key);t.oncomplete=()=>resolve(value);t.onerror=()=>reject(t.error);t.onabort=()=>reject(t.error)})}
export async function entries(prefix){const db=await open();return new Promise((resolve,reject)=>{const out=[];const r=db.transaction('data').objectStore('data').openCursor();r.onsuccess=()=>{const c=r.result;if(c){if(String(c.key).startsWith(prefix))out.push(c.value);c.continue()}else resolve(out)};r.onerror=()=>reject(r.error)})}
export async function remove(key){const db=await open();return new Promise((resolve,reject)=>{const t=db.transaction('data','readwrite');t.objectStore('data').delete(key);t.oncomplete=resolve;t.onerror=()=>reject(t.error)})}
