// Bottom tab navigator layout with theme colors
// Dev tab is only shown in development mode (__DEV__) for testing and debugging
import { Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { HapticTab } from '@/components/HapticTab';
import { useAppTheme } from '@/context/ThemeContext';

export default function TabLayout() {
  const { colors } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'HQ',
          tabBarIcon: ({ color }) => <MaterialIcons name="home" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="sightings"
        options={{
          title: 'Map',
          tabBarIcon: ({ color }) => <MaterialIcons name="map" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="field-guide"
        options={{
          title: 'Field Guide',
          tabBarIcon: ({ color }) => <MaterialIcons name="menu-book" size={26} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <MaterialIcons name="person" size={26} color={color} />,
        }}
      />
      {__DEV__ && (
        <Tabs.Screen
          name="dev"
          options={{
            title: 'Dev',
            tabBarIcon: ({ color }) => <MaterialIcons name="developer-mode" size={26} color={color} />,
          }}
        />
      )}
    </Tabs>
  );
}
