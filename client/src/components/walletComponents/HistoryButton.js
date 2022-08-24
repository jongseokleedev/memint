import React from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';

function HistoryButton({onPress, time, balanceChange, balance, content}) {
  return (
    <View style={[styles.button]}>
      <View style={styles.contentWrapper}>
        <View style={styles.contentRow}>
          <Text style={styles.contentText}>{content}</Text>
        </View>
        <Text style={styles.timeText}>{time}</Text>
      </View>
      <View style={styles.balanceWrapper}>
        <View style={styles.balanceChange}>
          <Text style={styles.balanceChangeText}>{balanceChange} </Text>
          <Text style={styles.lcnText}> LCN</Text>
        </View>
        <Text style={styles.balanceText}>잔액 {balance} LCN</Text>
      </View>
    </View>
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
  },
  contentText: {
    fontSize: 15,
    fontWeight: '600',
  },
  balanceChangeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  lcnText: {
    fontSize: 12,
  },
  balanceText: {
    fontSize: 12,
  },
  button: {
    flexDirection: 'row',
    // paddingHorizontal: 16,
    width: 330,
    height: 60,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EAFFEFCC',
    borderRadius: 10,
    margin: 3,
    paddingVertical: 10,
  },
  contentWrapper: {
    flexDirection: 'column',
    marginLeft: '4%',
    justifyContent: 'space-between',
    height: '100%',
  },
  balanceWrapper: {
    flexDirection: 'column',
    marginLeft: '25%',
    marginRight: '4%',
    justifyContent: 'space-between',
    height: '100%',
  },
  balanceChange: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
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
  linkImage: {
    width: 20,
    height: 10,
    marginRight: 5,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default HistoryButton;
