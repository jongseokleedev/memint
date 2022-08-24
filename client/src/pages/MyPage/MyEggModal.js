import React from 'react';
import {
  View,
  Modal,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import myEgg from '../../assets/icons/myEgg.png';
import myEgg2 from '../../assets/icons/myEgg2.png';
import myEgg3 from '../../assets/icons/myEgg3.png';

/*
  사용할 컴포넌트에서 state 사용이 필요함.
  Ex)
  const [modalVisible, setModalVisible] = useState(false);

  <My
    text="미팅을 생성하시겠습니까?"
    //body={<Text>정말로?</Text>}
    buttonText="네"
    modalVisible={modalVisible}
    setModalVisible={setModalVisible}
    pFunction={}
  />

  필요시,pFunction 함수를 넣어줄 때 Modal이 닫히도록 해주어야함.
 */

function MyEggModal({modalVisible, setModalVisible}) {
  const dummyEgg = [
    {name: '#SJ5787', image: myEgg},
    {name: '#HJ2035', image: myEgg2},
    {name: '#SJ1908', image: myEgg},
    {name: '#EM0616', image: myEgg3},
    {name: '#EM9419', image: myEgg3},
  ];
  return (
    <View style={styles.centeredView}>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <TouchableWithoutFeedback
          onPress={() => {
            setModalVisible(false);
          }}>
          <View style={[styles.centeredView, styles.backgroudDim]}>
            <View style={styles.modalView}>
              <View style={styles.header}>
                <Text style={styles.title}>EGG</Text>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}>
                  <Icon name="close" size={16} color={'#1D1E1E'} />
                </TouchableOpacity>
              </View>
              <View style={styles.eggs}>
                {dummyEgg.map((el, idx) => {
                  return (
                    <View style={styles.eggBox} key={idx}>
                      <Image source={el.image} style={styles.myEgg} />
                      <Text style={styles.eggName}>{el.name}</Text>
                    </View>
                  );
                })}
                {[...Array(16 - dummyEgg.length)].map((el, idx) => {
                  return <View style={styles.emptyBox} key={idx} />;
                })}
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  centeredView: {
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
    width: '94%',
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 36,
    alignItems: 'center',
    borderColor: '#AEFFC1',
    borderWidth: 1,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 5,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  title: {
    fontSize: 17,
    fontFamily: 'NeoDunggeunmoPro-Regular',
    letterSpacing: 2,
    color: '#1D1E1E',
  },
  eggs: {
    width: '100%',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  emptyBox: {
    backgroundColor: '#EDEEF6',
    borderRadius: 5,
    width: 65,
    height: 65,
    marginVertical: 3,
  },
  eggBox: {
    backgroundColor: '#EDEEF6',
    borderRadius: 5,
    width: 64,
    height: 64,
    marginVertical: 2.5,
    borderWidth: 1,
    borderColor: '#AEFFC1',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 5.5,
  },
  myEgg: {
    width: 28,
    height: 36,
  },
  eggName: {
    fontSize: 10.5,
    fontWeight: '500',
    letterSpacing: -0.5,
    marginTop: 3,
  },
});
export default MyEggModal;
