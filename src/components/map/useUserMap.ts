import { GaodeMap, Scene } from '@antv/l7'
import type { ILayer, IPopup } from '@antv/l7'
import type { MaybeComputedElementRef } from '@vueuse/core'

export default function useUserMap(mapRef: MaybeComputedElementRef<HTMLDivElement>) {
  const scene = shallowRef<Scene>()
  const nameList = ref<Array<String>>([])
  const onLoad = createEventHook()
  const initMap = async () => {
    return new Promise((resolve) => {
      scene.value = new Scene({
        id: resolveUnref(mapRef) as HTMLDivElement,
        logoVisible: false,
        preserveDrawingBuffer: true,
        map: new GaodeMap({
          pitch: 0,
          style: 'dark',
          mapStyle: 'amap://styles/darkblue',
          center: [113.631419, 34.753439],
          minZoom: 3,
          zoom: 5,
          maxZoom: 8,
          rotateEnable: false,
          // token: 'ced0d726cd96553ba8b5b3521671aaf4',
        }),
      })
      scene.value.on('loaded', async (...params) => {
        onLoad.trigger(params)
        resolve(params)
      })
    })
  }
  const addLayer = (layer: ILayer) => {
    if (!scene.value)
      throw new Error('scene is not init')

    nameList.value.push(layer.name)
    scene.value?.addLayer(layer)
  }
  const addPopup = (popup: IPopup) => {
    if (!scene.value)
      throw new Error('scene is not init')
    scene.value?.addPopup(popup)
  }
  return {
    scene,
    addPopup,
    addLayer,
    initMap,
    onLoad: onLoad.on,
  }
}
