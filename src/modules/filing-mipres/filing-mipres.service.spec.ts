// Escenarios observables — FilingMipresService.
describe('FilingMipresService.scheduleIdsWithDeliveries', () => {
  it.todo('devuelve los schedule_id (string) con >=1 entrega en delivery_mipres para la prescripción')
  it.todo('excluye scheduleId de programaciones anuladas que no tienen entregas')
  it.todo('devuelve [] si la prescripción no tiene entregas')
})

// Tras una entrega SISPRO exitosa: persiste delivery_id y delivery_date en el radicado del direccionamiento.
describe('FilingMipresService.setDeliveryByRouting', () => {
  it.todo('actualiza delivery_id (IdEntrega) y delivery_date (fecEntrega) del radicado con routing_id dado')
  it.todo('no afecta otros radicados (solo el del routing_id que coincide; siempre es uno)')
})
