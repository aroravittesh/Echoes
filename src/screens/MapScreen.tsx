import React, { useEffect, useState } from 'react';
import { View, Text, PermissionsAndroid, Platform, ActivityIndicator, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { GOOGLE_API_KEY, OPENAI_API_KEY } from '@env';
import axios from 'axios';

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [nearestLandmark, setNearestLandmark] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [landmarkDescription, setLandmarkDescription] = useState(null);
  const [visited, setVisited] = useState(false);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
      if (!hasPermission) {
        const status = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        if (status !== PermissionsAndroid.RESULTS.GRANTED) {
          alert('Permission to access location was denied');
        }
      }
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        fetchNearbyLandmarks(latitude, longitude);
      },
      (error) => {
        console.error(error);
        setError("Error fetching location");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const fetchNearbyLandmarks = async (latitude, longitude) => {
    try {
      const API_KEY = 'AIzaSyBDuemyYR_wPxeeZX4Ierdu5kYkRTcA_EY';
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=18.9221686, 72.8340940&radius=5000&type=tourist_attraction&key=${GOOGLE_API_KEY}`
      );

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const filteredLandmarks = response.data.results.filter(landmark =>
          landmark.types.some(type =>
            ['historical_site', 'museum', 'fort', 'tomb', 'historical_landmark', 'tourist_attraction'].includes(type)
          )
        );

        if (filteredLandmarks.length > 0) {
          const nearest = getNearestLandmark(filteredLandmarks, latitude, longitude);
          setNearestLandmark(nearest);
          fetchDescriptionFromChatGPT(nearest.name);
        } else {
          setError('No relevant landmarks found');
          setLoading(false);
        }
      } else {
        setError('No landmarks found');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching landmarks:', error);
      setError('Error fetching landmarks');
      setLoading(false);
    }
  };

  const fetchDescriptionFromChatGPT = async (monumentName) => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: [
            {
              role: 'user',
              content: `You are a professional travel writer. Write a detailed, captivating, and informative article about the historical monument called "${monumentName}". Include at least 8 to 10 well-structured paragraphs covering the monument's:
- Historical background and origin
- Cultural significance
- Architectural features
- Interesting facts or legends
- Its role in the local community or country
- Best times to visit
- Tips for tourists
- Any restoration efforts or current status

Make it engaging and descriptive, suitable for a high-quality travel magazine. Write in a vivid and immersive tone to help tourists imagine the place.`,
            },
          ],
          temperature: 0.8,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );

      const gptDescription = response.data.choices[0].message.content;
      setLandmarkDescription(gptDescription);
    } catch (err) {
      console.error('Error fetching description from ChatGPT:', err);
      setError('Error fetching description from ChatGPT');
    } finally {
      setLoading(false);
    }
  };

  const getNearestLandmark = (landmarks, latitude, longitude) => {
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371;
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    let nearest = landmarks[0];
    let minDistance = calculateDistance(latitude, longitude, landmarks[0].geometry.location.lat, landmarks[0].geometry.location.lng);

    landmarks.forEach((landmark) => {
      const distance = calculateDistance(latitude, longitude, landmark.geometry.location.lat, landmark.geometry.location.lng);
      if (distance < minDistance) {
        nearest = landmark;
        minDistance = distance;
      }
    });

    return nearest;
  };

  useEffect(() => {
    requestLocationPermission();
    getCurrentLocation();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : nearestLandmark && landmarkDescription ? (
        <View style={styles.landmarkContainer}>
          <Text style={styles.landmarkName}>{nearestLandmark.name}</Text>

          {nearestLandmark.photos && nearestLandmark.photos[0] ? (
            <Image
              source={{
                uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${nearestLandmark.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`,
              }}
              style={styles.landmarkImage}
            />
          ) : (
            <Text style={styles.noPhotoText}>No photo available</Text>
          )}

          <Text style={styles.description}>{landmarkDescription}</Text>

          {/* ✅ Toggle Button */}
          <TouchableOpacity
  style={[
    styles.buttonContainer,
    visited ? styles.visitedButton : styles.unvisitedButton,
  ]}
  onPress={() => {
    if (!visited) setVisited(true);
  }}
  disabled={visited}
>
  <Text style={styles.buttonText}>
    {visited ? 'Visited ✅' : 'Mark as Visited'}
  </Text>
</TouchableOpacity>

        </View>
      ) : (
        <Text>No landmarks found nearby</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  landmarkContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  landmarkName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  landmarkImage: {
    width: 300,
    height: 200,
    marginTop: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  noPhotoText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginVertical: 10,
    textAlign: 'left',
  },
  buttonContainer: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
  },
  unvisitedButton: {
    backgroundColor: '#007AFF',
  },
  visitedButton: {
    backgroundColor: '#4CD964',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MapScreen;
