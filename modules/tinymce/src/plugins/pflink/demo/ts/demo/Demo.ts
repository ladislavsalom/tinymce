declare let tinymce: any;

tinymce.init({
  selector: 'textarea.tinymce',
  plugins: 'pflink code',
  toolbar: 'link code',
  menubar: 'view insert tools custom',
  link_class_list: [
    { title: 'Show as Link', value: '' },
    { title: 'Show as Primary Button', value: 'prim-button' },
  ],
  link_title: false,
  menu: {
    custom: { title: 'Custom', items: 'pflink unlink openlink' }
  },
  height: 600,
  setup: (ed) => {
    ed.on('init', () => {
      ed.setContent('<h1>Heading</h1><p><a name="anchor1"></a>anchor here test aasss.');
    });
  }
});

export { };
