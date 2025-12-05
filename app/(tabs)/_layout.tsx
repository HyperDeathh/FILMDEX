import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import React from 'react';
import { withLayoutContext } from 'expo-router';
import { createMaterialTopTabNavigator, MaterialTopTabNavigationOptions, MaterialTopTabNavigationEventMap } from '@react-navigation/material-top-tabs';
import { ParamListBase, TabNavigationState } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

// Ekran boyutlarını al
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Tab bar boyutları
const HORIZONTAL_MARGIN = 20;
const TAB_BAR_HEIGHT = Math.min(SCREEN_HEIGHT * 0.085, 60);
const TAB_BAR_WIDTH = SCREEN_WIDTH - (HORIZONTAL_MARGIN * 2);
const TAB_COUNT = 4;
const TAB_WIDTH = TAB_BAR_WIDTH / TAB_COUNT;
const BORDER_RADIUS = 30;

// Icon boyutları
const ICON_SIZE = Math.min(SCREEN_WIDTH * 0.06, 24);
const ICON_SIZE_FOCUSED = Math.min(SCREEN_WIDTH * 0.05, 20);

// Highlight boyutları
const HIGHLIGHT_WIDTH = TAB_WIDTH * 0.88;
const HIGHLIGHT_HEIGHT = TAB_BAR_HEIGHT * 0.72;

// Tab config with Ionicons names
const TAB_CONFIG: { [key: string]: { icon: keyof typeof Ionicons.glyphMap; iconFocused: keyof typeof Ionicons.glyphMap; title: string } } = {
  index: { icon: 'home-outline', iconFocused: 'home', title: 'Home' },
  search: { icon: 'search-outline', iconFocused: 'search', title: 'Search' },
  saved: { icon: 'bookmark-outline', iconFocused: 'bookmark', title: 'Saved' },
  profile: { icon: 'person-outline', iconFocused: 'person', title: 'Profile' },
};

function TabIcon({ focused, iconName, iconFocusedName, title }: { focused: boolean; iconName: keyof typeof Ionicons.glyphMap; iconFocusedName: keyof typeof Ionicons.glyphMap; title: string }) {
  if (focused) {
    return (
      <View style={styles.highlight}>
        <Ionicons name={iconFocusedName} size={ICON_SIZE_FOCUSED} color="#151312" />
        <Text style={styles.textFocused}>{title}</Text>
      </View>
    );
  }

  return (
    <Ionicons name={iconName} size={ICON_SIZE} color="#A8B5DB" />
  );
}

function CustomTabBar({ state, navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.tabBarWrapper,
        {
          height: TAB_BAR_HEIGHT + insets.bottom + 10,
          paddingBottom: insets.bottom + 10,
        },
      ]}
    >
      <View style={styles.tabBar}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const config = TAB_CONFIG[route.name] || { icon: 'home-outline', iconFocused: 'home', title: route.name };

          return (
            <Pressable
              key={route.key}
              onPress={() => navigation.navigate(route.name)}
              style={styles.tabItem}
            >
              <TabIcon 
                focused={isFocused} 
                iconName={config.icon} 
                iconFocusedName={config.iconFocused} 
                title={config.title} 
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    left: HORIZONTAL_MARGIN,
    right: HORIZONTAL_MARGIN,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#0f0D23',
    borderRadius: BORDER_RADIUS,
    height: TAB_BAR_HEIGHT,
    width: '100%',
    borderWidth: 1,
    borderColor: '#221f3d',
  },
  tabItem: {
    flex: 1,
    height: TAB_BAR_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlight: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ab8bff',
    width: HIGHLIGHT_WIDTH,
    height: HIGHLIGHT_HEIGHT,
    borderRadius: HIGHLIGHT_HEIGHT / 2,
  },
  textFocused: {
    color: '#151312',
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 5,
  },
});

const _Layout = () => {
  return (
    <MaterialTopTabs
      tabBarPosition="bottom"
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        swipeEnabled: true,
        animationEnabled: true,
        lazy: true,
        lazyPreloadDistance: 1,
      }}
    >
      <MaterialTopTabs.Screen name="index" />
      <MaterialTopTabs.Screen name="search" />
      <MaterialTopTabs.Screen name="saved" />
      <MaterialTopTabs.Screen name="profile" />
    </MaterialTopTabs>
  );
};

export default _Layout;
