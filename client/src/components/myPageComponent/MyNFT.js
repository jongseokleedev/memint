import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, View, Image, FlatList} from 'react-native';
import BasicButton from '../../components/common/BasicButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SingleModal from '../../components/common/SingleModal';
import SpendingModal from '../common/UserInfoModal/SpendingModal';
import {useToast} from '../../utils/hooks/useToast';
import {useNft} from '../../utils/hooks/UseNft';
import {useMemin} from '../../utils/hooks/UseNft';

function MyNFT({User}) {
  const [showNFT, setShowNFT] = useState(false);
  const nft = useNft();
  const myMemin = useMemin();

  const dummyNft = [
    {
      id: 1,
      nftImg:
        'https://lh3.googleusercontent.com/-jgMiZOhUs-3hdyDlg7_rPqFf8BhLEGWNlbg_RgqFKPPFnoCum_DfOUkGIPZIKonCbsM0ChJgwSVK36KAXTZAN6ZBPPSB0V_s0Kd=w600',

      isprofile: false,
    },
    {
      id: 2,
      nftImg:
        'https://lh3.googleusercontent.com/1lEK5t6aQvy_6YaVa0856-Dbtb8yhDYXU5q8ZWhSVGR2PNM397RTgBPsiSkG5nsZ0vM7LDand2dcIBzKOpNnyErv6c5AmXkbnR-B2A=w600',

      isprofile: false,
      tokenId: 1,
    },
    {
      id: 3,
      nftImg:
        'https://lh3.googleusercontent.com/o7U7XfamFNTSn3HrcUWRgtAwracl2ygU_12XarpHIYnfGnOla4zgrRqz0OvLL0-KyYqOJSyp-1YmcdndjjuyThYB_IdLFk5LBoilNus=w600',

      profile: true,
      tokenId: 2,
    },
    {
      id: 4,
      nftImg:
        'https://lh3.googleusercontent.com/aAw8TBIaLoC55VWQjamPt_9iPq_bbJksLuxTTX4WXmQrrJbMXcEBBKR83GtgU_DRTklmpE793TzeXWyCqsFcY-pg4gsHI-7Gah_ipA=w600',

      profile: false,
      tokenId: 3,
    },
  ];
  return (
    <>
      <View style={{flexDirection: 'row', marginTop: 20}}>
        <Text style={styles.attribute}>나의 미민이</Text>
      </View>
      <MyMeMin myMeMin={myMemin} />
      <View style={{...styles.container, justifyContent: 'space-between'}}>
        <Text style={styles.attribute}>나의 NFT</Text>
        <Icon
          name="arrow-drop-down"
          size={40}
          onPress={() => setShowNFT(!showNFT)}
          style={[styles.dropDown, showNFT ? styles.rotate180 : '']}
        />
      </View>

      {showNFT ? (
        <View style={styles.myNFTs}>
          {/* <FlatList
            data={User.myNfts}
            renderItem={({item}) => <MyNFTs item={item} />}
            numColumns="5"
          /> */}
          {nft
            ? nft.map((ele, index) => <MyNFTs item={ele} key={index} />)
            : dummyNft.map((ele, index) => <MyNFTs item={ele} key={index} />)}
        </View>
      ) : null}
    </>
  );
}

export function MyMeMin({myMeMin}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [spendingModalVisible, setSpendingModalVisible] = useState(false);
  const {showToast} = useToast();
  console.log(myMeMin);

  return (
    <>
      <View style={{height: 90}}>
        <Image
          style={styles.myMeMin}
          source={{
            uri: myMeMin
              ? myMeMin.nftImg
              : 'https://cdn-icons-png.flaticon.com/512/1053/1053244.png?w=360',
          }}
        />
        {myMeMin.tokenId ? (
          <View style={{marginLeft: 40}}>
            <Image
              source={require('../../assets/icons/nftBadge.png')}
              style={{...styles.badge, left: 0, top: -75}}
            />
          </View>
        ) : (
          <View style={styles.mintButton}>
            <BasicButton
              text="민팅하기"
              width={50}
              height={20}
              textSize={10}
              backgroundColor="#007aff"
              margin={[10, 3, 3, 3]}
              onPress={() => setModalVisible(true)}
            />
            <SingleModal
              text="프로필을 NFT로 민팅하시겠습니까?"
              buttonText="민팅하기"
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              pFunction={() => {
                setModalVisible(false);
                setSpendingModalVisible(true);
              }}
            />

            <SpendingModal
              body={<Text>정말로?</Text>}
              nButtonText="아니요"
              pButtonText="네"
              spendingModalVisible={spendingModalVisible}
              setSpendingModalVisible={setSpendingModalVisible}
              pFunction={() => {
                setSpendingModalVisible(false);
                showToast('success', '민팅이 되었습니다');
              }}
              amount={2}
              txType="NFT 민팅"
            />
          </View>
        )}
      </View>
    </>
  );
}

function MyNFTs({item}) {
  const [changeProfileModalVisible, setChangeProfileModalVisible] =
    useState(false);
  const {showToast} = useToast();
  return (
    <>
      {item.tokenId ? (
        <>
          <Image
            style={[styles.nft, item.isProfile ? styles.currentProfileNft : '']}
            source={{uri: item.nftImg}}
            onPress={() => setChangeProfileModalVisible(true)}
          />

          <Image
            source={require('../../assets/icons/nftBadge.png')}
            style={styles.badge}
          />
        </>
      ) : (
        ''
      )}
      {/* <SingleModal
        text="프로필로 설정하시겠습니까?"
        buttonText="네"
        modalVisible={changeProfileModalVisible}
        setModalVisible={setChangeProfileModalVisible}
        pFunction={() => {
          setChangeProfileModalVisible(false);
          showToast('success', '프로필 변경이 완료되었습니다.');
        }}
      /> */}
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  images: {
    flex: 0.4,
    marginHorizontal: 30,
    marginVertical: '0%',
  },

  myMeMin: {
    width: 60,
    height: 60,
    borderRadius: 100,
    top: 0,
    left: 40,
    marginVertical: '3%',
    position: 'relative',
  },
  badge: {
    width: 20,
    height: 20,
    marginRight: -20,
    top: 0,
    left: -60,
    position: 'relative',
  },
  nft: {
    width: 50,
    height: 50,
    borderRadius: 100,
    marginHorizontal: '1%',
    marginBottom: '3%',
  },
  currentProfileNft: {
    borderColor: '#007aff',
    borderWidth: 3,
  },
  attribute: {
    fontSize: 18,
    fontWeight: '500',
    marginHorizontal: 30,
    marginVertical: '2%',
  },

  mintButton: {
    top: -30,
    left: 60,
    paddingBottom: 0,
  },
  dropDown: {
    marginRight: 25,
  },
  rotate180: {
    transform: [{rotate: '180deg'}],
  },
  myNFTs: {
    flexDirection: 'row',
    marginLeft: 40,
  },
});

export default MyNFT;
