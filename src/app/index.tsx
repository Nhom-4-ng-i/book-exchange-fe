import { StyleSheet, Text, TextInput, View } from "react-native";
import IconExport from "../icons/IconExport";

export default function Index() {
  return (
    <View>
      <Text style={styles.text}>Edit app/index.tsx to edit this screen.</Text>
      <Text>Hello</Text>
      <IconExport />
      <TextInput style={styles.textInput} />
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "red",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "red",
    padding: 10,
    borderRadius: 5,
  },
})
