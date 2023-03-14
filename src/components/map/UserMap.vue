<script lang="ts" setup>
import { Popup } from '@antv/l7'
import { storeToRefs } from 'pinia'
import useUserMap from './useUserMap'
// import PopupData from './PopupData.vue'
// import { usePointLayer } from '~/composables'
import { CITY_DATE_LAYER, POPUP_ELEMENT_ID } from '~/constants/map'
import type { ICityList } from '~/stores/useCityData'
import { useCityData } from '~/stores/useCityData'

const map = ref<HTMLDivElement>()
const mapContainer = ref<HTMLDivElement>()

const cityDataStore = useCityData()
const { cityList } = storeToRefs(cityDataStore)
const popupData = shallowRef<any>({
  cityName: '',
  openUserCount: 0,
  iotDoorControlCount: 0,
  communityCount: 0,
  cityCode: '',
})

async function handleMouseMove({ feature, lngLat }: { feature: ICityList; lngLat: [number, number] }) {
  const { cityCode, cityName, openUserCount, iotDoorControlCount, communityCount } = feature
  popupData.value = {
    cityName,
    openUserCount,
    iotDoorControlCount,
    communityCount,
    cityCode,
  }
  const popup = new Popup({
    offsets: [0, 0],
    closeButton: false,
    className: 'city-popup',
    html: document.getElementById(POPUP_ELEMENT_ID)!,
  })
    .setLnglat(lngLat)
    // DONE 抽离Popup组件 setDomContent
    // .setHTML(div.firstChild as HTMLElement)
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
  <!-- <div id="popupElementId" /> -->
  <PopupData v-bind="popupData" />
</template>

<style  scoped>

</style>
