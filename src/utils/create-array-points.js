const point = (x, y, z = 0) => ({ x, y, z })

export default {
  cube: length => {
    const points = []
    const size = Math.cbrt(length)
    for (let z = 0; z < size; z++) {
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          points.push(point(
            x - (size - 1) / 2,
            y - (size - 1) / 2,
            z - (size - 1) / 2
          ))
        }
      }
    }
    return points
  },

  plane: length => {
    const points = []
    const size = Math.sqrt(length)
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        points.push(point(x - (size - 1) / 2, y - (size - 1) / 2))
      }
    }
    return points
  }
}
