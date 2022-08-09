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
                <Text style={{fontWeight: 'bold'}}>현재 보유 LCN</Text>
                <Text style={{fontWeight: 'bold'}}>{user.tokenAmount}</Text>
              </View>
              <View style={styles.calcText}>
                <Text style={{fontWeight: 'bold'}}>필요 LCN</Text>
                <Text style={{fontWeight: 'bold'}}>{amount}개</Text>
              </View>
              {
                user.tokenAmount > amount ? (
                  <View style={styles.calcText}>
                    <Text style={{fontWeight: 'bold'}}>차감 후 LCN</Text>
                    <Text style={{fontWeight: 'bold'}}>
                      {user.tokenAmount - amount}개
                    </Text>
                  </View>
                ) : null
                // (
                //   <View style={styles.warnText}>
                //     <Text style={{fontWeight: 'bold'}}>LCN이 부족합니다!</Text>
                //   </View>
                // )
              }
            </View>
            {user.tokenAmount > amount ? (
              <View style={styles.buttonRow}>
                <BasicButton
                  text="아니오"
                  size="small"
                  variant="disable"
                  backgroundColor="white"
                  textColor="black"
                  margin={[20, 8, 5, 8]}
                  onPress={() => setSpendingModalVisible(false)}
                />
                <BasicButton
                  text="네"
                  size="small"
                  margin={[20, 8, 5, 8]}
                  onPress={() => {
                    pFunction();
                    transactionMade();
                  }}
                />
              </View>
            ) : (
              <BasicButton
                text="돌아가기"
                width={100}
                height={40}
                variant="disable"
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    width: 300,
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    position: 'absolute',
  },
  modalText: {
    fontWeight: 'bold',
    margin: 15,
    textAlign: 'center',
  },
  backgroudDim: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
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
