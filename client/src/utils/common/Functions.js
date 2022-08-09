export const handleDate = obj => {
  return obj.toDate().toLocaleString();
};

export const handleDateInFormat = obj => {
  const day = obj.toDate().getDay();
  const date = obj.toDate().toLocaleString();
  let str = '';
  switch (day) {
    case 0:
      str = '일';
      break;
    case 1:
      str = '월';
      break;
    case 2:
      str = '화';
      break;
    case 3:
      str = '수';
      break;
    case 4:
      str = '목';
      break;
    case 5:
      str = '금';
      break;
    case 6:
      str = '토';
  }
  if (date.length === 22) {
    return `${date.slice(5, 7)}월 ${date.slice(9, 10)}일(${str}) ${date.slice(
      12,
      -6,
    )}시`;
  } else {
    return `${date.slice(5, 7)}월 ${date.slice(9, 11)}일(${str}) ${date.slice(
      13,
      -6,
    )}시`;
  }
};

export const handleDateFromNow = obj => {
  const date = obj.toDate();
  const now = new Date();
  const time = now.getTime() - date.getTime();
  let str = '';
  if (time / (1000 * 60 * 60) < 1) {
    str = parseInt(time / (1000 * 60), 10) + '분 전';
  } else if (time / (1000 * 60 * 60) > 24) {
    str = parseInt(time / (1000 * 60 * 60 * 24), 10) + '일 전';
  } else {
    str = parseInt(time / (1000 * 60 * 60), 10) + '시간 전';
  }
  return str;
};

export const handleISOtoLocale = dateInISO => {
  const date = new Date(dateInISO);
  const day = date.getDay();
  const localeDate = date.toLocaleString();
  let str = '';
  switch (day) {
    case 0:
      str = '일';
      break;
    case 1:
      str = '월';
      break;
    case 2:
      str = '화';
      break;
    case 3:
      str = '수';
      break;
    case 4:
      str = '목';
      break;
    case 5:
      str = '금';
      break;
    case 6:
      str = '토';
  }
  return `${localeDate.slice(5, 7)}월 ${localeDate.slice(
    9,
    11,
  )}일(${str}) ${localeDate.slice(13, -6)}시`;
};

export const handleBirth = str => {
  const year = str?.slice(0, 4);
  const now = new Date().getFullYear();
  const age = now - Number(year);

  let res = '';
  if (age > 40) {
    res = '40대';
  } else if (age > 35) {
    res = '30 후';
  } else if (age > 30) {
    res = '30 초';
  } else if (age > 25) {
    res = '20 후';
  } else if (age > 20) {
    res = '20 초';
  } else {
    res = '넘 어린디';
  }
  return res;
};
