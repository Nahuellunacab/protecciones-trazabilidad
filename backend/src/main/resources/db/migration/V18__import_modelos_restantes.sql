INSERT INTO modelo (
    nombre,
    tipo_id,
    marca_id,
    tension_desde,
    tension_hasta,
    tipo_tension
)
VALUES

('KCGG110',8,(SELECT id FROM marca WHERE nombre='ALSTOM'),48,250,'VCC'),
('KCGG122',8,(SELECT id FROM marca WHERE nombre='ALSTOM'),48,250,'VCC'),

('REF615',8,(SELECT id FROM marca WHERE nombre='ABB'),48,250,'VCC'),

('TDLCR32',7,(SELECT id FROM marca WHERE nombre='ALSTOM'),90,120,'VCC'),
('TDLCE32',7,(SELECT id FROM marca WHERE nombre='ALSTOM'),90,120,'VCC'),

('KCGG140',8,(SELECT id FROM marca WHERE nombre='ALSTOM'),48,250,'VCC'),

('MICOM P442',6,(SELECT id FROM marca WHERE nombre='SCHNEIDER'),48,110,'VCC'),
('MICOM P442',6,(SELECT id FROM marca WHERE nombre='AREVA'),48,110,'VCC'),

('MICOM P521',7,(SELECT id FROM marca WHERE nombre='SCHNEIDER'),24,250,'VCC'),

('MICOM P141',8,(SELECT id FROM marca WHERE nombre='AREVA'),48,125,'VCC'),

('MICOM P921',9,(SELECT id FROM marca WHERE nombre='SCHNEIDER'),24,250,'VCC'),

('MICOM P923',9,(SELECT id FROM marca WHERE nombre='AREVA'),48,150,'VCC'),

('MICOM P125B',8,(SELECT id FROM marca WHERE nombre='SCHNEIDER'),24,250,'VCC'),

('MICOM P120B',8,(SELECT id FROM marca WHERE nombre='SCHNEIDER'),24,250,'VCC'),

('MICOM P543',7,(SELECT id FROM marca WHERE nombre='AREVA'),48,110,'VCC'),

('MICOM P941',9,(SELECT id FROM marca WHERE nombre='AREVA'),110,250,'VCC'),

('MICOM P541',7,(SELECT id FROM marca WHERE nombre='AREVA'),110,250,'VCC'),

('REL561',6,(SELECT id FROM marca WHERE nombre='ABB'),110,125,'VCC'),

('REL511',6,(SELECT id FROM marca WHERE nombre='ABB'),110,125,'VCC'),

('7SA511',6,(SELECT id FROM marca WHERE nombre='SIEMENS'),100,125,'VCC'),

('7VK512',9,(SELECT id FROM marca WHERE nombre='SIEMENS'),60,125,'VCC'),

('7UT633',7,(SELECT id FROM marca WHERE nombre='SIEMENS'),110,250,'VCC'),

('7SJ62',8,(SELECT id FROM marca WHERE nombre='SIEMENS'),24,48,'VCC'),

('7SJ602',8,(SELECT id FROM marca WHERE nombre='SIEMENS'),24,48,'VCC'),
('7SJ602',8,(SELECT id FROM marca WHERE nombre='SIEMENS'),110,250,'VCC'),

('7SJ500',8,(SELECT id FROM marca WHERE nombre='SIEMENS'),60,125,'VCC'),

('7SD61',7,(SELECT id FROM marca WHERE nombre='SIEMENS'),24,48,'VCC'),

('7SD765',7,(SELECT id FROM marca WHERE nombre='SIEMENS'),110,125,'VCC'),

('7SD502',7,(SELECT id FROM marca WHERE nombre='SIEMENS'),24,48,'VCC'),
('7SD502',7,(SELECT id FROM marca WHERE nombre='SIEMENS'),60,125,'VCC'),

('7SJ80',8,(SELECT id FROM marca WHERE nombre='SIEMENS'),60,250,'VCC'),

('7SD522',7,(SELECT id FROM marca WHERE nombre='SIEMENS'),110,250,'VCC'),

('7SA522',6,(SELECT id FROM marca WHERE nombre='SIEMENS'),110,250,'VCC'),

('RED670',7,(SELECT id FROM marca WHERE nombre='ABB'),90,250,'VCC'),

('MICOM P120A',8,(SELECT id FROM marca WHERE nombre='AREVA'),48,250,'VCC'),

('7SJ511',8,(SELECT id FROM marca WHERE nombre='SIEMENS'),60,125,'VCC'),

('3425A',9,(SELECT id FROM marca WHERE nombre='BECKWITH'),110,250,'VCC'),

('REJ521',8,(SELECT id FROM marca WHERE nombre='ABB'),48,220,'VCC'),

('KVTR100',9,(SELECT id FROM marca WHERE nombre='ALSTOM'),40,250,'VCC'),

('REX521',8,(SELECT id FROM marca WHERE nombre='ABB'),110,220,'VCC'),

('REJ525',8,(SELECT id FROM marca WHERE nombre='ABB'),48,220,'VCC'),

('MICOM P933',9,(SELECT id FROM marca WHERE nombre='AREVA'),48,250,'VCC'),

('MICOM P633',7,(SELECT id FROM marca WHERE nombre='SCHNEIDER'),60,250,'VCC'),
('MICOM P633',7,(SELECT id FROM marca WHERE nombre='AREVA'),48,250,'VCC'),

('MICOM P632',7,(SELECT id FROM marca WHERE nombre='SCHNEIDER'),60,250,'VCC'),
('MICOM P632',7,(SELECT id FROM marca WHERE nombre='AREVA'),48,250,'VCC'),

('SEÑALIZ.10 BITS',9,(SELECT id FROM marca WHERE nombre='EPEC'),90,140,'VCC'),

('RELE 80 BAT 110',9,(SELECT id FROM marca WHERE nombre='EPEC'),90,130,'VCA'),

('MICOM P123B',8,(SELECT id FROM marca WHERE nombre='AREVA'),48,150,'VCC'),
('MICOM P123A',8,(SELECT id FROM marca WHERE nombre='AREVA'),48,150,'VCC'),

('MICOM P122B',8,(SELECT id FROM marca WHERE nombre='AREVA'),48,150,'VCC'),
('MICOM P122A',8,(SELECT id FROM marca WHERE nombre='AREVA'),48,150,'VCC'),

('MICOM P123B',8,(SELECT id FROM marca WHERE nombre='SCHNEIDER'),24,220,'VCC'),
('MICOM P123A',8,(SELECT id FROM marca WHERE nombre='SCHNEIDER'),24,220,'VCC'),

('MICOM P122B',8,(SELECT id FROM marca WHERE nombre='SCHNEIDER'),24,220,'VCC'),
('MICOM P122A',8,(SELECT id FROM marca WHERE nombre='SCHNEIDER'),24,220,'VCC'),

('RET630',7,(SELECT id FROM marca WHERE nombre='ABB'),110,250,'VCC');