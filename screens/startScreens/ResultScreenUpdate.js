import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  ScrollView,
  Dimensions,
  TextInput,
  Switch,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Modal from "react-native-modal";

import React, { useEffect, useState, useRef, useContext } from "react";
import { useActivityContext } from "../../contexts/ActivityContext";
import { useAppContext } from "../../contexts/AppContext";
import TranslationContext from "../../translator/TranslationContext";
import PhotoPicker from "../../components/start/PhotoPicker";
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import AntDesignIcon from "react-native-vector-icons/AntDesign";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import FeatherIcon from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Constants from "expo-constants";
import RNPickerSelect from "react-native-picker-select";
import { FIRESTORE_DB, STORAGE_REF } from "../../firebase";
import {
  addDoc,
  collection,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function ResultScreenUpdate({ route }) {
  console.log(route.params.documentId);
  // const parentName = route.params.parentName;
  const navigation = useNavigation();
  const { user } = useAppContext();
  const [time, setTime] = useState(0);
  const [pace, setPace] = useState(0);
  const [locationLog, setLocationLog] = useState([]);
  const [calorie, setCalorie] = useState(0);
  const [mapSelected, setMapSelected] = useState("フォロワー");
  const [activityName, setActivityName] = useState("running");
  const textInputRef = useRef(null);
  const [isDammy, setIsDammy] = useState(false);
  const [bpm, setBpm] = useState("");
  const [memo, setMemo] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [imageBlob, setImageBlob] = useState(null);

  const {
    translations: { ResultScreenjs: translated },
  } = useContext(TranslationContext);
  const mapItems = [
    { label: "マップはフォロワーに表示される", value: "フォロワー" },
    { label: "マップは自分の身に表示される", value: "自分のみ" },
  ];
  class Result {
    constructor() {
      this.name = "Result";
    }
    main() {
      return this.render();
    }
    render() {
      return (
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <View>
              <TouchableOpacity onPress={() => this.handleCancel()}>
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                  {translated.cancel}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={{ fontWeight: "bold", fontSize: 16 }}>
              {translated.resultAndSave}
            </Text>
            <TouchableOpacity onPress={() => this.notSave()}>
              <FontAwesomeIcon name="trash" size={30} color="black" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.mainContainer}>
            <View style={styles.dataContainer}>
              <View style={styles.dataSubItem}>
                <Text style={{ fontSize: 20 }}>{time.toFixed(2)}</Text>
                <Text>{translated.time}</Text>
              </View>
              <View style={styles.dataSubItem}>
                <Text style={{ fontSize: 20 }}>{calorie}</Text>
                <Text>{translated.calories}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.activityContainer}
              onPress={() => this.handleActivityName()}
            >
              <Text style={styles.activityText}>{translated.Name}</Text>
              <TextInput
                style={styles.input}
                value={activityName}
                onChangeText={(text) => {
                  setActivityName(text);
                }}
                secureTextEntry={false}
                ref={textInputRef}
              />
            </TouchableOpacity>
            <PhotoPicker setImageBlob={setImageBlob} />
            <TouchableOpacity
              style={[styles.memoContainer, { height: this.memoHeight(memo) }]}
              onPress={this.toggleModal}
            >
              <View style={styles.resultReviewItem1}>
                <MaterialCommunityIcons
                  name="clipboard-text-outline"
                  size={30}
                  color="black"
                />
                <View style={{ alignItems: "start" }}>
                  <Text style={styles.activityText}>{translated.notes}</Text>
                  <Text style={{ color: "gray" }}>
                    {memo.length === 0 ? translated.withoutNotes : memo}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <View style={styles.detailContainer}>
              <Text style={styles.activityText}>{translated.MoreDetails}</Text>
            </View>
            <View>
              <RNPickerSelect
                items={mapItems}
                onValueChange={(value) => {
                  setMapSelected(value);
                }}
                value={mapSelected}
                placeholder={{}}
              >
                <View style={styles.mapContainer}>
                  <View style={styles.resultReviewItem1}>
                    <AntDesignIcon name="unlock" size={30} color="black" />
                    <Text style={styles.activityText}>{translated.Maps}</Text>
                  </View>
                  <View style={styles.resultReviewItem2}>
                    <Text style={styles.subText}>{mapSelected}</Text>
                  </View>
                </View>
              </RNPickerSelect>
            </View>
            <View style={styles.workOutRemindContainer}>
              <View style={styles.resultReviewItem1}>
                <IoniconsIcon name="alarm-outline" size={30} color="black" />
                <Text style={styles.activityText}>
                  {translated.WorkoutReminders}
                </Text>
              </View>
              <View style={styles.resultReviewItem2}>
                <Switch
                  value={isDammy}
                  onValueChange={this.handleDammy}
                  trackColor={{ false: "#767577", true: "#20B2AA" }}
                  thumbColor={isDammy ? "#f4f3f4" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                />
              </View>
            </View>
            {isDammy && (
              <TouchableOpacity style={styles.workOutRemindContainer}>
                <View style={styles.resultReviewItem1}>
                  <IoniconsIcon name="alarm-outline" size={30} color="black" />
                  <Text style={styles.activityText}>
                    {translated.WorkoutReminders}
                  </Text>
                </View>
                <View style={styles.resultReviewItem2}>
                  <Text style={styles.subText}>明日:午前6時</Text>
                </View>
              </TouchableOpacity>
            )}
            <View style={styles.aveHeartRateContainer}>
              <View style={styles.resultReviewItem1}>
                <FontAwesomeIcon name="heartbeat" size={30} color="black" />
                <Text style={styles.activityText}>
                  {translated.AvgHeartRate}
                </Text>
              </View>
              <View style={styles.resultReviewItem2}>
                <TextInput
                  placeholder="0"
                  style={styles.subText}
                  value={bpm}
                  onChangeText={(text) => {
                    setBpm(text);
                  }}
                  keyboardType="numeric"
                />
                <Text style={styles.subText}> bpm</Text>
              </View>
            </View>
            <View style={styles.shoeTrackerContainer}>
              <View style={styles.resultReviewItem1}>
                <MaterialCommunityIcons
                  name="shoe-sneaker"
                  size={30}
                  color="black"
                />
                <Text style={styles.activityText}>shoes tracker</Text>
              </View>
            </View>
            <View style={styles.workTogetherContainer}>
              <View style={styles.resultReviewItem1}>
                <MaterialCommunityIcons
                  name="account-group-outline"
                  size={30}
                  color="black"
                />
                <Text style={styles.activityText}>
                  {translated.Iexercisedwith}
                </Text>
              </View>
              <View style={styles.resultReviewItem2}>
                <AntDesignIcon name="right" size={20} color="lightgray" />
              </View>
            </View>
          </ScrollView>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => this.saveResult()}
          >
            <Text style={styles.saveButtonText}>{translated.save}</Text>
          </TouchableOpacity>
          <Modal
            isVisible={isModalVisible}
            style={styles.memoPopContainer}
            backdropOpacity={1}
          >
            <View style={styles.memoTitleContainer}>
              <TouchableOpacity onPress={this.toggleModal}>
                <Text style={styles.subText}>{translated.cancel}</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{translated.notes}</Text>
              <TouchableOpacity onPress={this.toggleModal}>
                <Text style={styles.subText}>{translated.add}</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.modalInput}
              value={memo}
              onChangeText={(text) => {
                setMemo(text);
              }}
              multiline={true}
              numberOflines={10}
              secureTextEntry={false}
            />
          </Modal>
        </View>
      );
    }
    async fetchActivity() {
      try {
        const documentId = route.params.documentId;
        if (documentId) {
          const docRef = doc(FIRESTORE_DB, "stride-tracker_DB", documentId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists) {
            console.log("Document dataaaaaaaaaaaaaaa:", docSnap.data());
            const data = docSnap.data();
            console.log("uuuuuuuuuuuuuukiiiiiiiii" + data.time);
            setTime(data.time);
            setPace(data.pace);
            setLocationLog(data.locationLog);
            setCalorie(data.calorie);
            setActivityName(data.activityName);
            setMapSelected(data.map);
            setMemo(data.memo);
            setBpm(data.bpm);
          } else {
            console.log("No such document!");
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    toggleModal() {
      setModalVisible(!isModalVisible);
    }
    handleActivityName() {
      textInputRef.current.focus();
    }
    handleDammy() {
      setIsDammy(!isDammy);
    }
    handleSetResultItem = (item) => {
      console.log(item);
    };
    memoHeight() {
      const lineHeigh = 40;
      if (memo.length !== 0) {
        const lines = Math.ceil(memo.length / 20);
        return lineHeigh + 10 * lines;
      } else {
        return 60;
      }
    }
    notSave() {
      navigation.goBack();
    }
    handleCancel() {
      navigation.goBack();
    }
    memoHeight() {
      const lineHeigh = 40;
      if (memo.length !== 0) {
        const lines = Math.ceil(memo.length / 20);
        return lineHeigh + 10 * lines;
      } else {
        return 60;
      }
    }
    saveResult() {
      const datetime = new Date();
      const docRef = doc(
        FIRESTORE_DB,
        "stride-tracker_DB",
        route.params.documentId
      );
      const updateData = {
        user: user,
        activityName: activityName,
        locationLog: locationLog,
        time: time,
        pace: pace,
        calorie: calorie,
        bpm: bpm,
        memo: memo,
        map: mapSelected,
        datetime: datetime,
        image: "",
      };
      const updateDocument = (data) => {
        updateDoc(docRef, data)
          .then(() => {
            console.log("Document successfully updated!");
            navigation.goBack();
          })
          .catch((error) => {
            console.error("Error updating document: ", error);
          });
      };
      if (imageBlob !== null) {
        this.uploadImage(imageBlob).then((url) => {
          updateData.image = url;
          updateDocument(updateData);
        });
      } else {
        updateData.image = "";
        updateDocument(updateData);
      }
    }
    async uploadImage(blob) {
      const imageRef = ref(STORAGE_REF, "images/" + blob._data.name);
      console.log(`ref:${imageRef}`);
      const uploadSnapshot = await uploadBytes(imageRef, blob, {
        contentType: blob._data.type || "image/jpeg",
      });
      console.log(blob._data.name);
      console.log(blob._data.size);
      const url = await getDownloadURL(imageRef);
      console.log(url);
      return url;
    }
  }
  const result = new Result();
  useEffect(() => {
    result.fetchActivity();
  }, []);
  return result.main();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Constants.statusBarHeight,
  },
  mainContainer: {
    flex: 1,
  },
  titleContainer: {
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 10,
  },
  resultReviewItem1: {
    flexDirection: "row",
    alignItems: "center",
  },
  resultReviewItem2: {
    flexDirection: "row",
    alignItems: "center",
  },
  dataContainer: {
    height: 60,
    borderWidth: 1,
    borderColor: "#F5F5F5",
    flexDirection: "row",
  },
  dataSubItem: {
    width: "20%",
    justifyContent: "center",
    alignItems: "center",
  },
  activityContainer: {
    height: 60,
    borderWidth: 1,
    borderColor: "#F5F5F5",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  pictureContainer: {
    height: 60,
    borderWidth: 1,
    borderColor: "#F5F5F5",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  memoContainer: {
    borderWidth: 1,
    borderColor: "#F5F5F5",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    height: 60,
  },
  memoTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
  },
  memoPopContainer: {
    margin: 0,
    backgroundColor: "white",
    justifyContent: "flex-start",
    paddingTop: Constants.statusBarHeight,
  },
  detailContainer: {
    height: 60,
    borderWidth: 1,
    borderColor: "#F5F5F5",
    justifyContent: "center",
  },
  mapContainer: {
    height: 60,
    borderWidth: 1,
    borderColor: "#F5F5F5",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  workOutRemindContainer: {
    height: 60,
    borderWidth: 1,
    borderColor: "#F5F5F5",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  aveHeartRateContainer: {
    height: 60,
    borderWidth: 1,
    borderColor: "#F5F5F5",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  shoeTrackerContainer: {
    height: 60,
    borderWidth: 1,
    borderColor: "#F5F5F5",
    justifyContent: "center",
  },
  workTogetherContainer: {
    height: 60,
    borderWidth: 1,
    borderColor: "#F5F5F5",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  activityText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "black",
    marginLeft: 10,
  },
  input: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  modalInput: {
    fontSize: 16,
  },
  subText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000033",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    marginRight: 25,
  },
  saveButton: {
    backgroundColor: "#3366CC",
    width: "90%",
    height: "9%",
    bottom: "0%",
    left: "5%",
    right: "95%",
    borderRadius: 20,
    justifyContent: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});