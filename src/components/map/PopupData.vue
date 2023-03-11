<script setup lang="ts">
const popupRef = ref<HTMLDivElement>()
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

defineExpose({
  popupRef,
})
</script>

<template>
  <section ref="popupRef">
    <span>区域 &nbsp; {{ cityName }}</span><br>
    <span>开门用户 &nbsp; {{ openUserCount }}</span><br>
    <span>设备总数  &nbsp; {{ iotDoorControlCount }}</span><br>
    <span>小区总数 &nbsp; {{ communityCount }}</span><br>
  </section>
</template>

<style scoped>

</style>

<style>

</style>
