export class QuillConfig{
    static getQuillConfig() {
        return {
            toolbar: {
              container: [
                [
                  'bold', 'italic', { list: 'ordered' }, { list: 'bullet' }, { undo: 'undo' }, { redo: 'redo' }
                ],
                ['emoji']
              ],
              handlers: { 
                redo() { this.quill.history.redo(); }, 
                undo() { this.quill.history.undo(); } ,
                'emoji': function() {}
              }
            },
            // "emoji-toolbar": true,
            // "emoji-textarea": true,
            // "emoji-shortname": true,
            history: { delay: 2000, maxStack: 500, userOnly: true }
        };
    }

    static getCommentQuillConfig() {
      return {
          toolbar:false,
          // "emoji-toolbar": true,
          // "emoji-textarea": true,
          // "emoji-shortname": true,
          history: { delay: 2000, maxStack: 500, userOnly: true }
      };
  }
}