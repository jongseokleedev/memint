import React, { useState } from "react";
import {
  handleDateFromNow,
  handleDateInFormat,
} from "../utils/common/DateFunctions";
import "../pages/Confirm.scss";
import {
  addDoc,
  collection,
  doc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { createEarnOffTxLg } from "../lib/Admin";
import useAuth from "../utils/hooks/useAuth";
import { notification } from "../lib/api/notification";

export default function AlarmElement({
  alarm,

  getData,

}) {
  const auth = useAuth();

  const [modal, setModal] = useState(false);
  const [message, setMessage] = useState("");
  const handleInput = (e) => {
    setMessage(e.target.value);
  };
  const handleClick = () => {
    if (alarm.complete) {
      return;
    } else {
      setModal(true);
    }
  };
  const handleModal = () => {
    setModal(!modal);
  };
  const handleConfirm = async () => {
    if (message.length === 0) {
      alert("메시지를 작성해주세요!");
      return;
    }

    //confirmStatus, meetingStatus, confirmMessage
    const meetingRef = doc(db, "Meeting", alarm.meetingId);

    await updateDoc(meetingRef, {
      confirmStatus: "confirmed",
      status: "confirmed",
      confirmMessage: message,
    });

    //user 토큰 보상 update 멤버 다 반복문
    //user 보상 alarm add

    for (let id of alarm.meetingInfo.members) {
      await createEarnOffTxLg(Object.keys(id)[0], 1, "미팅 참여");
      const userAlarmRef = collection(db, "User", Object.keys(id)[0], "Alarm");
      await addDoc(userAlarmRef, {
        type: "earned",
        sender: "admin",
        meetingId: alarm.meetingId,
        createdAt: Timestamp.now(),
      });
      notification({receiver: Object.keys(id)[0], message: '미팅 참여 보상을 받았습니다!'})
    }

    const alarmRef = doc(db, "Admin", auth.id, "Alarm", alarm.id);
    await updateDoc(alarmRef, {
      complete: true,
    });
    setModal(false);
    await getData();
  };

  const handleDeny = async (el) => {
    if (message.length === 0) {
      alert("메시지를 작성해주세요!");
      return;
    }
    //confirmStatus, confirmMessage
    const meetingRef = doc(db, "Meeting", el.meetingId);

    await updateDoc(meetingRef, {
      confirmStatus: "denied",
      confirmMessage: message,
    });

    const alarmRef = doc(db, "Admin", auth.id, "Alarm", el.id);
    await updateDoc(alarmRef, {
      complete: true,
    });
    setModal(false);

    await getData();
  };
  return (
    <div className="alarm-element">
      <div className="alarm" onClick={handleClick}>
        <div className="content">
          {alarm.complete ? (
            <div className="message">처리된 요청입니다.</div>
          ) : (
            <div className="message">요청이 도착했습니다</div>
          )}
          <div>
            <div className="title">미팅 정보</div>

            <div className="meetingTitle">{alarm.meetingInfo.title}</div>
            <div className="meetingInfo">
              <span className="info">
                인원: {alarm.meetingInfo.peopleNum}:
                {alarm.meetingInfo.peopleNum}
              </span>
              <span className="bar" />
              <span className="info">
                시간:{handleDateInFormat(alarm.meetingInfo.meetDate)}
              </span>
            </div>
          </div>
        </div>
        <div className="createdAt">{handleDateFromNow(alarm.createdAt)}</div>
      </div>
      {!modal ? null : (
        <div className="modalContainer">
          <div className="modal">
            <div className="header">
              <span>요청 처리</span>
              <button className="close-button" onClick={handleModal}>
                x
              </button>
            </div>
            <div>
              <div className="img">
                <img src={alarm.meetingInfo.confirmImage} alt="confirmImage" />
              </div>
              <div className="meetingInfoArea">
                <div className="title">미팅 정보</div>

                <div className="meetingTitle">{alarm.meetingInfo.title}</div>
                <div className="meetingInfo">
                  <span className="info">
                    인원: {alarm.meetingInfo.peopleNum}:
                    {alarm.meetingInfo.peopleNum}
                  </span>
                  <span className="bar" />
                  <span className="info">
                    시간:{handleDateInFormat(alarm.meetingInfo.meetDate)}
                  </span>
                  <span className="bar" />
                  <span className="info">장소:{alarm.meetingInfo.region}</span>
                </div>
              </div>
              <div>
                <div>
                  <textarea onChange={handleInput} placeholder="인증메시지" />
                </div>
                <div className="button-area">
                  <button
                    className="submit confirm"
                    onClick={() => {
                      handleConfirm(alarm);
                    }}
                  >
                    인증하기
                  </button>
                  <button
                    className="submit deny"
                    onClick={() => {
                      handleDeny(alarm);
                    }}
                  >
                    반려
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
