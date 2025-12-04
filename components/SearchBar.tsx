import React from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  TextInputProps,
} from "react-native";
import { icons } from "@/assets/icons";

type Props = {
  placeholder?: string;
  // when editable is false (default), onPress is used to navigate/open search
  onPress?: () => void;
  // editable mode props
  editable?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
  autoFocus?: boolean;
  onSubmitEditing?: TextInputProps["onSubmitEditing"];
};

const SearchBar = ({
  onPress,
  placeholder = "Search...",
  editable = false,
  value,
  onChangeText,
  autoFocus = false,
  onSubmitEditing,
}: Props) => {
  if (editable) {
    return (
      <View className="flex-row items-center bg-dark-200 rounded-full px-4 py-2">
        <Image
          source={icons.search}
          className="size-6"
          resizeMode="contain"
          tintColor={"#ab8bff"}
        />
        <TextInput
          autoFocus={autoFocus}
          placeholder={placeholder}
          placeholderTextColor="#a8b6db"
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          className="ml-3 flex-1 text-white text-base"
        />
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="flex-row items-center bg-dark-200 rounded-full px-5 py-3"
    >
      <Image
        source={icons.search}
        className="size-7"
        resizeMode="contain"
        tintColor={"#ab8bff"}
      />
      <Text className="ml-3 text-white text-sm">{placeholder}</Text>
    </TouchableOpacity>
  );
};

export default SearchBar;
