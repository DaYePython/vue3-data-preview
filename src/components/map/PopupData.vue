<script setup lang="ts">
import usePopupData from './usePopupData'

const {
  openUserCount,
  cityName,
  iotDoorControlCount,
  communityCount,
} = definePropsRefs<
  {
    cityName: String
    openUserCount: Number
    iotDoorControlCount: Number
    communityCount: Number
    cityCode: String
  }>()

// await nextTick()
const {
  iotPercentage,
  openPercentage,
  communityPercentage,
} = usePopupData(
  iotDoorControlCount as ComputedRef<number>,
  openUserCount as ComputedRef<number>,
  communityCount as ComputedRef<number>,
)
onMounted(() => {
  drawPopover([openPercentage, iotPercentage, communityPercentage])
})
function drawPopover(arrList: Array<ComputedRef<number>>) {
  const canvas = document.getElementById('cityPopover') as HTMLCanvasElement
  const ctx = canvas.getContext('2d')
  if (!ctx)
    return
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  // 填充画布
  ctx.lineWidth = 8
  let beginDeg = Math.PI * 1.5
  let endDeg = Math.PI * 1.5
  const [openPercentage, iotPercentage, communityPercentage] = arrList.map(unref)
  const data = [{
    id: 'open',
    radius: 45,
    value: openPercentage,
    percentageData: [{ color: '#3aacf3', value: openPercentage }, { color: 'rgba(183, 226, 255, 0.3)', value: 1 - openPercentage }],
  }, {
    id: 'iot',
    radius: 30,
    value: iotPercentage,
    percentageData: [{ color: '#5ad8a6', value: iotPercentage }, { color: 'rgba(183, 226, 255, 0.3)', value: 1 - iotPercentage }],
  }, {
    id: 'community',
    radius: 15,
    value: communityPercentage,
    percentageData: [{ color: '#ff6a00', value: communityPercentage }, { color: 'rgba(183, 226, 255, 0.3)', value: 1 - communityPercentage }],
  }]
  data.forEach((t, index) => {
    t.percentageData.forEach((l) => {
      endDeg = beginDeg + (2 * Math.PI * l.value)
      ctx.beginPath()
      ctx.strokeStyle = l.color
      ctx.arc(60, 60, t.radius, beginDeg, endDeg, false)
      ctx.stroke()
      beginDeg = endDeg
      ctx.closePath()

      ctx.moveTo(0, 0)// 移动笔触到原点
      ctx.fillStyle = 'white'// 文本颜色
      ctx.font = '12px normal '
      ctx.textAlign = 'right'
      ctx.fillText(`${(t.value * 100).toFixed(1)}%`, 55, (index + 1) * 16)
    })
  })
}

watchPostEffect(() => {
  drawPopover([openPercentage, iotPercentage, communityPercentage])
})

function formaterNumber(num: Number): string {
  return new Intl.NumberFormat('en-US').format(num)
}

// debugger
</script>

<template>
  <transition>
    <section text-white>
      <h1 text="base">
        {{ cityName }}
      </h1>
      <!-- <VChart id="gauge" class="w-120px !min-h-120px !h-120px" type="gauge" :options="ringDataOptions" /> -->
      <div flex justify-center item-center>
        <canvas id="cityPopover" ref="cityPopover" w-120px h-120px width="120" height="120" />
      </div>
      <section class="tips space-y-xs" children-flex children-justify-center children-items-center>
        <div class="before:bg-[#3AACF3]">
          开门用户{{ formaterNumber(openUserCount) }}
        </div>
        <div class="before:bg-[#5AD8A6]">
          设备总数 {{ formaterNumber(iotDoorControlCount) }}
        </div>
        <div class="before:bg-[#FF6A00]">
          小区总数{{ formaterNumber(communityCount) }}
        </div>
      </section>
    </section>
  </transition>
</template>

<style scoped>

</style>

<style>
.city-popup{
  width: 150px;
}
.city-popup .l7-popup-content{
  width: 250px;
  /* height: 125px; */
  background: rgba(34, 86, 178, 0.7);
  border-radius: 6px;
  border: 1px solid rgba(56, 155, 255, 0.25);
}
.city-popup .l7-popup-tip{
  border-bottom-width: 0;
  border-top-color: rgba(34, 86, 178, 0.7);
}

.city-popup .tips > *::before{
  content: " ";
  width: 8px;
  height: 8px;
  display: inline-block;
  margin-right: 5px;
  border-radius: 50%;
}
.city-popup .tips:first-child::before{
  background: #3AACF3;
}
.city-popup .tips:nth-child(2)::before{
  background: #5AD8A6;
}
.city-popup .tips:nth-child(3)::before{
  background: #FF6A00;
}
</style>
