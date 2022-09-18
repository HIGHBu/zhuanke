<script setup lang="ts">
  import { World, Model, ThirdPersonCamera, types, Find, Plane, LingoEditor, Cube} from "lingo3d-vue"
  import { ref } from "vue"
  
  const characterPose = ref("idle")
  const characterRef = ref<types.Model>()
  const galleryScale = 20
  const characterScale = 0.2
  const position = ref({x: 0, y: 0, z: 0})

  const handleClick = (ev:types.MouseEvent) => {
    if (ev.distance >= 200) {
      let model=characterRef.value
      if (!model) return;
      position.value = ev.point
      characterPose.value = "walking"
    }
  }
  const handleMoveToEnd = () => {
    characterPose.value = "idle"
  }
</script>

<template>
  <World>
    <Model
      name="gallery"
      src="new_gallery.glb"
      :scale="galleryScale"
      physics="map"
      @click="handleClick"
      :y="600"
    >
      <!-- <Find
        name="ground"
      /> -->
    </Model> 
    <ThirdPersonCamera
      :active="true"
      mouse-control="drag"
      :lock-target-rotation="false"
      :min-polar-angle="90" 
      :max-polar-angle="110"
    >
      <Model
        name="character"
        src="basic/src.glb"
        physics="character"
        ref="characterRef"
        :x="0"
        :y="-50"
        :z="0"
        :scale="characterScale"
        :animations="{ idle : 'basic/idle.glb', walking: 'basic/walk.glb' }"
        :animation="characterPose"
        :look-to="[position.x, undefined, position.z, 0.1]"
        :move-to="[position.x, undefined, position.z, 5]"
        @move-to-end="handleMoveToEnd"
      />
    </ThirdPersonCamera>
    <Cube
      v-if="characterPose=='walking'"
      color="red"
      :x="position.x"
      :y="position.y"
      :z="position.z"
      >
    </Cube>
  </World>
  <!-- <LingoEditor></LingoEditor> -->
</template>