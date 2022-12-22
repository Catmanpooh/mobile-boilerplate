import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Suspense, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Button,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  graphql,
  PreloadedQuery,
  useMutation,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";
import { OperationType } from "relay-runtime";

const ComparisonQuery = {
  comparisonQuery: graphql`
    query ComparisonQuery($userId: String!) {
      comparisons(userId: $userId) {
        id
        userId
        photoId1
        photoId2
        comparisonText
        createdAt
      }
    }
  `,
  comparisonPhotoQuery: graphql`
    query ComparisonPhotoQuery($userId: String!) {
      photos(userId: $userId) {
        file
      }
    }
  `,
};

const ComparisonCreateComparisonMutation = graphql`
  mutation ComparisonCreateComparisonMutation($input: CreateComparison!) {
    createComparison(input: $input)
  }
`;

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function Comparison({ route, navigation }: any): JSX.Element {
  const comparePhotos = route.params?.comparePhotos;
  const [queryReference, loadQuery] = useQueryLoader(
    ComparisonQuery.comparisonQuery
  );
  const [userId, setUserId] = useState<string | null>();
  const [comparisonText, OnChangeComparisonText] = useState<
    string | undefined
  >();
  const [commit] = useMutation(ComparisonCreateComparisonMutation);

  useEffect(() => {
    getData();
  }, [loadQuery]);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("userId");
      if (value !== null) {
        setUserId(value);
        loadQuery({ userId: value });
      }
    } catch (e) {
      console.log("handle better later", e);
    }
  };

  const createComparison = () => {
    if (!comparisonText) {
      Alert.alert("Please ensure every input is filled in.");
      return;
    }

    commit({
      variables: {
        input: {
          userId: userId,
          photoId1: comparePhotos[0].id,
          photoId2: comparePhotos[1].id,
          comparisonText: comparisonText,
        },
      },
      onCompleted(data: any) {
        if (data.createComparison > 0) {
          Alert.alert("Successful compare");
          navigation.navigate("Comparison");
        }
      },
      onError(err: any): void {
        console.log(err);
      },
    });
  };

  return !comparePhotos ? (
    queryReference ? (
      <Suspense fallback={<ActivityIndicator />}>
        <ComparisonContent
          queryReference={queryReference}
          navigation={navigation}
        />
      </Suspense>
    ) : (
      <ActivityIndicator />
    )
  ) : (
    <SafeAreaView>
      <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={100}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <Image
            style={{ width: windowWidth * 0.48, height: windowHeight * 0.5 }}
            source={{ uri: "data:image/jpg;base64," + comparePhotos[0]?.image }}
          />
          <Image
            style={{ width: windowWidth * 0.48, height: windowHeight * 0.5 }}
            source={{ uri: "data:image/jpg;base64," + comparePhotos[1]?.image }}
          />
        </View>

        <TextInput
          style={styles.input}
          multiline
          numberOfLines={4}
          onChangeText={OnChangeComparisonText}
          value={comparisonText}
          textContentType="none"
          placeholder="Write up what you see different"
        />

        <Button onPress={() => createComparison()} title="Create Comparison" />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function ComparisonContent({
  queryReference,
  navigation,
}: {
  queryReference: PreloadedQuery<OperationType, Record<string, unknown>>;
  navigation: Props;
}): JSX.Element {
  const data = usePreloadedQuery(
    ComparisonQuery.comparisonQuery,
    queryReference
  );
  return (
    <SafeAreaView>
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={data.comparisons}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("PhotoAndComparison", {
                photo1: item?.photoId1,
                photo2: item?.photoId2,
                compText: item?.comparisonText,
                createdAt: new Date(item?.createdAt).toDateString(),
              })
            }
            style={styles.flatlistContainer}
          >
            <Text style={{ fontWeight: "700" }}>{item?.comparisonText}</Text>
            <Text>{new Date(item?.createdAt).toDateString()}</Text>
          </TouchableOpacity>
        )}
      />
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
    margin: 12,
    borderBottomWidth: 1,
    padding: 10,
  },
  flatlistContainer: {
    alignItems: "center",
    flex: 1,
    padding: 10,
    margin: 12,
    borderRadius: 5,
    borderWidth: 1,
  },
});
