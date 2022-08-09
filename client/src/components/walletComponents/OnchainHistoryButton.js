import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';

function HistoryButton({onPress, time, balanceChange, txHash, content}) {
  const frontHash = txHash.substr(0, 10);
  const endHash = txHash.substr(60);
  //   const parsedTime = time.toDate
  return (
    <TouchableOpacity
      onPress={() => {
        Linking.openURL(`https://rinkeby.etherscan.io/tx/${txHash}`);
      }}>
      <View style={[styles.button]}>
        <View style={styles.contentWrapper}>
          <Text style={styles.timeText}>{time}</Text>
          <Text style={styles.contentText}>{content}</Text>
        </View>
        <View style={styles.balanceWrapper}>
          <Text style={styles.txHashText}>txHash</Text>
          <Text>
            {frontHash}...{endHash}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

HistoryButton.defaultProps = {
  width: 200,
  height: 40,
  borderColor: '#bdbddd',
  time: '2022.07.10 12:57:37',
  balanceChange: '+1',
  balance: 0,
  content: '후기 참여',
  onPress: () => {},
};

const styles = StyleSheet.create({
  timeText: {
    fontSize: 12,
    marginBottom: 3,
    justifyContent: 'flex-end',
  },
  txHashText: {
    marginLeft: '65%',
    fontSize: 12,
    color: 'grey',
    marginBottom: 3,
  },
  contentText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  button: {
    flexDirection: 'row',
    // paddingHorizontal: 16,
    width: 330,
    height: 60,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderColor: 'black',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    margin: 1,
  },
  contentWrapper: {
    flexDirection: 'column',
    marginLeft: '15%',
  },
  balanceWrapper: {
    flexDirection: 'column',
    marginLeft: '35%',
    marginRight: '15%',
  },
  text: {
    marginHorizontal: 20,
    fontSize: 20,
    color: 'black',
    // textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: 'yellow',
  },
  textAmount: {
    justifyContent: 'flex-end',
    marginLeft: '45%',
    fontSize: 20,
    color: 'black',
    // textAlign: 'center',
    fontWeight: 'bold',
    backgroundColor: 'yellow',
  },
});

export default HistoryButton;
