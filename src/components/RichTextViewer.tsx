import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { RichEditor } from 'react-native-pell-rich-editor';
import { useTheme } from '../store/settingsStore';

interface RichTextViewerProps {
  content: string;
}

export const RichTextViewer: React.FC<RichTextViewerProps> = ({ content }) => {
  const { theme } = useTheme();
  const richText = useRef<RichEditor>(null);

  useEffect(() => {
    if (richText.current && content) {
      richText.current.setContentHTML(content);
    }
  }, [content]);

  return (
    <View style={styles.container}>
      <RichEditor
        ref={richText}
        disabled={true}
        style={[
          styles.richEditor,
          {
            backgroundColor: theme.background,
          },
        ]}
        editorStyle={{
          backgroundColor: theme.background,
          color: theme.text,
          contentCSSText: `
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 16px;
            line-height: 1.6;
            padding: 16px;
            color: ${theme.text};
          `,
        }}
        initialHeight={Dimensions.get('window').height * 0.7}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  richEditor: {
    flex: 1,
  },
});
