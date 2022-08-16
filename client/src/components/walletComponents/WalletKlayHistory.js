import React from 'react';
import {Text, View, StyleSheet, ScrollView} from 'react-native';
import {useOnKlaytxlog} from '../../utils/hooks/UseOnchain';
import OnchainHistory from './OnchainHistoryButton';
function WalletKlayHistory({navigation}) {
  const onKlayTxLogs = useOnKlaytxlog();

  return (
    <View style={styles.view}>
      <Text style={styles.historyText}>KLAY Transaction History</Text>
      <ScrollView>
        {onKlayTxLogs ? (
          onKlayTxLogs.map((log, idx) => {
            const parsedTime = log.createdAt.toDate().toLocaleString();
            return (
              <OnchainHistory
                key={idx}
                txHash={log.txHash}
                content={log.txType}
                time={parsedTime}
              />
            );
          })
        ) : (
          <Text
            style={{
              color: 'lightgray',
              marginTop: 100,
            }}>
            전송 내역이 없습니다.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    alignItems: 'center',
    height: 300,
    // backgroundColor: 'red',
  },
  container: {
    flex: 1,
    marginTop: 60,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  accountText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  historyText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    // marginTop: 20,
    marginBottom: 20,
  },
});

export default WalletKlayHistory;
