import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import axios from 'axios';

import HomeScreen from './src/screens/HomeScreen';
import QuizScreen from './src/screens/QuizScreen';
import VisitedScreen from './src/screens/VisitedScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MapScreen from './src/screens/MapScreen'; // Added MapScreen

// Define User type
type User = {
  token: string;
  name: string;
};

// Define available screen names
type ScreenType = 'login' | 'register' | 'home' | 'quiz' | 'visited' | 'map'; // Added 'map'

const App = () => {
  const [screen, setScreen] = useState<ScreenType>('login');
  const [user, setUser] = useState<User | null>(null);
  const [visitedPlaces, setVisitedPlaces] = useState<string[]>([]);

  // Fetch visited places when user logs in
  useEffect(() => {
    if (user) fetchVisitedPlaces();
  }, [user]);

  // Function to fetch visited places
  const fetchVisitedPlaces = async () => {
    if (!user) return;

    try {
      const response = await axios.get('http://10.9.11.110:8082/api/visited', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setVisitedPlaces(response.data);
    } catch (error) {
      console.error('Error fetching visited places:', error);
    }
  };

  // Handle user login
  const handleLogin = (userData: User) => {
    setUser(userData);
    setScreen('home');
  };

  return (
    <View style={styles.container}>
      {screen === 'login' && <LoginScreen onLogin={handleLogin} goToRegister={() => setScreen('register')} />}
      {screen === 'register' && <RegisterScreen goToLogin={() => setScreen('login')} />}
      {screen === 'home' && <HomeScreen goToQuiz={() => setScreen('quiz')} goToVisited={() => setScreen('visited')} goToMap={() => setScreen('map')} />} {/* Added goToMap */}
      {screen === 'quiz' && <QuizScreen goBack={() => setScreen('home')} />}
      {screen === 'visited' && <VisitedScreen goBack={() => setScreen('home')} visitedPlaces={visitedPlaces} />}
      {screen === 'map' && <MapScreen goBack={() => setScreen('home')} />} {/* Added MapScreen */}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});