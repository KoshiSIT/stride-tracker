import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FeatherIcon from "react-native-vector-icons/Feather";
// translation lib
import TranslationContext from "../../translator/TranslationContext";

const PhotoPicker = ({ setImageBlob }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const {
    translations: { PhotoPickerjs: translated },
  } = useContext(TranslationContext);
  const handleImagePick = async () => {
    const permissonResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissonResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      madiaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!pickerResult.canceled) {
      setSelectedImage({ localUri: pickerResult.uri });
      const localUri = await fetch(pickerResult.uri);
      const localBlob = await localUri.blob();
      setImageBlob(localBlob);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={handleImagePick} style={styles.imageContainer}>
        <View style={styles.imageItem}>
          <MaterialCommunityIcons
            name="camera-outline"
            size={30}
            color="black"
          />
          <Text style={styles.text}>{translated.AddaPicture}</Text>
        </View>
        <View style={styles.imageItem}>
          {selectedImage !== null ? (
            <Image
              source={{ uri: selectedImage.localUri }}
              style={{ width: 50, height: 50 }}
            />
          ) : (
            <FeatherIcon name="plus" size={30} color="black" />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};
export default PhotoPicker;
const styles = StyleSheet.create({
  imageContainer: {
    height: 60,
    borderWidth: 1,
    borderColor: "#F5F5F5",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  imageItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 17,
    fontWeight: "bold",
    color: "black",
    marginLeft: 10,
  },
});
