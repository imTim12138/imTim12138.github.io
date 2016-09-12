var editor = document.getElementById('editor');
MarkdownIME.Enhance(editor);

//optional: enable Tex Formula support
MarkdownIME.Renderer.inlineRenderer.addRule(new MarkdownIME.Addon.MathAddon())
