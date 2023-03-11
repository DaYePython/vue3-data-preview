import { PointLayer } from '@antv/l7'
import type { MaybeComputedRef } from '@vueuse/core'
import { throttle } from '~/utils'

export default <T>(name: string, data: MaybeComputedRef<T>) => {
  const onMousemove = createEventHook<unknown>()
  const pointLayer = shallowRef(new PointLayer({ name, zIndex: 1 })
    .source(unref(data), {
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
    }))

  pointLayer.value.on('mousemove', throttle((e: unknown) => {
    onMousemove.trigger(e)
  }, 500, { leading: true, trailing: false }))
  watchEffect(() => {
    pointLayer.value.setData(unref(data))
  })

  return {
    pointLayer,
    data,
    onMousemove: onMousemove.on,
  }
}
