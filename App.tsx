import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import HomeScreen from './src/screens/HomeScreen'
import QuizScreen from './src/screens/QuizScreen';
import VisitedScreen from './src/screens/VisitedScreen';

const App = () => {
  const [screen, setScreen] = useState<'home' | 'quiz' | 'visited'>('home');

  const renderScreen = () => {
    switch (screen) {
      case 'quiz':
        return <QuizScreen goBack={() => setScreen('home')} />;
      case 'visited':
        return <VisitedScreen goBack={() => setScreen('home')} />;
      default:
        return <HomeScreen goToQuiz={() => setScreen('quiz')} goToVisited={() => setScreen('visited')} />;
    }
  };

  return <View style={styles.container}>{renderScreen()}</View>;
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
