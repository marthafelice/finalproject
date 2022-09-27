<template>
  <div v-bind="attrs['div-attrs']">
    <q-no-ssr>
      <filepond
        ref="pond"
        v-bind="attrs"
      />
    </q-no-ssr>
  </div>
</template>

<script setup>
  import {create} from './doka.esm.min';
  import './doka.min.css';
  import {computed, onBeforeUpdate, ref, useAttrs} from 'vue';
  import {models} from 'feathers-pinia';
  import useUploads from 'stores/services/uploads';

  const $emit = defineEmits(['update:ModelValue','upload-success','upload-error','revert-success','revert-error']);

  const pond = ref(null);


  onBeforeUpdate(() => {
    pond.value = null;
  });

  function blobToBase64(blob) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }

  const attrs = computed(() => {
    const customAttrs = useAttrs();
    const dokaAttrs = customAttrs?.dokaAttrs ? customAttrs?.dokaAttrs : {};
    return {
      imageEditEditor:create({
        // doka options here,
        cropMask: (root, setInnerHTML) => {
          // https://pqina.nl/doka/docs/patterns/api/doka-instance/#setting-the-crop-mask
          setInnerHTML(root, `
                  <mask id="my-mask">
                      <rect x="0" y="0" width="100%" height="100%" fill="white"/>
                      <circle cx="50%" cy="50%" r="50%" fill="black"/>
                  </mask>
                  <rect fill="rgba(255,255,255,.3125)" x="0" y="0" width="100%" height="100%" mask="url(#my-mask)"/>
                  <circle cx="50%" cy="50%" r="50%" fill="transparent" stroke-width="1" stroke="#fff"/>
              `);
        },
        cropAspectRatioOptions: [
          {
            label: 'Free',
            value: null,
          },
          {
            label: 'Square',
            value: 1,
          },
          {
            label: 'Landscape',
            value: .75,
          },
          {
            label: 'Portrait',
            value: 1.25,
          },
        ],
        ...dokaAttrs
      }),
      'allow-multiple': false,
      server: {
        process: processUpload,
        revert: revertUpload,
      },
      labelIdle: 'Drag & Drop your picture or <span class="filepond--label-action">Browse</span>',
      imagePreviewHeight: 170,
      imageCropAspectRatio: '1:1',
      imageResizeTargetWidth: 200,
      imageResizeTargetHeight: 200,
      stylePanelLayout: 'compact circle',
      styleLoadIndicatorPosition: 'center bottom',
      styleProgressIndicatorPosition: 'right bottom',
      styleButtonRemoveItemPosition: 'left bottom',
      styleButtonProcessItemPosition: 'right bottom',
      dropValidation:true,
      instantUpload:true,
      allowImagePreview: true,
      'allow-reorder': true,
      'div-attrs': {
        style: 'width:400px; height:auto;',
        ...customAttrs['div-attrs']
      },
      ...customAttrs,
    };
  });

  async function processUpload(fieldName, file, metadata, load, error, progress, abort) {
    try {
      progress(true, 0, 1);
      const uri = await blobToBase64(file);
      const uploadsToStore = new models.api.Uploads({uri});
      const result = await uploadsToStore.save();
      const url = `http://localhost:3030/images/${result.id}`;
      console.log({url});
      load(url);
      $emit('upload-success', url);
    } catch (e) {
      $emit('upload-error', e);
    }
    return {
      abort: () => {
        abort();
        // uploadTask.cancel();
      },
    };
  }

  async function revertUpload(uniqueFileId, load/* error*/) {
    try {
      const uploadsStore = useUploads();
      const result = await uploadsStore.remove(uniqueFileId);
      $emit('revert-success', result);
      load();
    } catch (e) {
      $emit('revert-error', e);
    }
  }

</script>

<style scoped>

</style>
