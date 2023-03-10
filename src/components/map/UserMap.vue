<script lang="ts" setup>
import { PointLayer, Popup, Scene } from '@antv/l7'
import { GaodeMap } from '@antv/l7-maps'
import cityData from '~/data/cityData.json'
import { throttle } from '~/utils/events'
const map = ref<HTMLDivElement>()
const mapContainer = ref<HTMLDivElement>()

const scene = shallowRef<Scene>()

onMounted(() => {
  if (map.value === undefined)
    return
  scene.value = new Scene({
    id: map.value,
    map: new GaodeMap({
      pitch: 0,
      style: 'dark',
      mapStyle: 'amap://styles/darkblue',
      center: [113.631419, 34.753439],
      zoom: 5,
      // token: 'ced0d726cd96553ba8b5b3521671aaf4',
    }),
  })
  scene.value.on('loaded', () => {
    const { code = 1, data = { cityList: [] } } = cityData
    const { cityList } = data
    if (code !== 0)
      return
    const cityListData = cityList.sort((a, b) => {
      return a.communityCount - b.communityCount
    }).map((t, index) => {
      let res: typeof t & { count: number }
      if (t.communityCount === 1) {
        res = {
          ...t,
          count: 1,
        }
      }

      else {
        res = {
          ...t,
          count: 101 + index * 0.1,
        }
      }
      return res
    })
    const pointLayer = new PointLayer({ zIndex: 1 })
      .source(cityListData, {
        parser: {
          type: 'json',
          x: 'longitude',
          y: 'latitude',
        },
      })
      .shape('circle')
      .animate(true)
      .size('count', [0, 45])
      .color('count', [
        '#3CA0FF',
        '#3CA0FF',
        '#3CA0FF',
      ])
      .active(true)
      .style({
        opacity: 0.5,
        strokeWidth: 0,
      })
    pointLayer.on('mousemove', throttle(
      ({ feature, lngLat }) => {
        const { cityName, openUserCount, iotDoorControlCount, communityCount } = feature
        const popup = new Popup({
          offsets: [0, 0],
          closeButton: false,
          style: 'dark',
        })
          .setLnglat(lngLat)
        // TODO 抽离Popup组件 setDomContent
          .setHTML(`<span>区域 &nbsp; ${cityName}</span><br>
                  <span>开门用户 &nbsp; ${openUserCount}</span></br>
                  <span>设备总数  &nbsp; ${iotDoorControlCount}</span></br>
                  <span>小区总数 &nbsp; ${communityCount}</span></br>
                  `)
        scene.value?.addPopup(popup)
      }, 500, { leading: true, trailing: false }),
    )
    scene.value?.addLayer(pointLayer)
  })
})
</script>

<template>
  <section ref="mapContainer" flex>
    <div ref="map" />
  </section>
</template>

<style  scoped>

</style>
