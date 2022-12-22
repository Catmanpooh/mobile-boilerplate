import React, { Props, Suspense, useEffect } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  graphql,
  PreloadedQuery,
  usePreloadedQuery,
  useQueryLoader,
} from "react-relay";
import { OperationType } from "relay-runtime";

const PhotoAndComparisonQuery = graphql`
  query PhotoAndComparisonQuery($photoId: String!) {
    photo(photoId: $photoId)
  }
`;

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function PhotoAndComparison({
  route,
  navigation,
}: Props): JSX.Element {
  const { photo1, photo2, compText, createdAt } = route.params;

  const [queryReference1, loadQuery1] = useQueryLoader(PhotoAndComparisonQuery);
  const [queryReference2, loadQuery2] = useQueryLoader(PhotoAndComparisonQuery);

  useEffect(() => {
    loadQuery1({ photoId: photo1 });
    loadQuery2({ photoId: photo2 });
  }, [loadQuery1, loadQuery2]);

  return queryReference1 && queryReference2 ? (
    <Suspense fallback={<ActivityIndicator />}>
      <HomeContent
        queryReference1={queryReference1}
        queryReference2={queryReference2}
        compText={compText}
        createdAt={createdAt}
      />
    </Suspense>
  ) : (
    <ActivityIndicator />
  );
}

function HomeContent({
  queryReference1,
  queryReference2,
  compText,
  createdAt,
}: {
  queryReference1: PreloadedQuery<OperationType, Record<string, unknown>>;
  queryReference2: PreloadedQuery<OperationType, Record<string, unknown>>;
  compText: string;
  createdAt: string;
  navigation: Props;
}): JSX.Element {
  const photoData1 = usePreloadedQuery(
    PhotoAndComparisonQuery,
    queryReference1
  );

  const photoData2 = usePreloadedQuery(
    PhotoAndComparisonQuery,
    queryReference2
  );

  return (
    <SafeAreaView>
      <View style={styles.flatlistContainer}>
        <View
          style={{
            width: windowWidth,
            height: windowHeight * 0.5,
            margin: 8,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
          }}
        >
          <Image
            style={{
              width: windowWidth * 0.48,
              height: windowHeight * 0.5,
            }}
            source={{ uri: "data:image/jpg;base64," + photoData1?.photo }}
          />
          <Image
            style={{
              width: windowWidth * 0.48,
              height: windowHeight * 0.5,
            }}
            source={{ uri: "data:image/jpg;base64," + photoData2?.photo }}
          />
        </View>
        <Text style={{ fontSize: 24, fontWeight: "700" }}>
          About Comparison
        </Text>
        <Text style={{ fontSize: 16, marginVertical: 12 }}>{compText}</Text>
        <Text>Date: {createdAt}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flatlistContainer: {
    alignItems: "center",
    padding: 10,
    marginTop: 8,
  },
});
