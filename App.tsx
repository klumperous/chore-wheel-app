import React, { useState, useRef, useEffect } from 'react';
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

const SEGMENTS = CHORES.length;
const SEGMENT_ANGLE = 360 / SEGMENTS;

export default function App() {
  const [selectedChore, setSelectedChore] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const spin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    spinValue.setValue(0);

    const randomRotation = Math.random() * 360 + 360 * 5;
    // Pointer is at top (270 degrees in canvas coords), so calculate which slice it lands on
    const normalizedRotation = randomRotation % 360;
    const pointerAngle = 270; // Top of wheel
    const landingAngle = (pointerAngle - normalizedRotation + 360) % 360;
    const selectedIndex = Math.floor(landingAngle / SEGMENT_ANGLE) % SEGMENTS;

    Animated.timing(spinValue, {
      toValue: randomRotation,
      duration: 4000,
      useNativeDriver: false,
    }).start(() => {
      setSelectedChore(CHORES[selectedIndex]);
      setIsSpinning(false);
    });
  };

  const { width } = Dimensions.get('window');
  const wheelSize = Math.min(width - 40, 350);
  const radius = wheelSize / 2;

  useEffect(() => {
    const listener = spinValue.addListener(({ value }) => {
      if (canvasRef.current) {
        drawWheel(value);
      }
    });

    return () => spinValue.removeListener(listener);
  }, []);

  const drawWheel = (rotation: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = radius;
    const centerY = radius;

    // Clear canvas
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, wheelSize, wheelSize);

    // Save state and apply rotation
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-centerX, -centerY);

    // Draw each pie wedge
    CHORES.forEach((chore, index) => {
      const startAngle = (index * SEGMENT_ANGLE * Math.PI) / 180;
      const endAngle = ((index + 1) * SEGMENT_ANGLE * Math.PI) / 180;

      // Draw wedge
      ctx.fillStyle = COLORS[index];
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius - 2, startAngle, endAngle);
      ctx.lineTo(centerX, centerY);
      ctx.fill();

      // Draw border
      ctx.strokeStyle = 'rgba(0,0,0,0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius - 2, startAngle, endAngle);
      ctx.lineTo(centerX, centerY);
      ctx.stroke();

      // Draw text along the wedge
      const textAngle = startAngle + (endAngle - startAngle) / 2;
      const textRadius = radius * 0.65;
      const textX = centerX + textRadius * Math.cos(textAngle);
      const textY = centerY + textRadius * Math.sin(textAngle);

      ctx.save();
      ctx.translate(textX, textY);
      ctx.rotate(textAngle + Math.PI / 2);
      ctx.fillStyle = '#000';
      ctx.font = 'bold 11px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(255,255,255,0.8)';
      ctx.shadowBlur = 3;
      ctx.fillText(chore, 0, 0);
      ctx.restore();
    });

    // Draw center circle
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.restore();
  };

  useEffect(() => {
    drawWheel(0);
  }, [wheelSize]);

  return (
    <View style={styles.mainContainer}>
      {/* Game Show Host Image - Left Side */}
      <View style={styles.hostImageContainer}>
        <Image
          source={require('./host.png')}
          style={styles.hostImage}
          resizeMode="contain"
        />
      </View>

      {/* Main Content - Center */}
      <View style={styles.container}>
        {/* Title */}
        <Text style={styles.title}>🎪 CHORE WHEEL 🎪</Text>

        {/* Wheel Container */}
        <View style={[styles.wheelWrapper, { width: wheelSize, height: wheelSize }]}>
          <canvas
            ref={canvasRef}
            width={wheelSize}
            height={wheelSize}
            style={styles.canvas}
          />
          {/* Top pointer - pointing DOWN at 12 o'clock position */}
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

      {/* Empty right side for balance */}
      <View style={styles.hostImageContainer} />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
  },
  hostImageContainer: {
    width: 120,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hostImage: {
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#000',
    marginBottom: 20,
    textShadowColor: '#fff',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  wheelWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    position: 'relative',
    borderRadius: 999,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  canvas: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
  },
  topPointer: {
    position: 'absolute',
    top: -20,
    left: '50%',
    marginLeft: -15,
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 15,
    borderTopWidth: 30,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#333',
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
