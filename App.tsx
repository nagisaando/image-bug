import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as ImageManipulator from "expo-image-manipulator";

export default function App() {
  const [hasMediaLibraryPermission, setMediaLibraryPermissions] = useState<
    boolean | null
  >(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [photos, setPhotos] = useState<{
    assets: MediaLibrary.Asset[];
    endCursor: string | undefined;
    hasNextPage: boolean;
  }>({
    assets: [] as MediaLibrary.Asset[],
    endCursor: undefined,
    hasNextPage: true,
  });

  useEffect(() => {
    async function initialize() {
      await getPermissionsAsync();
    }
    initialize();
  }, []);

  useEffect(() => {
    async function initialize() {
      if (hasMediaLibraryPermission) {
        await getPhotos();
      }
    }
    initialize();
  }, [hasMediaLibraryPermission]);

  const getPermissionsAsync = async (): Promise<void> => {
    const result = await MediaLibrary.requestPermissionsAsync(undefined, [
      "photo",
    ]);
    setMediaLibraryPermissions(result.status === "granted");
  };

  const getPhotos = async (): Promise<void> => {
    if (hasMediaLibraryPermission) {
      if (!photos.hasNextPage) {
        return;
      }
      const photoData = await MediaLibrary.getAssetsAsync({
        first: 50,
        after: photos.endCursor,
        sortBy: [MediaLibrary.SortBy?.creationTime],
      });

      if (photoData?.totalCount) {
        if (photoData.endCursor === photos.endCursor) {
          return;
        }
        setPhotos({
          assets: [...photos.assets, ...photoData.assets],
          endCursor:
            photoData?.endCursor?.trim()?.length > 0
              ? photoData?.endCursor
              : undefined,
          hasNextPage: photoData.hasNextPage,
        });
      } else {
        setIsEmpty(true);
      }
    }
  };

  const demonstrateFailure = async () => {
    const result = await ImageManipulator.manipulateAsync(
      photos?.assets[0].uri,
      [{ resize: { width: 1000 } }],
      {
        compress: 0.8,
        format: ImageManipulator.SaveFormat.PNG,
      }
    );
    console.log("result!: ", result);
  };

  return (
    <View style={styles.container}>
      <Button
        title="Demonstrate failure"
        disabled={isEmpty || !hasMediaLibraryPermission}
        onPress={() => demonstrateFailure()}
      />
      <StatusBar style="auto" />
      {isEmpty || !hasMediaLibraryPermission ? (
        <Text>
          Add photos to library to enable button and set media access.
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
