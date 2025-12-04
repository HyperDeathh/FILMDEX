import { View, Text, ImageBackground, Image, Dimensions } from 'react-native'
import React from 'react'
import { withLayoutContext } from 'expo-router'
import { createMaterialTopTabNavigator, MaterialTopTabNavigationOptions, MaterialTopTabNavigationEventMap } from '@react-navigation/material-top-tabs'
import { ParamListBase, TabNavigationState } from '@react-navigation/native'
import { images } from '@/assets/images'
import { icons } from '@/assets/icons'

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

// Tab bar boyutları
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const HORIZONTAL_MARGIN = 20;
const TAB_BAR_HEIGHT = 64;
const TAB_BAR_WIDTH = SCREEN_WIDTH - (HORIZONTAL_MARGIN * 2);
const TAB_WIDTH = TAB_BAR_WIDTH / 4;

function TabIcon({ focused, icon, title }: { focused: boolean; icon: any; title: string }) {
  if (focused) {
    return (
      <View style={{ width: TAB_WIDTH, height: TAB_BAR_HEIGHT, justifyContent: 'center', alignItems: 'center' }}>
        <ImageBackground
          source={images.highlight}
          style={{ 
            flexDirection: 'row',
            width: TAB_WIDTH - 8,
            height: TAB_BAR_HEIGHT - 16,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 50,
            overflow: 'hidden',
          }}
          resizeMode="cover"
        >
          <Image source={icon} tintColor="#151312" style={{ width: 20, height: 20 }} />
          <Text style={{ color: '#151312', fontSize: 14, fontWeight: '600', marginLeft: 6 }}>
            {title}
          </Text>
        </ImageBackground>
      </View>
    );
  }

  return (
    <View style={{ width: TAB_WIDTH, height: TAB_BAR_HEIGHT, justifyContent: 'center', alignItems: 'center' }}>
      <Image source={icon} tintColor="#A8B5DB" style={{ width: 20, height: 20 }} />
    </View>
  );
}

const _Layout = () => {
  return (
    <MaterialTopTabs
      tabBarPosition="bottom"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarIndicatorStyle: { height: 0 },
        tabBarStyle: {
          backgroundColor: '#0f0D23',
          borderRadius: 50,
          marginHorizontal: HORIZONTAL_MARGIN,
          marginBottom: 36,
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
          paddingBottom: 25,
          paddingRight: 14,
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
