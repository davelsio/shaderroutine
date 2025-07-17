import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '../../typography/Text';

import styles from './Typography.styles';

export function HomeView() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.view}>
        <Text size={34} family="Nunito" face="SemiBold">
          Nunito
        </Text>
        <Text size={30} family="SpaceMono" face="Regular">
          SpaceMono
        </Text>
        <Text variant="largeTitle">Large Title</Text>
        <Text variant="title1">Title 1</Text>
        <Text variant="title2">Title 2</Text>
        <Text variant="title3">Title 3</Text>
        <Text variant="headline">Headline</Text>
        <Text variant="body">Body</Text>
        <Text variant="callout">Callout</Text>
        <Text variant="subhead">Subhead</Text>
        <Text variant="footnote">Footnote</Text>
        <Text variant="caption1">Caption 1</Text>
        <Text variant="caption2">Caption 2</Text>
      </View>
    </SafeAreaView>
  );
}
