<template>
  <div class="c-tabs-county" :style="{ gap }">
    <div
      :class="['tab', 'default', { active: modelValue == i.value }]"
      v-for="i in tabsData"
      :style="{
        width: width
      }"
      :key="i.label"
      @click="setActive(i.value)"
    >
      {{ i.label }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  tabsData: tabsDataType[]
  modelValue?: string | number
  width?: string
  gap?: string
}

interface tabsDataType {
  label: string
  value: number
}
withDefaults(defineProps<Props>(), {
  modelValue: '1',
  gap: '35px'
})
const emits = defineEmits(['update:modelValue'])
const setActive = (val: string | number) => {
  emits('update:modelValue', val)
}
</script>

<style scoped lang="scss">
.c-tabs-county {
  display: flex;
  align-items: center;
  gap: 35px;
  justify-content: center;
  .tab {
    padding: 2px 5px;
    font-size: 24px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: #daf2ff;
    cursor: pointer;
    text-align: center;
    box-sizing: border-box;
    border-radius: 4px;
  }
  .default {
    background-color: #061944;
    border: 2px solid #1a4a90;
    color: #629bf2;
  }
  .active {
    background-color: #0a275b;
    border: 2px solid #3489f2;
    color: #daf2ff;
  }
}
</style>
