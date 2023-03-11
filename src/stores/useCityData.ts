import { acceptHMRUpdate, defineStore } from 'pinia'
import cityDataResponse from '~/data/cityData.json'
import { sleep } from '~/utils'

export interface ICityInfo {
  id: string
  name: string
  value: string
  valueArr: string
  type: string
  percentage: string
}

export interface ICityData {
  cityCount: number
  cityCountPercentage: string
  cityCountUpType: number
  cityList: ICityList[]
  communityCount: number
  communityCountPercentage: string
  communityCountUpType: number
  iotdoorControlCount: number
  iotdoorControlCountPercentage: string
  iotdoorControlCountUpType: number
  userCommunity: number
  userInfoUpdateTime: string
}

export interface ICityList {
  cityCode: string
  cityName: string
  communityCount: number
  iotDoorControlCount: number
  latitude: string
  longitude: string
  openUserCount: number
  count?: number
}

export const useCityData = defineStore('cityData', () => {
  const cityData = shallowRef<ICityData>()
  const getCityData = async () => {
    await sleep(500)
    const { data, code } = cityDataResponse
    if (code !== 0)
      return {}

    cityData.value = data
    return data
  }
  // const cityCount = computed(() => cityData.value?.cityCount)
  // const cityInfoList = computed(() => {})
  // const iotdoorControlCount = computed(() => cityData.value?.iotdoorControlCount)
  // const userCommunity = computed(() => cityData.value?.userCommunity)
  const communityCount = computed(() => cityData.value?.communityCount)
  const cityList = computed(() =>
    cityData.value?.cityList
      .sort((a, b) => {
        return a.communityCount - b.communityCount
      })
      .map<ICityList>((t, index) => {
        if (t.communityCount === 1)
          t.count = 100
        else
          t.count = 101 + index * 0.1
        return t
      }))

  return {
    cityData,
    cityList,
    communityCount,
    getCityData,
  }
})
// export const useCityDataWithout(App){
//   return
// }

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useCityData, import.meta.hot))
