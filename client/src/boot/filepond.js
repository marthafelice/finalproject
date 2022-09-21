import {boot} from 'quasar/wrappers';

// Import Vue FilePond
import vueFilePond from 'vue-filepond';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';

// Import FilePond plugins
// Please note that you need to install these plugins separately

// Import image preview plugin styles
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';

// Import the plugin styles
import 'filepond-plugin-image-edit/dist/filepond-plugin-image-edit.css';


// Import image preview and file type validation plugins
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
import FilePondPluginImageEdit from 'filepond-plugin-image-edit';

// Create component
const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
  FilePondPluginImageExifOrientation,
  FilePondPluginImageCrop,
  FilePondPluginImageResize,
  FilePondPluginImageTransform,
  FilePondPluginImageEdit
);

// Please note that for the image edit plugin to function
// we also need to register the image preview plugin.


/*FilePond.setOptions({
  server: {


    ,
    fetch: (url, load, error, progress, abort, /!*headers*!/) => {
      // Should get a file object from the URL here
      // ...

      // Can call the error method if something is wrong, should exit after
      error('oh my goodness');

      // Can call the header method to supply FilePond with early response header string
      // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/getAllResponseHeaders
      // headers(headersString);

      // Should call the progress method to update the progress to 100% before calling load
      // (computable, loadedSize, totalSize)
      progress(true, 0, 1024);

      // Should call the load method with a file object when done
      // load(file);

      // Should expose an abort method so the request can be cancelled
      return {
        abort: () => {
          // User tapped abort, cancel our ongoing actions here

          // Let FilePond know the request has been cancelled
          abort();
        },
      };
    },
  },
});*/

export default boot(({app}) => {

  app.component('filepond', FilePond);
});
