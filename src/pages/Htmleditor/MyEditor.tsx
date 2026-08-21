import { useState, useRef, useEffect } from 'react';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import type { SunEditorReactProps } from 'suneditor-react/dist/types/SunEditorReactProps';

interface HtmlEditorProps extends Partial<SunEditorReactProps> {
  placeholder?: string;
  height?: string;
  onChange: (v: string) => void;
  setContent?: string;
  defaultValue?: string;
}

const HtmlEditor = ({ 
  placeholder, 
  height, 
  onChange, 
  setContent = '', 
  defaultValue = '', 
  ...props 
}: HtmlEditorProps) => {
  const editorRef = useRef<any>(null);

  const getSunEditorInstance = (sunEditor: any) => {
    editorRef.current = sunEditor;
    
    // Set default font, size, and format after editor is initialized
    if (sunEditor) {
      // Wait for editor to be fully ready
      setTimeout(() => {
        // Set default font size to 12px
        if (typeof sunEditor.setFontSize === 'function') {
          sunEditor.setFontSize('12');
        }
        // Set default format to paragraph
        if (typeof sunEditor.setFormatBlock === 'function') {
          sunEditor.setFormatBlock('p');
        }
      }, 100);

      // Re-apply on focus so it sticks when the user starts typing
      if (sunEditor.core && sunEditor.core.context && sunEditor.core.context.element && sunEditor.core.context.element.wysiwyg) {
        const reapplyDefaults = () => {
          if (typeof sunEditor.setFontSize === 'function') {
            sunEditor.setFontSize('12');
          }
          if (typeof sunEditor.setFormatBlock === 'function') {
            sunEditor.setFormatBlock('p');
          }
        };
        sunEditor.core.context.element.wysiwyg.addEventListener('focus', reapplyDefaults);
        // Also re-apply while typing so the toolbar values stay in sync
        sunEditor.core.context.element.wysiwyg.addEventListener('input', reapplyDefaults);
        sunEditor.core.context.element.wysiwyg.addEventListener('keyup', reapplyDefaults);
      }
    }
  };

  return (
    <SunEditor
      getSunEditorInstance={getSunEditorInstance}
      defaultValue={defaultValue || '<p>Start typing here...</p>'}
      setContents={setContent}
      height={height || '300'}
      placeholder={placeholder || 'Please enter a project description....'}
      onChange={onChange}
      setOptions={{
 defaultStyle: 'font-family: Helvetica Neue; font-size: 12px;',
 fontSize: [12, 18],       
  font: [
          'Helvetica Neue',
          'Arial',
          'Comic Sans MS',
          'Courier New',
          'Georgia',
          'Impact',
          'Tahoma',
          'Times New Roman',
          'Verdana'
        ],
        buttonList: [
          [
            'undo',
            'redo',
            'font',
            'fontSize',
            'formatBlock',
            'bold',
            'underline',
            'italic',
            'strike',
            'fontColor',
            'hiliteColor',
            'removeFormat',
            'align',
            'horizontalRule',
            'list',
            'table',
            'link',
            'image'
          ]
        ],
        defaultTag: 'p',
        minHeight: '300px',
        maxHeight: '600px',
        showPathLabel: false,
        width: '100%'
      }}
      {...props}
    />
  );
};

export default HtmlEditor;