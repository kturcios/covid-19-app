import React from 'react';
import {
  View,
  Button,
} from 'react-native';

export default function FilterButton({ navigation }) {
  return (
    <View style={{ paddingLeft: 10 }}>
      <Button
        onPress={() => navigation.navigate('Filters')}
        title="Filters"
        color="blue"
      />
    </View>
  );
}
