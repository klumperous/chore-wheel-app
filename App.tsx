import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';

const CHORES = [
  '🔥 Clean Oven',
  '🚪 Wipe Doors',
  '🪟 Clean Windows',
  '🧼 Clean Bathroom',
  '🗄️ Organise Drawer',
  '✨ Dust',
  '🧊 Clean Fridge',
];

const COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#FFA07A',
  '#98D8C8',
  '#F7DC6F',
  '#BB8FCE',
];

const SEGMENTS = CHORES.length;
const SEGMENT_ANGLE = 360 / SEGMENTS;

export default function App() {
  const [selectedChore, setSelectedChore] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;

  const spin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    spinValue.setValue(0);

    const randomRotation = Math.random() * 360 + 360 * 5;
    const selectedIndex = Math.floor((randomRotation % 360) / SEGMENT_ANGLE);

    Animated.timing(spinValue, {
      toValue: randomRotation,
      duration: 4000,
      useNativeDriver: true,
    }).start(() => {
      setSelectedChore(CHORES[selectedIndex]);
      setIsSpinning(false);
    });
  };

  const spin360 = spinValue.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const { width } = Dimensions.get('window');
  const wheelSize = Math.min(width - 40, 350);

  return (
    <View style={styles.container}>
      {/* Game Show Host Character */}
      <View style={styles.characterContainer}>
        <View style={styles.hostContainer}>
          {/* Top Hat */}
          <View style={styles.hatBrim} />
          <View style={styles.hat} />
          <View style={styles.hatTop} />
          {/* Head */}
          <View style={styles.head}>
            <Text style={styles.headEmoji}>😄</Text>
          </View>
          {/* Body */}
          <View style={styles.body}>
            <Text style={styles.jacket}>🎭</Text>
          </View>
        </View>
        <Text style={styles.characterText}>🎪 Spin to get your chore! 🎪</Text>
      </View>

      {/* Wheel */}
      <View style={[styles.wheelWrapper, { width: wheelSize, height: wheelSize }]}>
        <Animated.View
          style={[
            styles.wheel,
            {
              transform: [{ rotate: spin360 }],
              width: wheelSize,
              height: wheelSize,
            },
          ]}
        >
          {CHORES.map((chore, index) => {
            const rotation = index * SEGMENT_ANGLE;
            const isSelected = chore === selectedChore;

            return (
              <View
                key={index}
                style={[
                  styles.segment,
                  {
                    backgroundColor: COLORS[index],
                    transform: [{ rotate: `${rotation}deg` }],
                    borderWidth: isSelected ? 4 : 2,
                    borderColor: isSelected ? '#000' : 'rgba(0,0,0,0.3)',
                  },
                ]}
              >
                <Text style={styles.segmentText}>{chore}</Text>
              </View>
            );
          })}
        </Animated.View>

        {/* Center circle */}
        <View style={styles.centerPointer} />
        {/* Top pointer */}
        <View style={styles.topPointer} />
      </View>

      {/* Spin Button */}
      <TouchableOpacity
        style={[styles.spinButton, isSpinning && styles.spinButtonDisabled]}
        onPress={spin}
        disabled={isSpinning}
      >
        <Text style={styles.spinButtonText}>
          {isSpinning ? '🎡 Spinning...' : '🎡 SPIN IT! 🎡'}
        </Text>
      </TouchableOpacity>

      {/* Selected Chore Display */}
      {selectedChore && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>🎉 Your chore is: 🎉</Text>
          <Text style={styles.resultText}>{selectedChore}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
  },
  characterContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  hostContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  hatBrim: {
    width: 100,
    height: 8,
    backgroundColor: '#1a1a1a',
    borderRadius: 50,
    marginBottom: -2,
  },
  hat: {
    width: 70,
    height: 50,
    backgroundColor: '#1a1a1a',
    borderRadius: 50,
    marginBottom: -8,
    borderWidth: 2,
    borderColor: '#000',
  },
  hatTop: {
    width: 50,
    height: 15,
    backgroundColor: '#FFD700',
    borderRadius: 50,
    marginBottom: -5,
    borderWidth: 2,
    borderColor: '#000',
  },
  head: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFDBAC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#000',
    marginBottom: 10,
  },
  headEmoji: {
    fontSize: 50,
  },
  body: {
    width: 90,
    height: 60,
    backgroundColor: '#FF1493',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#000',
  },
  jacket: {
    fontSize: 40,
  },
  characterText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000',
    marginTop: 10,
    textShadowColor: '#fff',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 2,
  },
  wheelWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
  },
  wheel: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  segment: {
    position: 'absolute',
    width: '100%',
    height: '50%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
    transformOrigin: '50% 100%',
  },
  segmentText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    textShadowColor: 'rgba(255,255,255,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  centerPointer: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#333',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  topPointer: {
    position: 'absolute',
    top: -20,
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderBottomWidth: 30,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#333',
    zIndex: 11,
  },
  spinButton: {
    backgroundColor: '#FF1493',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 50,
    marginBottom: 30,
    borderWidth: 4,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  spinButtonDisabled: {
    opacity: 0.6,
  },
  spinButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  resultContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultLabel: {
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
    fontWeight: '700',
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF1493',
  },
});
