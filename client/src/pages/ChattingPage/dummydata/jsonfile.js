const dummy1 = require('./images/26.png');
const dummy2 = require('./images/27.png');
const dummy3 = require('./images/28.png');
const dummy4 = require('./images/29.png');

const dummyData = [
  {
    text: 'hostImage',
    id: 1,
    image: dummy1,
    title: '금요일날 같이 놀아요',
    hostId: '김개똥',
    confirmed: false,
    joinersId: [
      {name: '김철수', confirmed: true},
      {name: '김영희', confirmed: false},
      {name: '박찬솔', confirmed: true},
    ],
    chat: [
      {
        createdAt: '2022-07-13',
        body: '테스트 1번 채팅',
        sender: '김개똥',
      },
      {
        createdAt: '2022-07-13',
        body: '테스트 2번 채팅 이므니다아아아아ㅏ',
        sender: '김철수',
      },
      {
        createdAt: '2022-07-13',
        body: '아름다운 밤이에요오오오오오오오ㅗㅇ오오ㅗ오ㅗ오오오오ㅗ오오ㅗ옷',
        sender: '김영희',
      },
      {
        createdAt: '2022-07-13',
        body: '맞습니다. 그렇습니다.',
        sender: '박찬솔',
      },
    ],
  },
  {
    text: 'hostImage',
    id: 2,
    image: dummy2,
    title: '월요일은 월래 취하는날',
    hostId: '김바퀴',
    joinersId: ['똥글이', '삼영이', '김영희'],
    chat: [
      {
        createdAt: '2022-07-13',
        body: '둠칫 흔들어바',
        sender: '김바퀴',
      },
      {
        createdAt: '2022-07-13',
        body: '그건 무리',
        sender: '똥글이',
      },
      {
        createdAt: '2022-07-13',
        body: '무리뉴~',
        sender: '삼영이',
      },
      {
        createdAt: '2022-07-13',
        body: '오바참치~',
        sender: '김영희',
      },
    ],
  },
  {
    text: 'hostImage',
    id: 3,
    image: dummy3,
    title: '평범한 목요일밤~',
    hostId: '최영철',
    joinersId: ['김영희', '마오쩌둥', '아오뚱뚱'],
    chat: [
      {
        createdAt: '2022-07-13',
        body: '아빠와 나',
        sender: '최영철',
      },
      {
        createdAt: '2022-07-13',
        body: '주몽의 후예',
        sender: '김영희',
      },
      {
        createdAt: '2022-07-13',
        body: '맥북은 내가 가진 전부다',
        sender: '마오쩌둥',
      },
      {
        createdAt: '2022-07-13',
        body: '아푸지망~고~',
        sender: '아오뚱뚱',
      },
    ],
  },
  {
    text: 'hostImage',
    id: 4,
    image: dummy4,
    title: '아프지망고 아푸지망고',
    hostId: '김영희',
    joinersId: ['사방팔방', '질색팔색', '김극혐'],
    chat: [
      {
        createdAt: '2022-07-13',
        body: '술좀 그만 마셔요',
        sender: '김영희',
      },
      {
        createdAt: '2022-07-13',
        body: '무리무리 무리뉴~',
        sender: '사방팔방',
      },
      {
        createdAt: '2022-07-13',
        body: '소주한잔 하실분?',
        sender: '질색팔색',
      },
      {
        createdAt: '2022-07-13',
        body: '임창정임?',
        sender: '김극혐',
      },
    ],
  },
];

export default dummyData;
