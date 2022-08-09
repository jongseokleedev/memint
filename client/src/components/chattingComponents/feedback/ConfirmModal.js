import React from 'react';
import {View, Modal, StyleSheet, Text} from 'react-native';
import BasicButton from '../../common/BasicButton';
import {useNavigation} from '@react-navigation/native';
import {useToast} from '../../../utils/hooks/useToast';

/*
사용할 컴포넌트에서 state 사용이 필요함.
  const [comfirmModalVisible, setConfirmModalVisible] = useState(false);

      <ConfirmModal
        confirmModalVisible={confirmModalVisible}
        setConfirmModalVisible={setProposeModalVisible}
        setFeedbackModalVisible={setFeedbackModalVisible}
      />
 */

function ConfirmModal({
  confirmModalVisible,
  setConfirmModalVisible,
  setEarnModalVisible,
}) {
  const {showToast} = useToast();
  const navigation = useNavigation();
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={confirmModalVisible}>
        <View style={[styles.centeredView, styles.backgroudDim]}>
          <View style={styles.modalView}>
            <Text style={{marginBottom: 10}}>
              후기를 보내면 수정이 불가능합니다.
            </Text>
            <Text style={{marginBottom: 10}}>보내시겠습니까?</Text>
            <View style={styles.buttonRow}>
              <BasicButton
                text="아니오"
                size="small"
                variant="disable"
                backgroundColor="white"
                textColor="black"
                onPress={() => {
                  setConfirmModalVisible(false);
                }}
              />
              <BasicButton
                text="네"
                size="small"
                onPress={() => {
                  setConfirmModalVisible(false);
                  setEarnModalVisible(true);
                }}
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
    width: 350,
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
export default ConfirmModal;
