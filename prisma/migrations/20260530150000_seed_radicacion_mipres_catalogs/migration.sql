-- Seed initial Radicacion MIPRES catalogs and register the module in the sidebar.

INSERT INTO "radicacion_mipres_status" ("code", "label", "display_order", "updated_at") VALUES
  ('ENTREGADO',       'Entregado',       1, CURRENT_TIMESTAMP),
  ('ENTREGA_PARCIAL', 'Entrega parcial', 2, CURRENT_TIMESTAMP),
  ('PENDIENTE',       'Pendiente',       3, CURRENT_TIMESTAMP)
ON CONFLICT ("code") DO NOTHING;

INSERT INTO "radicacion_mipres_substatus" ("parent_status_code", "code", "label", "display_order", "updated_at") VALUES
  ('ENTREGADO',       'ENTREGADO',         'Entregado',         1, CURRENT_TIMESTAMP),
  ('ENTREGA_PARCIAL', 'POR_PEDIR',         'Por pedir',         1, CURRENT_TIMESTAMP),
  ('ENTREGA_PARCIAL', 'PEDIDO_REALIZADO', 'Pedido realizado',  2, CURRENT_TIMESTAMP),
  ('ENTREGA_PARCIAL', 'LISTO',             'Listo',             3, CURRENT_TIMESTAMP),
  ('PENDIENTE',       'POR_PEDIR',         'Por pedir',         1, CURRENT_TIMESTAMP),
  ('PENDIENTE',       'PEDIDO_REALIZADO', 'Pedido realizado',  2, CURRENT_TIMESTAMP),
  ('PENDIENTE',       'LISTO',             'Listo',             3, CURRENT_TIMESTAMP)
ON CONFLICT ("parent_status_code", "code") DO NOTHING;

INSERT INTO "modules" ("id", "name", "label", "icon", "display_order", "is_active", "is_admin_only", "updated_at") VALUES
  (gen_random_uuid()::text, 'radicacion-mipres', 'Radicacion MIPRES', 'ClipboardList', 7, true, false, CURRENT_TIMESTAMP)
ON CONFLICT ("name") DO NOTHING;
