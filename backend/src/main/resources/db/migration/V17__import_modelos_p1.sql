INSERT INTO modelo (
    nombre,
    tipo_id,
    marca_id,
    tension_desde,
    tension_hasta,
    tipo_tension
)
VALUES
('6MD85',9,(SELECT id FROM marca WHERE nombre='SIEMENS'),48,240,'VCC'),
('7SL87',7,(SELECT id FROM marca WHERE nombre='SIEMENS'),48,240,'VCC'),
('7SA52',6,(SELECT id FROM marca WHERE nombre='SIEMENS'),48,240,'VCC'),
('7SA87',6,(SELECT id FROM marca WHERE nombre='SIEMENS'),48,240,'VCC'),
('7SD52',7,(SELECT id FROM marca WHERE nombre='SIEMENS'),48,240,'VCC'),
('7SJ85',9,(SELECT id FROM marca WHERE nombre='SIEMENS'),48,240,'VCC'),
('7SS52',8,(SELECT id FROM marca WHERE nombre='SIEMENS'),48,240,'VCC'),
('7SX800',8,(SELECT id FROM marca WHERE nombre='SIEMENS'),48,240,'VCC'),
('7SD82',7,(SELECT id FROM marca WHERE nombre='SIEMENS'),48,240,'VCC'),

('RED650',1,(SELECT id FROM marca WHERE nombre='ABB'),48,240,'VCC'),
('REQ650',1,(SELECT id FROM marca WHERE nombre='ABB'),48,240,'VCC'),
('REV615',1,(SELECT id FROM marca WHERE nombre='ABB'),48,240,'VCC'),
('REU615',8,(SELECT id FROM marca WHERE nombre='ABB'),48,240,'VCC'),
('RET670',7,(SELECT id FROM marca WHERE nombre='ABB'),48,240,'VCC'),
('REC670',9,(SELECT id FROM marca WHERE nombre='ABB'),48,240,'VCC'),

('7UT85',7,(SELECT id FROM marca WHERE nombre='SIEMENS'),48,240,'VCC'),

('MULTILIN F60',9,(SELECT id FROM marca WHERE nombre='GE'),48,240,'VCC'),
('MULTILIN T60',7,(SELECT id FROM marca WHERE nombre='GE'),48,240,'VCC'),
('P643',7,(SELECT id FROM marca WHERE nombre='GE'),48,240,'VCC'),
('P545',7,(SELECT id FROM marca WHERE nombre='GE'),48,240,'VCC'),
('P443',6,(SELECT id FROM marca WHERE nombre='GE'),48,240,'VCC'),
('P14N',8,(SELECT id FROM marca WHERE nombre='GE'),48,240,'VCC'),
('P14D',1,(SELECT id FROM marca WHERE nombre='GE'),48,240,'VCC'),

('P14B',1,(SELECT id FROM marca WHERE nombre='ALSTOM'),48,240,'VCC'),

('MICOM P125',8,(SELECT id FROM marca WHERE nombre='AREVA'),48,240,'VCC'),

('EASERGY P139',9,(SELECT id FROM marca WHERE nombre='SCHNEIDER'),48,240,'VCC'),
('EASERGY P3U30',1,(SELECT id FROM marca WHERE nombre='SCHNEIDER'),48,240,'VCC'),
('EASERGY P3L30',7,(SELECT id FROM marca WHERE nombre='SCHNEIDER'),48,240,'VCC'),
('EASERGY P3U20',8,(SELECT id FROM marca WHERE nombre='SCHNEIDER'),48,240,'VCC'),
('MICOM P643',7,(SELECT id FROM marca WHERE nombre='SCHNEIDER'),48,240,'VCC'),
('MICOM P642',7,(SELECT id FROM marca WHERE nombre='SCHNEIDER'),48,240,'VCC'),
('MICOM P543',7,(SELECT id FROM marca WHERE nombre='SCHNEIDER'),48,240,'VCC'),
('MICOM P541',7,(SELECT id FROM marca WHERE nombre='SCHNEIDER'),48,240,'VCC'),
('MICOM P127',8,(SELECT id FROM marca WHERE nombre='SCHNEIDER'),24,240,'VCC'),
('EASERGY P5F30',1,(SELECT id FROM marca WHERE nombre='SCHNEIDER'),48,240,'VCC'),

('7SR5110',8,(SELECT id FROM marca WHERE nombre='REYROLLE'),48,240,'VCC'),
('7SR5111',1,(SELECT id FROM marca WHERE nombre='REYROLLE'),48,240,'VCC'),

('RED615',7,(SELECT id FROM marca WHERE nombre='ABB'),48,250,'VCC'),

('P545',7,(SELECT id FROM marca WHERE nombre='ALSTOM'),48,240,'VCC'),

('MICOM P923',8,(SELECT id FROM marca WHERE nombre='SCHNEIDER'),24,250,'VCC'),

('REL650',6,(SELECT id FROM marca WHERE nombre='ABB'),110,250,'VCC');