UPDATE modelo
SET
    tension_desde = 48,
    tension_hasta = 240,
    tipo_tension = 'VCC'
WHERE nombre IN (
    '6MD85',
    '7SL87',
    '7SA52',
    '7SA87',
    '7SD52',
    '7SJ85',
    '7SS52',
    '7SX800',
    '7SD82',
    'RED650',
    'REQ650',
    'REV615',
    'REU615',
    'RET670',
    'REC670',
    '7UT85'
);

UPDATE modelo
SET
    tension_desde = 110,
    tension_hasta = 250,
    tipo_tension = 'VCC'
WHERE nombre IN (
    'REL670',
    'REG670'
);

UPDATE modelo
SET
    tension_desde = 125,
    tension_hasta = 125,
    tipo_tension = 'VCC'
WHERE nombre IN (
    'MiCOM P442',
    'MULTILIN 850',
    'SIPROTEC 5'
);