'use client';

import { useState, useRef, useEffect } from 'react';

const RichTextEditor = ({ 
  value = '', 
  onChange, 
  placeholder = 'Escribe aquí...',
  height = '300px',
  toolbar = 'basic', // 'basic', 'full'
  className = ''
}) => {
  const [content, setContent] = useState(value);
  const [showSource, setShowSource] = useState(false);
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setContent(value);
  }, [value]);

  const handleContentChange = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML;
      setContent(newContent);
      onChange && onChange(newContent);
    }
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleContentChange();
  };

  const handleKeyDown = (e) => {
    // Atajos de teclado
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
        case 'k':
          e.preventDefault();
          const url = prompt('Ingresa la URL:');
          if (url) execCommand('createLink', url);
          break;
      }
    }
  };

  const insertImage = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        execCommand('insertImage', event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const insertLink = () => {
    const url = prompt('Ingresa la URL:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  const changeFormat = (tag) => {
    execCommand('formatBlock', tag);
  };

  const getToolbarButtons = () => {
    const basicButtons = [
      { command: 'bold', icon: 'bi-type-bold', title: 'Negrita (Ctrl+B)' },
      { command: 'italic', icon: 'bi-type-italic', title: 'Cursiva (Ctrl+I)' },
      { command: 'underline', icon: 'bi-type-underline', title: 'Subrayado (Ctrl+U)' },
      { divider: true },
      { command: 'insertUnorderedList', icon: 'bi-list-ul', title: 'Lista con viñetas' },
      { command: 'insertOrderedList', icon: 'bi-list-ol', title: 'Lista numerada' },
      { divider: true },
      { command: 'justifyLeft', icon: 'bi-text-left', title: 'Alinear izquierda' },
      { command: 'justifyCenter', icon: 'bi-text-center', title: 'Centrar' },
      { command: 'justifyRight', icon: 'bi-text-right', title: 'Alinear derecha' },
    ];

    const fullButtons = [
      ...basicButtons,
      { divider: true },
      { custom: 'link', icon: 'bi-link', title: 'Insertar enlace (Ctrl+K)' },
      { custom: 'image', icon: 'bi-image', title: 'Insertar imagen' },
      { divider: true },
      { command: 'removeFormat', icon: 'bi-eraser', title: 'Limpiar formato' },
      { command: 'undo', icon: 'bi-arrow-counterclockwise', title: 'Deshacer' },
      { command: 'redo', icon: 'bi-arrow-clockwise', title: 'Rehacer' },
    ];

    return toolbar === 'full' ? fullButtons : basicButtons;
  };

  const toggleSource = () => {
    if (showSource) {
      // Volver al editor visual
      const textarea = document.querySelector('.source-editor');
      if (textarea && editorRef.current) {
        editorRef.current.innerHTML = textarea.value;
        setContent(textarea.value);
        onChange && onChange(textarea.value);
      }
    }
    setShowSource(!showSource);
  };

  return (
    <div className={`rich-text-editor ${className}`}>
      {/* Toolbar */}
      <div className="toolbar bg-dark border border-secondary border-bottom-0 p-2 d-flex flex-wrap gap-1">
        {/* Format Selector */}
        <select 
          className="form-select form-select-sm bg-dark text-light border-secondary me-2"
          style={{ width: 'auto' }}
          onChange={(e) => changeFormat(e.target.value)}
          defaultValue=""
        >
          <option value="">Formato</option>
          <option value="p">Párrafo</option>
          <option value="h1">Encabezado 1</option>
          <option value="h2">Encabezado 2</option>
          <option value="h3">Encabezado 3</option>
          <option value="h4">Encabezado 4</option>
          <option value="blockquote">Cita</option>
          <option value="pre">Código</option>
        </select>

        {/* Buttons */}
        {getToolbarButtons().map((button, index) => {
          if (button.divider) {
            return <div key={index} className="vr mx-1"></div>;
          }

          if (button.custom === 'link') {
            return (
              <button
                key={index}
                type="button"
                className="btn btn-sm btn-outline-warning"
                onClick={insertLink}
                title={button.title}
              >
                <i className={button.icon}></i>
              </button>
            );
          }

          if (button.custom === 'image') {
            return (
              <button
                key={index}
                type="button"
                className="btn btn-sm btn-outline-warning"
                onClick={insertImage}
                title={button.title}
              >
                <i className={button.icon}></i>
              </button>
            );
          }

          return (
            <button
              key={index}
              type="button"
              className="btn btn-sm btn-outline-warning"
              onClick={() => execCommand(button.command)}
              title={button.title}
            >
              <i className={button.icon}></i>
            </button>
          );
        })}

        {/* Source Toggle */}
        <div className="ms-auto">
          <button
            type="button"
            className={`btn btn-sm ${
              showSource ? 'btn-warning' : 'btn-outline-warning'
            }`}
            onClick={toggleSource}
            title="Alternar vista de código"
          >
            <i className="bi bi-code-slash"></i>
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="editor-container border border-secondary position-relative">
        {showSource ? (
          <textarea
            className="source-editor form-control bg-dark text-light border-0"
            style={{ 
              height: height,
              fontFamily: 'Courier New, monospace',
              fontSize: '14px',
              resize: 'vertical'
            }}
            defaultValue={content}
            placeholder="Código HTML..."
          />
        ) : (
          <div
            ref={editorRef}
            className="editor-content p-3 bg-dark text-light"
            contentEditable
            suppressContentEditableWarning
            style={{ 
              height: height,
              overflow: 'auto',
              outline: 'none',
              lineHeight: '1.5'
            }}
            onInput={handleContentChange}
            onKeyDown={handleKeyDown}
            dangerouslySetInnerHTML={{ __html: content }}
            placeholder={placeholder}
          />
        )}
        
        {/* Placeholder overlay */}
        {!showSource && !content && (
          <div className="position-absolute top-0 start-0 p-3 text-muted user-select-none pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>

      {/* Character Count */}
      <div className="d-flex justify-content-between align-items-center p-2 bg-dark border border-secondary border-top-0 small text-muted">
        <div>
          Caracteres: {content.replace(/<[^>]*>/g, '').length}
        </div>
        <div>
          Palabras: {content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length}
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageUpload}
      />

      <style jsx>{`
        .rich-text-editor {
          border-radius: 0.375rem;
          overflow: hidden;
        }
        
        .toolbar {
          border-top-left-radius: 0.375rem;
          border-top-right-radius: 0.375rem;
        }
        
        .editor-content:focus {
          box-shadow: inset 0 0 0 2px rgba(255, 193, 7, 0.25);
        }
        
        .editor-content p {
          margin-bottom: 0.5rem;
        }
        
        .editor-content h1, .editor-content h2, .editor-content h3, .editor-content h4 {
          color: #ffc107;
          margin-bottom: 0.5rem;
        }
        
        .editor-content blockquote {
          border-left: 4px solid #ffc107;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
        }
        
        .editor-content pre {
          background-color: #1a1a1a;
          padding: 1rem;
          border-radius: 0.25rem;
          overflow-x: auto;
        }
        
        .editor-content a {
          color: #ffc107;
          text-decoration: underline;
        }
        
        .editor-content img {
          max-width: 100%;
          height: auto;
          margin: 0.5rem 0;
        }
        
        .editor-content ul, .editor-content ol {
          padding-left: 2rem;
          margin-bottom: 1rem;
        }
        
        .source-editor:focus {
          box-shadow: inset 0 0 0 2px rgba(255, 193, 7, 0.25);
        }
        
        .pointer-events-none {
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;