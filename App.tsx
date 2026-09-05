import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

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
    const segmentAngle = 360 / CHORES.length;
    const selectedIndex = Math.floor((randomRotation % 360) / segmentAngle);

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
  const radius = wheelSize / 2;

  // Generate pie slices as SVG paths
  const generateSlicePath = (index: number, total: number) => {
    const sliceAngle = 360 / total;
    const startAngle = (index * sliceAngle - 90) * (Math.PI / 180);
    const endAngle = ((index + 1) * sliceAngle - 90) * (Math.PI / 180);

    const x1 = radius + radius * Math.cos(startAngle);
    const y1 = radius + radius * Math.sin(startAngle);
    const x2 = radius + radius * Math.cos(endAngle);
    const y2 = radius + radius * Math.sin(endAngle);

    const largeArc = sliceAngle > 180 ? 1 : 0;
    const path = `M ${radius} ${radius} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    return path;
  };

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
          <Svg width={wheelSize} height={wheelSize} viewBox={`0 0 ${wheelSize} ${wheelSize}`}>
            {CHORES.map((chore, index) => {
              const sliceAngle = 360 / CHORES.length;
              const textAngle = (index * sliceAngle + sliceAngle / 2 - 90) * (Math.PI / 180);
              const textRadius = radius * 0.65;
              const textX = radius + textRadius * Math.cos(textAngle);
              const textY = radius + textRadius * Math.sin(textAngle);

              return (
                <G key={index}>
                  <Path
                    d={generateSlicePath(index, CHORES.length)}
                    fill={COLORS[index]}
                    stroke="rgba(0,0,0,0.3)"
                    strokeWidth="2"
                  />
                </G>
              );
            })}
            {/* Center circle */}
            <Circle cx={radius} cy={radius} r="20" fill="#fff" stroke="#333" strokeWidth="3" />
          </Svg>

          {/* Chore labels positioned around wheel */}
          {CHORES.map((chore, index) => {
            const sliceAngle = 360 / CHORES.length;
            const textAngle = (index * sliceAngle + sliceAngle / 2) * (Math.PI / 180);
            const textRadius = radius * 0.65;
            const textX = radius + textRadius * Math.cos(textAngle - Math.PI / 2);
            const textY = radius + textRadius * Math.sin(textAngle - Math.PI / 2);
            const rotation = (index * sliceAngle + sliceAngle / 2) - 90;

            return (
              <Animated.View
                key={`label-${index}`}
                style={[
                  styles.segmentLabel,
                  {
                    left: textX - 30,
                    top: textY - 15,
                    transform: [{ rotate: `${rotation}deg` }],
                  },
                ]}
              >
                <Text style={styles.segmentText}>{chore}</Text>
              </Animated.View>
            );
          })}
        </Animated.View>

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

const G = ({ children }: { children: React.ReactNode }) => <>{children}</>;

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
    overflow: 'visible',
  },
  segmentLabel: {
    position: 'absolute',
    width: 60,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
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
