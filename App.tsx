import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, View } from 'react-native';

import { activity } from './src/activity';

export default function App() {
  return (
    <View style={styles.container}>
      <Button title="Start Live Activity" onPress={() => activity.start({ title: 'Hello from expo-widgets' })} />
      <Button title="End all" onPress={() => activity.getInstances().forEach((instance) => instance.end('immediate'))} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 },
});
