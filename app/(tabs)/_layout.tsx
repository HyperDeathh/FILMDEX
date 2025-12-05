import { View, Text, Image, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import { withLayoutContext } from 'expo-router'
import { createMaterialTopTabNavigator, MaterialTopTabNavigationOptions, MaterialTopTabNavigationEventMap } from '@react-navigation/material-top-tabs'
import { ParamListBase, TabNavigationState } from '@react-navigation/native'
import { icons } from '@/assets/icons'

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

// Ekran boyutlarını al - sabit değerler
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Tab bar boyutları - sabit piksel değerleri
const HORIZONTAL_MARGIN = 20;
const TAB_BAR_HEIGHT = 60;
const TAB_BAR_WIDTH = SCREEN_WIDTH - (HORIZONTAL_MARGIN * 2);
const TAB_WIDTH = TAB_BAR_WIDTH / 4;
const BORDER_RADIUS = 30;

// Highlight boyutları - tab içinde ortalanmış pill
const HIGHLIGHT_WIDTH = TAB_WIDTH * 0.85;
const HIGHLIGHT_HEIGHT = TAB_BAR_HEIGHT * 0.7;

function TabIcon({ focused, icon, title }: { focused: boolean; icon: any; title: string }) {
  if (focused) {
    return (
      <View style={styles.tabContainer}>
        <View style={styles.highlight}>
          <Image source={icon} tintColor="#151312" style={styles.iconFocused} />
          <Text style={styles.textFocused}>{title}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.tabContainer}>
      <Image source={icon} tintColor="#A8B5DB" style={styles.icon} />
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    width: TAB_WIDTH,
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
  iconFocused: {
    width: 18,
    height: 18,
  },
  icon: {
    width: 20,
    height: 20,
  },
  textFocused: {
    color: '#151312',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
});

const _Layout = () => {
  return (
    <MaterialTopTabs
      tabBarPosition="bottom"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarIndicatorStyle: { height: 0 },
        tabBarStyle: {
          backgroundColor: '#0f0D23',
          borderRadius: BORDER_RADIUS,
          marginHorizontal: HORIZONTAL_MARGIN,
          marginBottom: 30,
          height: TAB_BAR_HEIGHT,
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: '#221f3d',
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarContentContainerStyle: {
          height: TAB_BAR_HEIGHT,
          alignItems: 'center',
        },
        tabBarItemStyle: {
          width: TAB_WIDTH,
          height: TAB_BAR_HEIGHT,
          padding: 0,
          margin: 0,
        },
        swipeEnabled: true,
        animationEnabled: true,
      }}
    >
      <MaterialTopTabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.home} title="Home" />
          )
        }}
      />
      <MaterialTopTabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.search} title="Search" />
          )
        }}
      />
      <MaterialTopTabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.save} title="Saved" />
          )
        }}
      />
      <MaterialTopTabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.person} title="Profile" />
          )
        }}
      />
    </MaterialTopTabs>
  )
}

export default _Layout
