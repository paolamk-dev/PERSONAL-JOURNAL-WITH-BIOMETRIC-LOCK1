import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  RichEditor,
  RichToolbar,
  actions,
} from 'react-native-pell-rich-editor';
import { useTheme } from '../store/settingsStore';
import { Ionicons } from '@expo/vector-icons';

interface RichTextEditorProps {
  initialContent?: string;
  placeholder?: string;
  onContentChange?: (html: string) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  initialContent = '',
  placeholder = 'Start writing...',
  onContentChange,
}) => {
  const { theme } = useTheme();
  const richText = useRef<RichEditor>(null);

  useEffect(() => {
    if (richText.current && initialContent) {
      richText.current.setContentHTML(initialContent);
    }
  }, []);

  const handleChange = (html: string) => {
    onContentChange?.(html);
  };

  return (
    <View style={styles.container}>
      <RichEditor
        ref={richText}
        onChange={handleChange}
        placeholder={placeholder}
        style={[
          styles.richEditor,
          {
            backgroundColor: theme.background,
          },
        ]}
        editorStyle={{
          backgroundColor: theme.background,
          color: theme.text,
          placeholderColor: theme.textSecondary,
          contentCSSText: `
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 16px;
            line-height: 1.6;
            padding: 16px;
            color: ${theme.text};
          `,
        }}
        initialHeight={400}
      />
      <RichToolbar
        editor={richText}
        actions={[
          actions.undo,
          actions.redo,
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.setStrikethrough,
          actions.heading1,
          actions.heading2,
          actions.insertBulletsList,
          actions.insertOrderedList,
          actions.blockquote,
          actions.alignLeft,
          actions.alignCenter,
          actions.alignRight,
          actions.code,
          actions.line,
        ]}
        iconMap={{
          [actions.heading1]: ({ tintColor }: { tintColor: string }) => (
            <Ionicons name="text" size={20} color={tintColor} />
          ),
          [actions.heading2]: ({ tintColor }: { tintColor: string }) => (
            <Ionicons name="text-outline" size={18} color={tintColor} />
          ),
        }}
        style={[
          styles.toolbar,
          {
            backgroundColor: theme.surface,
            borderTopColor: theme.border,
          },
        ]}
        selectedIconTint={theme.primary}
        iconTint={theme.textSecondary}
        disabledIconTint={theme.textSecondary}
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
    minHeight: 300,
  },
  toolbar: {
    borderTopWidth: 1,
    height: 50,
  },
});
