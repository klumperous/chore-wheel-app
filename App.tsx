import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
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

export default function App() {
  const [selectedChore, setSelectedChore] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;

  const spin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    spinValue.setValue(0);

    // Random number of full rotations plus random final position
    const randomRotation = Math.random() * 360 + 360 * 5;
    const selectedIndex = Math.floor((randomRotation % 360) / (360 / CHORES.length));

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
      {/* Character */}
      <View style={styles.characterContainer}>
        <Text style={styles.characterEmoji}>🎩</Text>
        <Text style={styles.characterText}>Spin to get your chore!</Text>
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
            const angle = (index / CHORES.length) * 360;
            const isSelected = chore === selectedChore;

            return (
              <View
                key={index}
                style={[
                  styles.segment,
                  {
                    backgroundColor: COLORS[index],
                    transform: [{ rotate: `${angle}deg` }],
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

        {/* Center pointer */}
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
          {isSpinning ? 'Spinning...' : 'SPIN!'}
        </Text>
      </TouchableOpacity>

      {/* Selected Chore Display */}
      {selectedChore && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>Your chore is:</Text>
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
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
  },
  characterContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  characterEmoji: {
    fontSize: 80,
    marginBottom: 10,
  },
  characterText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  wheelWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  wheel: {
    borderRadius: 999,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
    paddingBottom: 30,
    transformOrigin: '50% 100%',
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.3)',
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
    top: -15,
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
    backgroundColor: '#FF6B6B',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 50,
    marginBottom: 30,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resultLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
});
