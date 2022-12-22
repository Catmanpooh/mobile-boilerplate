import AsyncStorage from "@react-native-async-storage/async-storage";
import { Camera } from "expo-camera";
import React, { Props, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { graphql, useMutation } from "react-relay";

const PhotoCreatePhotoMutation = graphql`
  mutation PhotoCreatePhotoMutation($input: CreatePhoto!) {
    createPhotos(input: $input)
  }
`;

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function Photo({ navigation }: Props): JSX.Element {
  const [userId, setUserId] = useState<string | null>(null);
  const [commit, isInFlight] = useMutation(PhotoCreatePhotoMutation);

  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [photo, setPhoto] = useState();

  useEffect(() => {
    getData();
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
    })();
  }, []);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("userId");
      if (value !== null) {
        setUserId(value);
      }

      // clearAll();
    } catch (e) {
      console.log("handle better later", e);
    }
  };

  const createPhoto = () => {
    commit({
      variables: {
        input: {
          userId: userId,
          file: photo?.base64,
          fileName: "random_name_dont_need",
        },
      },
      onCompleted(data: any) {
        if (data.createPhotos > 0) {
          Alert.alert("Successful compare");
          setPhoto(undefined);
          navigation.navigate("Home");
        }
      },
      onError(err: any): void {
        console.log(err);
      },
    });
  };

  if (isInFlight) {
    return <ActivityIndicator />;
  }

  if (hasCameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>;
  } else if (!hasCameraPermission) {
    return (
      <Text>
        Permission for camera not granted. Please change this in settings.
      </Text>
    );
  }

  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);

    setPhoto(newPhoto);
  };

  if (photo) {
    let savePhoto = () => {
      createPhoto();
    };

    return (
      <SafeAreaView style={styles.container}>
        <Image
          style={styles.preview}
          source={{ uri: "data:image/jpg;base64," + photo.base64 }}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            width: windowWidth,
            position: "absolute",
            bottom: 10,
            marginBottom: 8,
          }}
        >
          <Button title="Save" onPress={savePhoto} />

          <Button title="Discard" onPress={() => setPhoto(undefined)} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Camera style={styles.container} ref={cameraRef} type="front">
        <StatusBar style="auto" />
      </Camera>
      <View style={styles.buttonContainer}>
        <Button title="Take Face Picture" onPress={takePic} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    marginBottom: 8,
    position: "absolute",
    bottom: 10,
    left: windowWidth * 0.3,
  },
  preview: {
    alignSelf: "stretch",
    flex: 1,
  },
});
