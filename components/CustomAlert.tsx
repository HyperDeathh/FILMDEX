import React from 'react';
import { Modal, View, Text, TouchableOpacity, Image } from 'react-native';
import { icons } from '@/assets/icons';

interface AlertAction {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
}

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  actions?: AlertAction[];
  onClose: () => void;
}

const CustomAlert = ({
  visible,
  title,
  message,
  actions = [{ text: 'OK', style: 'default' }],
  onClose,
}: CustomAlertProps) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/80 justify-center items-center px-6">
        <View className="bg-dark-200 w-full max-w-sm rounded-3xl p-6 border border-white/10">
          {/* Icon (Optional, can be based on title or generic) */}
          <View className="items-center mb-4">
             {/* You could add an icon here if desired, e.g., info or warning */}
          </View>

          <Text className="text-xl font-bold text-white text-center mb-2">
            {title}
          </Text>
          <Text className="text-white/60 text-center mb-6 text-base">
            {message}
          </Text>

          <View className="flex-col gap-3">
            {actions.map((action, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  if (action.onPress) action.onPress();
                  onClose();
                }}
                className={`w-full py-3.5 rounded-xl items-center ${
                  action.style === 'destructive'
                    ? 'bg-red-500/20'
                    : action.style === 'cancel'
                    ? 'bg-transparent border border-white/20'
                    : 'bg-accent'
                }`}
              >
                <Text
                  className={`font-semibold text-base ${
                    action.style === 'destructive'
                      ? 'text-red-400'
                      : action.style === 'cancel'
                      ? 'text-white'
                      : 'text-black'
                  }`}
                >
                  {action.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;
