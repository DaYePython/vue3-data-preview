<script lang="ts" setup>
import { Popup } from '@antv/l7'
import { storeToRefs } from 'pinia'
import { render } from 'vue'
import useUserMap from './useUserMap'
// import PopupData from './PopupData.vue'
import { usePointLayer } from '~/composables'
import { CITY_DATE_LAYER } from '~/constants/map'
import type { ICityList } from '~/stores/useCityData'
import { useCityData } from '~/stores/useCityData'

const map = ref<HTMLDivElement>()
const mapContainer = ref<HTMLDivElement>()

const cityDataStore = useCityData()
const { cityList } = storeToRefs(cityDataStore)
// const popupData = shallowRef<any>({
//   cityName: '',
//   openUserCount: 0,
//   iotDoorControlCount: 0,
//   communityCount: 0,
//   cityCode: '',
// })

async function handleMouseMove({ feature, lngLat }: { feature: ICityList; lngLat: [number, number] }) {
  const { cityCode, cityName, openUserCount, iotDoorControlCount, communityCount } = feature
  const popupData = {
    cityName,
    openUserCount,
    iotDoorControlCount,
    communityCount,
    cityCode,
  }
  const div = document.createElement('div')
  render(h(defineAsyncComponent({
  // 加载函数
    loader: () => import('./PopupData.vue'),

    // 加载异步组件时使用的组件
    loadingComponent: h('加载中...'),
    // 展示加载组件前的延迟时间，默认为 200ms
    delay: 200,

    // 加载失败后展示的组件
    errorComponent: h('错误处理') as any,
    // 如果提供了一个 timeout 时间限制，并超时了
    // 也会显示这里配置的报错组件，默认值是：Infinity
    timeout: 3000,
  }), popupData), div)
  await nextTick()
  const popup = new Popup({
    offsets: [0, 0],
    closeButton: false,
    className: 'city-popup',
  })
    .setLnglat(lngLat)
    // DONE 抽离Popup组件 setDomContent
    .setHTML(div.firstChild as HTMLElement)
  // await nextTick()
  return popup
}

onMounted(async () => {
  if (map.value === undefined)
    return
  const { initMap, onLoad, addLayer, addPopup } = useUserMap(map as Ref<HTMLDivElement>)
  onLoad(async () => {
    await cityDataStore.getCityData()
    const { pointLayer, onMousemove } = usePointLayer<ICityList[] | undefined>(CITY_DATE_LAYER, cityList)
    onMousemove(async (e) => {
      const popup = await handleMouseMove(e as any)
      addPopup(popup)
    })
    addLayer(pointLayer.value)
  })
  await initMap()
})
</script>

<template>
  <section ref="mapContainer" flex>
    <div ref="map" />
  </section>
</template>

<style  scoped>

</style>
