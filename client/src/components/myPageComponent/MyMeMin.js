import React, {useState} from 'react';
import {Image, StyleSheet, View, Text} from 'react-native';
import {useToast} from '../../utils/hooks/useToast';
import BasicButton from '../common/BasicButton';
import SingleModal from '../common/SingleModal';
import SpendingModal from '../common/UserInfoModal/SpendingModal';
import {mintNFT} from '../../lib/api/mintNFT';
import useUser from '../../utils/hooks/UseUser';

function MyMeMin({myMeMin}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [spendingModalVisible, setSpendingModalVisible] = useState(false);
  const {showToast} = useToast();
  const userInfo = useUser();
  // console.log(myMeMin);
  // console.log(userInfo);

  return (
    <>
      <View style={styles.container}>
        <Image
          style={styles.myMeMin}
          source={{
            uri: myMeMin
              ? myMeMin.nftImg
              : 'https://cdn-icons-png.flaticon.com/512/1053/1053244.png?w=360',
          }}
        />
        {myMeMin?.tokenId ? (
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
              backgroundColor="black"
              textColor="white"
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
                mintNFT({
                  address: userInfo.address,
                  NFTId: userInfo.nftIds[0],
                  imgUri: userInfo.nftProfile,
                }).then(result => {
                  // console.log(result.data);
                  result.data.message === 'success' &&
                    showToast('success', '민팅이 되었습니다');
                });
                setSpendingModalVisible(false);
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

const styles = StyleSheet.create({
  container: {
    zIndex: 2,
    position: 'absolute',
    bottom: 0,
    left: 180,
  },
  myMeMin: {
    width: 60,
    height: 60,
    borderRadius: 100,
    // top: 0,
    // left: 40,
    // position: 'relative',
  },
  badge: {
    width: 20,
    height: 20,
    marginRight: -20,
    top: 0,
    left: -60,
    position: 'absolute',
  },

  mintButton: {
    bottom: 0,
    right: -25,
    paddingBottom: 0,
    position: 'absolute',
  },

  rotate180: {
    transform: [{rotate: '180deg'}],
  },
});

export default MyMeMin;
