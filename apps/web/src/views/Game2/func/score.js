// Función para actualizar la puntuación del jugador
export function updateScore(rowsCleared, score) {
  // Definir la puntuación base para cada fila eliminada
  const baseScore = 100

  // Calcular la puntuación total basada en la cantidad de filas eliminadas
  const totalScore = score + rowsCleared * baseScore

  return totalScore
}
