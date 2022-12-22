import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Props, Suspense, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  graphql,
  PreloadedQuery,
  useMutation,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";
import { OperationType } from "relay-runtime";

const HomeQuery = {
  userAndPhotos: graphql`
    query HomeQuery($userId: String!) {
      user(id: $userId) {
        userName
        firstName
        lastName
      }
      photos(userId: $userId) {
        id
        file
        createdAt
      }
    }
  `,
  userUsingUserName: graphql`
    query HomeForUserQuery($userName: String!) {
      user(username: $userName) {
        id
      }
    }
  `,
};

const HomeCreateUserMutation = graphql`
  mutation HomeCreateUserMutation($input: CreateUser!) {
    createUser(input: $input)
  }
`;

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function Home({ navigation }: Props): JSX.Element {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, OnChangeUserName] = useState<string, null>();
  const [firstName, OnChangeFirstName] = useState<string, null>();
  const [lastName, OnChangeLastName] = useState<string, null>();
  const [comparePhotos, setComparePhotos] = useState<
    Array<{ id: string; image: string }> | []
  >([]);
  const [queryReference, loadQuery] = useQueryLoader(HomeQuery.userAndPhotos);
  const [commit, isInFlight] = useMutation(HomeCreateUserMutation);

  useEffect(() => {
    getData();
  }, [loadQuery]);

  useEffect(() => {
    navigation.addListener("focus", () => {
      getData();
    });
  }, [navigation]);

  const getData = async () => {
    if (userId) {
      setComparePhotos([]);
      loadQuery({ userId: userId });
      return;
    }

    try {
      const value = await AsyncStorage.getItem("userId");
      if (value !== null) {
        setUserId(value);
        loadQuery({ userId: value });
      }

      // clearAll();
    } catch (e) {
      console.log("handle better later", e);
    }
  };

  const storeData = async (value: string) => {
    try {
      await AsyncStorage.setItem("userId", value);
      loadQuery({ userId: value });
    } catch (e) {
      console.log("handle better later", e);
    }
  };

  // used to clear storage when database is dropped
  // inside getData()
  const clearAll = async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.log("handle better later", e);
    }

    console.log("Done.");
  };

  const createUser = () => {
    if (!(userName || firstName || lastName)) {
      Alert.alert("Please ensure every input is filled in.");
      return;
    }

    commit({
      variables: {
        input: {
          userName: userName,
          firstName: firstName,
          lastName: lastName,
        },
      },
      onCompleted(data: any) {
        storeData(data.createUser);
        setUserId(data.createUser);
      },
      onError(err: any): void {
        console.log(err);
      },
    });
  };

  const compareSetArray = (value: string, image: string) => {
    //Need to check if same
    if (comparePhotos.length >= 2) {
      let new_array = [comparePhotos[0], { id: value, image: image }];
      setComparePhotos(new_array);
      return;
    }

    setComparePhotos([...comparePhotos, { id: value, image: image }]);
  };

  if (isInFlight) {
    return <ActivityIndicator />;
  }

  return userId ? (
    queryReference ? (
      <Suspense fallback={<ActivityIndicator />}>
        <HomeContent
          queryReference={queryReference}
          comparePhotos={comparePhotos}
          setComparePhotos={compareSetArray}
          navigation={navigation}
        />
      </Suspense>
    ) : (
      <ActivityIndicator />
    )
  ) : (
    <SafeAreaView>
      <TextInput
        style={styles.input}
        onChangeText={OnChangeUserName}
        value={userName}
        textContentType="username"
        placeholder="Enter Username"
      />
      <TextInput
        style={styles.input}
        onChangeText={OnChangeFirstName}
        value={firstName}
        textContentType="name"
        placeholder="Enter First Name"
      />
      <TextInput
        style={styles.input}
        onChangeText={OnChangeLastName}
        value={lastName}
        textContentType="name"
        placeholder="Enter Last Name"
      />

      <Button
        onPress={() => createUser()}
        title="Create User"
        style={styles.button}
      />
    </SafeAreaView>
  );
}

function HomeContent({
  queryReference,
  comparePhotos,
  setComparePhotos,
  navigation,
}: {
  queryReference: PreloadedQuery<OperationType, Record<string, unknown>>;
  comparePhotos: Array<string>;
  setComparePhotos: Function;
  navigation: Props;
}): JSX.Element {
  const data = usePreloadedQuery(HomeQuery.userAndPhotos, queryReference);

  return (
    <SafeAreaView>
      <Text style={styles.header}>{data?.user?.userName}</Text>
      <View style={{ height: "90%" }}>
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={data.photos}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => setComparePhotos(item?.id, item?.file)}
            >
              <View style={styles.flatlistContainer}>
                <Image
                  source={{ uri: "data:image/jpg;base64," + item?.file }}
                  style={{
                    width: windowWidth / 1.2,
                    height: windowHeight / 3,
                    borderWidth: 2,
                    borderColor: "#d35647",
                    resizeMode: "contain",
                    margin: 8,
                    alignItems: "center",
                  }}
                />
                <Text>{new Date(item?.createdAt).toDateString()}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={styles.footerButtonView}>
        {comparePhotos.length >= 2 ? (
          <Button
            onPress={() => navigation.navigate("Comparison", { comparePhotos })}
            title="Compare"
            style={styles.button}
          />
        ) : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 42,
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  flatlistContainer: {
    alignItems: "center",
    flex: 1,
    padding: 10,
    marginTop: 8,
  },
  footerButtonView: {
    width: windowWidth * 0.5,
    height: windowHeight * 0.1,
    position: "absolute",
    bottom: 10,
    left: 125,
  },
});
