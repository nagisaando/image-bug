import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import * as MediaLibrary from "expo-media-library";

export default function App() {
  const [hasMediaLibraryPermission, setMediaLibraryPermissions] = useState<
    boolean | null
  >(null);
  const [isEmpty, setIsEmpty] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  useEffect(() => {
    async function initialize() {
      await getPermissionsAsync();
    }
    initialize();
  }, []);

  const getPermissionsAsync = async (): Promise<void> => {
    const result = await MediaLibrary.requestPermissionsAsync();
    setMediaLibraryPermissions(result.status === "granted");
  };

  const getPhotos = async (): Promise<void> => {
    if (hasMediaLibraryPermission) {
      const photoData = await MediaLibrary.getAssetsAsync({
        first: 1, // Fetch only the first image
        sortBy: [MediaLibrary.SortBy.creationTime],
      });

      // ==================================================
      // we can not use uri from getAssetsAsync
      // this code is to demonstrate the error
      // please comment this and uncomment the below code
      if (photoData.assets.length > 0) setPhotoUri(photoData.assets[0].uri);
      // ==================================================

      // ==================================================
      // comment if (photoData.assets.length > 0) setPhotoUri(photoData.assets[0].uri); and uncomment below code
      // we can display the photo without error

      // if (photoData.assets.length > 0) {
      //   const assetInfo = await MediaLibrary.getAssetInfoAsync(
      //     photoData.assets[0].id
      //   );
      //   setPhotoUri(assetInfo.localUri || assetInfo.uri);
      // } else {
      //   setIsEmpty(true);
      // }
      // ==================================================
    }
  };

  return (
    <View style={styles.container}>
      <Button
        title="Get photo"
        disabled={!hasMediaLibraryPermission}
        onPress={getPhotos}
      />
      <StatusBar style="auto" />
      {isEmpty || !hasMediaLibraryPermission ? (
        <Text>
          Add photos to library to enable button and set media access.
        </Text>
      ) : (
        photoUri && (
          <Image
            style={{ width: 500, height: 500 }}
            source={{ uri: photoUri }}
          />
        )
      )}
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
