import React from 'react';
import {View, Modal, StyleSheet} from 'react-native';
import BasicButton from '../common/BasicButton';
import {changeJoinerState} from '../../lib/Chatting';
import {useToast} from '../../utils/hooks/useToast';
import useUser from '../../utils/hooks/UseAuth';

/*
사용할 컴포넌트에서 state 사용이 필요함.
  const [modalVisible, setModalVisible] = useState(false);

      <MyDoubleModal
        body={<Text>정말로?</Text>}
        nButtonText="아니요"
        pButtonText="네"
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        pFunction={() => {}}
      />
 */

function MyDoubleModal({
  body,
  pButtonText,
  nButtonText,
  modalVisible,
  setModalVisible,
  setSpendingModalVisible,
  isHost,
  id,
}) {
  const user = useUser();
  const {showToast} = useToast();
  return (
    <View style={styles.centeredView}>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={[styles.centeredView, styles.backgroudDim]}>
          <View style={styles.modalView}>
            {body}
            <View style={styles.buttonRow}>
              <BasicButton
                text={nButtonText}
                size="small"
                variant="disable"
                onPress={() => setModalVisible(!modalVisible)}
              />
              <BasicButton
                text={pButtonText}
                size="small"
                onPress={
                  isHost
                    ? () => {
                        setModalVisible(false);
                        setSpendingModalVisible(true);
                      }
                    : () => {
                        changeJoinerState(id, user, setModalVisible).then(
                          result => {
                            result === 'runModal' &&
                              showToast('basic', '미팅 참가가 확정되었습니다!');
                          },
                        );
                      }
                }
              />
            </View>
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
});
export default MyDoubleModal;
