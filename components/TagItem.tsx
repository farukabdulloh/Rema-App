import { FC } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLOR } from "../constants/colors";

interface Props {
  name: string;
  handleChangeRecipe: (name: string) => void;
  selectedName: string;
}

const TagItem: FC<Props> = ({ name, handleChangeRecipe, selectedName }) => {
  const isSelected = selectedName === name;

  return (
    <View style={styles.tagContainer}>
      <TouchableOpacity onPress={() => handleChangeRecipe(name)} activeOpacity={0.8}>
        <View style={[styles.tag, isSelected && styles.selectedTag]}>
          <Text style={[styles.tagName, isSelected && styles.selectedTagName]}>{name}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default TagItem;

const styles = StyleSheet.create({
  tagContainer: {
    paddingVertical: 4,
  },

  tag: {
    backgroundColor: COLOR.surface,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLOR.border,
  },

  selectedTag: {
    backgroundColor: COLOR.primary,
    borderColor: COLOR.primary,
  },

  tagName: {
    fontSize: 12,
    fontWeight: "600",
    color: COLOR.primary,
    textTransform: "capitalize",
    letterSpacing: 0.2,
  },

  selectedTagName: {
    color: COLOR.onPrimary,
  },
});
