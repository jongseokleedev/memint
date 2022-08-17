import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  getDocs,
  collection,
  query,
  doc,
  getDoc,
  orderBy,
} from "firebase/firestore";
import useAuth from "../utils/hooks/useAuth";
import AlarmElement from "../components/AlarmElement";
import { useNavigate } from "react-router-dom";

export default function Confirm() {
  const auth = useAuth();
  const [alarms, setAlarms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) {
      navigate("/");
      return;
    }
    getData();
  }, []);

  const getData = async () => {
    console.log(auth.id);
    const adminCollectionRef = collection(db, "Admin", auth.id, "Alarm");
    const q = query(adminCollectionRef, orderBy("createdAt", "desc"));
    const data = await getDocs(q);
    const alarmData = data.docs.map((el) => {
      return { id: el.id, ...el.data() };
    });
    const meetingData = await Promise.all(
      alarmData.map(async (el) => {
        const meetingDocRef = doc(db, "Meeting", el.meetingId);
        const res = await getDoc(meetingDocRef);
        return {
          ...el,
          meetingInfo: { ...res.data() },
        };
      })
    );
    setAlarms(meetingData);
  };

  return (
    <div>
      관리자 인증 요청
      {/* <button onClick={getData}>테스트데이터~</button> */}
      <ul className="requests">
        {alarms.map((el, idx) => {
          return (
            <AlarmElement
              key={idx}
              alarm={el}
              // handleInput={handleInput}
              // handleConfirm={handleConfirm}
              // handleDeny={handleDeny}
              getData={getData}
            />
          );
        })}
      </ul>
    </div>
  );
}
