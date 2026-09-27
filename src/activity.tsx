import { HStack, Image, Text } from '@expo/ui/swift-ui';
import { createLiveActivity } from 'expo-widgets';

type Props = { title: string };

export const activity = createLiveActivity<Props>('Demo', (props) => {
  'widget';
  const row = (
    <HStack spacing={8}>
      <Image systemName="star.fill" size={16} />
      <Text>{props.title}</Text>
    </HStack>
  );
  return {
    banner: row,
    compactLeading: <Image systemName="star.fill" size={14} />,
    compactTrailing: <Text>{props.title}</Text>,
    minimal: <Image systemName="star.fill" size={14} />,
    expandedLeading: <Image systemName="star.fill" size={16} />,
    expandedCenter: <Text>{props.title}</Text>,
    expandedTrailing: <Text>OK</Text>,
    expandedBottom: row,
  };
});
