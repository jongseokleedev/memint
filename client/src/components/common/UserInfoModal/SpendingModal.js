import React, {useEffect, useState} from 'react';
import {View, Modal, StyleSheet, Text, Alert} from 'react-native';
import BasicButton from '../BasicButton';
import useUser from '../../../utils/hooks/UseUser';
import useAuthActions from '../../../utils/hooks/UseAuthActions';
import {createSpendOffTxLg} from '../../../lib/OffchianTokenLog';
import {getUser} from '../../../lib/Users';
/*
사용할 컴포넌트에서 state 사용이 필요함.
  const [spendModalVisible, setSpendModalVisible] = useState(false);

      <SpendingModal
        spendingModalVisible={spendingModalVisible}
        setSpendingModalVisible={setSpendingModalVisible}
        pFunction={}
        amount={1}
        txType='프로필조회'
      />
 */

function SpendingModal({
  spendingModalVisible,
  setSpendingModalVisible,
  pFunction,
  amount,
  txType,
}) {
  const [dbTokenBalance, setdbTokenBalance] = useState('');
  const user = useUser();
  const {decreaseBy} = useAuthActions();

  // DB에 있는 토큰양과 sync가 맞는지 확인
  useEffect(() => {
    getBalance(user.id);
  });
  const getBalance = async userId => {
    try {
      const userForToken = await getUser(userId);
      setdbTokenBalance(userForToken.tokenAmount);
    } catch (e) {
      console.log(e);
    }
  };

  const transactionMade = () => {
    // DB에 있는 토큰양과 sync가 맞는지 확인
    // if (dbTokenBalance !== user.tokenAmount) {
    //   return Alert.alert('잔액 오류');
    // }

    //사용자의 TokenAmount 양 바꿈 (redux 정보 바꿈)
    decreaseBy(amount);
    //TokenLog 생성 & Token 변화 firebase에 저장
    createSpendOffTxLg(user.id, amount, txType, user.tokenAmount);
    // pFunction;
    setSpendingModalVisible(false);
  };
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={spendingModalVisible}>
        <View style={[styles.centeredView, styles.backgroudDim]}>
          <View style={styles.modalView}>
            <View
              style={{
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <View style={styles.calcText}>
                <Text style={{fontWeight: '500', fontSize: 17}}>
                  현재 보유 LCN
                </Text>
                <Text style={{fontWeight: '500', fontSize: 17}}>
                  {user.tokenAmount}
                </Text>
              </View>
              <View style={styles.calcText}>
                <Text style={{fontWeight: '500', fontSize: 17}}>필요 LCN</Text>
                <Text style={{fontWeight: '500', fontSize: 17}}>
                  {amount}개
                </Text>
              </View>
              {
                user.tokenAmount > amount ? (
                  <View style={styles.calcText}>
                    <Text style={{fontWeight: '500', fontSize: 17}}>
                      차감 후 LCN
                    </Text>
                    <Text style={{fontWeight: '500', fontSize: 17}}>
                      {user.tokenAmount - amount}개
                    </Text>
                  </View>
                ) : null
                // (
                //   <View style={styles.warnText}>
                //     <Text style={{fontWeight: '500', fontSize:17}}>LCN이 부족합니다!</Text>
                //   </View>
                // )
              }
            </View>
            {user.tokenAmount > amount ? (
              <View style={styles.buttonRow}>
                <BasicButton
                  text="아니오"
                  textSize={16}
                  width={100}
                  height={45}
                  backgroundColor="white"
                  textColor="black"
                  border={true}
                  margin={[12, 5, 0, 5]}
                  onPress={() => setSpendingModalVisible(false)}
                />
                <BasicButton
                  text="네"
                  textSize={16}
                  width={100}
                  height={45}
                  margin={[12, 5, 0, 5]}
                  backgroundColor="#AEFFC1"
                  textColor="black"
                  onPress={() => {
                    pFunction();
                    transactionMade();
                  }}
                />
              </View>
            ) : (
              <BasicButton
                text="돌아가기"
                textSize={16}
                width={100}
                height={45}
                backgroundColor="#AEFFC1"
                textColor="black"
                border={true}
                margin={[12, 5, 0, 5]}
                onPress={() => setSpendingModalVisible(false)}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  modalView: {
    width: 290,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 25,
    alignItems: 'center',
    borderColor: '#AEFFC1',
    borderWidth: 1,
  },
  modalText: {
    fontWeight: '500',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 17,
  },
  backgroudDim: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  buttonRow: {
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  calcText: {
    flexDirection: 'row',
    marginBottom: 7,
    width: '100%',
    justifyContent: 'space-between',
  },
  warnText: {
    flexDirection: 'row',
    textAlign: 'center',
  },
});
export default SpendingModal;
