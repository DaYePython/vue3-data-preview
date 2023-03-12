import type { MaybeComputedRef } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useCityData } from '~/stores/useCityData'

export default function (iotDoorControlCount: MaybeComputedRef<number>, openUserCount: MaybeComputedRef<number>, communityCount: MaybeComputedRef<number>) {
  const { iotdoorControlCount: allIotdoorControlCount, userCommunity: allUserComunity, communityCount: allCommunityCount } = storeToRefs(useCityData())

  function handlePrecentage(left: number, right: number) {
    try {
      const precentage = +(left / right)
      return Math.max(0.0001, precentage)
    }
    catch (e) {
      console.error(e)
      return 0
    }
  }

  const iotPercentage = computed(() => {
    return +handlePrecentage(resolveUnref(iotDoorControlCount), allIotdoorControlCount.value as number)
  })
  const openPercentage = computed(() => {
    return +handlePrecentage(resolveUnref(openUserCount), allUserComunity.value as number)
  })
  const communityPercentage = computed(() => {
    return +handlePrecentage(resolveUnref(communityCount), allCommunityCount.value as number)
  })
  return {
    iotPercentage,
    openPercentage,
    communityPercentage,
  }
}
