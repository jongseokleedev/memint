import React from 'react'
import {db} from '../firebase'
import {getDocs, collection, query} from 'firebase/firestore'


export default function Confirm() {
    const usersCollectionRef = collection(db, "User");

  const getData = async() => {
    const q = await query(usersCollectionRef);

const data = await getDocs(q);
console.log(data.docs.map(el => {return el.data()}))
  }
  return (
    <div>Confirm
      <button onClick={getData}>테스트데이터~</button>
    </div>
  )
}
