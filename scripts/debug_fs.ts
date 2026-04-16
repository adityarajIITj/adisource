// debug
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, orderBy, query } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAPngX-UkrCUPbfSbOvYKhL3Z1iO4xvTMQ",
  authDomain: "adisource-4e0f2.firebaseapp.com",
  projectId: "adisource-4e0f2",
  storageBucket: "adisource-4e0f2.firebasestorage.app",
  messagingSenderId: "634894336851",
  appId: "1:634894336851:web:f56485b11edb0438f917a6",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
  try {
    const semSnap = await getDocs(query(collection(db, "semesters"), orderBy("id")));
    console.log("Found semesters:", semSnap.size);
    semSnap.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
