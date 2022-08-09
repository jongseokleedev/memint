import React from 'react';
import {View, Modal, StyleSheet, Text} from 'react-native';
import BasicButton from '../../common/BasicButton';
import {useNavigation} from '@react-navigation/native';

/*
사용할 컴포넌트에서 state 사용이 필요함.
  const [proposeModalVisible, setProposeModalVisible] = useState(false);

      <ProposeModal
        body={<Text>정말로?</Text>}
        nButtonText="아니요"
        pButtonText="네"
        proposeModalVisible={proposeModalVisible}
        setProposeModalVisible={setProposeModalVisible}
        pFunction={() => {}}
      />
 */

function ProposeModal({proposeModalVisible, setProposeModalVisible}) {
  const navigation = useNavigation();
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={proposeModalVisible}>
        <View style={[styles.centeredView, styles.backgroudDim]}>
          <View style={styles.modalView}>
            <Text style={{marginBottom: 10}}>
              김개똥님 외 3명과의 미팅은 즐거우셨나요?
            </Text>
            <Text style={{marginBottom: 10}}>
              지금 후기를 보내고 보상을 받으세요!
            </Text>
            <View style={styles.buttonRow}>
              <BasicButton
                text="안받을래요"
                size="small"
                variant="disable"
                onPress={() => setProposeModalVisible(false)}
              />
              <BasicButton
                text="후기보내기"
                size="small"
                onPress={() => {
                  setProposeModalVisible(false);
                  navigation.navigate('FeedbackChoicePage');
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
export default ProposeModal;
