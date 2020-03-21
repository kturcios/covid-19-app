import React, { useEffect, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from '@expo/vector-icons';
import {
  PublisherBanner,
} from 'expo-ads-admob';

import FilterButton from './components/FilterButton';
import { iosAdUnitId, androidAdUnitId } from './admob-config';

// import registerForPushNotificationsAsync from './push-notifications';
// import states from './states';
import countries from './countries';

const apiBaseUrl = 'https://corona.lmao.ninja';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'lightgray',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'gray',
  },
  stats: {
    fontSize: 50,
    color: 'darkred',
    fontWeight: 'bold',
  },
  globalButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: '50%',
    borderRadius: 10,
    backgroundColor: 'cornflowerblue',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    backgroundColor: 'cornflowerblue',
    fontSize: 16,
    height: 50,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    color: 'black',
    paddingRight: 50, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

function HomeScreen({ children }) {
  return (
    <View style={styles.container}>
      {children}
    </View>
  );
}

function FilterScreen({ children }) {
  return (
    <View style={styles.container}>
      {children}
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  const [appEvent, setAppEvent] = useState(null);
  const [bannerError, setBannerError] = useState(null);
  const [title, setTitle] = useState('Global');
  const [filter, setFilter] = useState({
    by: 'Global',
    country: 'USA',
    state: '',
  });
  // const [filterBy, setFilterBy] = useState('Global');
  const [stats, setStats] = useState({
    cases: 'Loading...',
    deaths: 'Loading...',
    recovered: 'Loading...',
  });
  const [selectedCountry, setSelectedCountry] = useState('');

  const updateTitle = () => {
    if (filter.by === 'Global') {
      setTitle('Global');
    } else if (filter.by === 'Country') {
      setTitle(filter.country);
      if (filter.state !== '') {
        // TODO: set the title to the state name
      }
    }
  };

  useEffect(() => {
    console.log('App event');
    console.log(appEvent);
    console.log('Banner error');
    console.log(bannerError);
  }, [appEvent]);

  const updateStats = async () => {
    try {
      if (filter.by === 'Global') {
        const response = await fetch(`${apiBaseUrl}/all`);
        const responseJson = await response.json();
        setStats(responseJson);
      } else if (filter.by === 'Country') {
        const response = await fetch(`${apiBaseUrl}/countries/${filter.country}`);
        const responseJson = await response.json();
        setStats(responseJson);
        if (filter.state !== '') {
          // TODO: set stats to the state info
        }
      }
    } catch (err) {
      console.log(err);
      setStats({
        cases: 'Unavailable',
        deaths: 'Unavailable',
        recovered: 'Unavailable',
      });
    }
  };

  useEffect(() => {
    // registerForPushNotificationsAsync();
    updateTitle();
    updateStats();
  }, [filter]);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          options={({ navigation }) => ({
            headerTitle: title,
            headerLeft: () => <FilterButton navigation={navigation} />,
          })}
        >
          {() => (
            <HomeScreen>
              <View style={styles.section}>
                <Text style={styles.title}># of Cases</Text>
                <Text style={styles.stats}>{typeof stats.cases === 'string' ? stats.cases : stats.cases.toLocaleString()}</Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.title}># of Deaths</Text>
                <Text style={styles.stats}>{typeof stats.deaths === 'string' ? stats.death : stats.deaths.toLocaleString()}</Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.title}># of Recoveries</Text>
                <Text style={styles.stats}>{typeof stats.recovered === 'string' ? stats.recovered : stats.recovered.toLocaleString()}</Text>
              </View>
              <PublisherBanner
                adUnitID={Platform.OS === 'ios' ? iosAdUnitId : androidAdUnitId}
                servePersonalizedAds
                onDidFailToReceiveAdWithError={(err) => setBannerError(err)}
                onAdMobDispatchAppEvent={(e) => setAppEvent(e)}
              />
            </HomeScreen>
          )}
        </Stack.Screen>
        <Stack.Screen name="Filters">
          {({ navigation }) => (
            <FilterScreen>
              <TouchableOpacity
                style={styles.globalButton}
                onPress={() => {
                  setFilter({
                    ...filter,
                    by: 'Global',
                  });
                  navigation.navigate('Home');
                }}
              >
                <Text style={{ color: 'white', fontSize: 18 }}>Global</Text>
              </TouchableOpacity>
              <Text style={{ fontWeight: 'bold', fontSize: 24 }}>{'\nOR\n'}</Text>
              <View style={{ width: '80%' }}>
                <RNPickerSelect
                  placeholder={{
                    label: 'Select a country...',
                  }}
                  textInputProps={{
                    color: 'white',
                  }}
                  style={pickerSelectStyles}
                  useNativeAndroidPickerStyle={false}
                  onValueChange={(value) => {
                    if (Platform.OS !== 'ios') {
                      setFilter({
                        by: 'Country',
                        country: value,
                        state: '',
                      });
                      navigation.navigate('Home');
                    } else {
                      // iOS: hold the selected country and update
                      // state once the picker is closed
                      setSelectedCountry(value);
                    }
                  }}
                  onClose={() => {
                    if (selectedCountry !== '' || selectedCountry !== null) {
                      setFilter({
                        by: 'Country',
                        country: selectedCountry,
                        state: '',
                      });
                      navigation.navigate('Home');
                    }
                  }}
                  items={countries}
                  Icon={() => (
                    <Ionicons
                      style={{
                        paddingVertical: 12,
                        paddingHorizontal: 12,
                      }}
                      name="md-arrow-dropdown"
                      size={24}
                      color="white"
                    />
                  )}
                />
              </View>
            </FilterScreen>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
