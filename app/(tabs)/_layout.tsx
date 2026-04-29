import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/haptic-tab';

function TabIcon({ emoji }: { emoji: string }) {
  const { ThemedText } = require('@/components/ThemedText');
  return <ThemedText style={{ fontSize: 22 }}>{emoji}</ThemedText>;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: '#12122A',
          borderTopColor: '#2A2A4A',
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
        },
        tabBarActiveTintColor: '#00D4FF',
        tabBarInactiveTintColor: '#555577',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'HQ',
          tabBarIcon: ({ color }) => (
            <TabIcon emoji="🛸" />
          ),
        }}
      />
      <Tabs.Screen
        name="sightings"
        options={{
          title: 'Map',
          tabBarIcon: () => <TabIcon emoji="🗺️" />,
        }}
      />
      <Tabs.Screen
        name="field-guide"
        options={{
          title: 'Field Guide',
          tabBarIcon: () => <TabIcon emoji="📖" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: () => <TabIcon emoji="👤" />,
        }}
      />
    </Tabs>
  );
}
