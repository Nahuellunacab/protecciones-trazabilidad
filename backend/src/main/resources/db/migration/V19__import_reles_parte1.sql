INSERT INTO rele (
    numero_serie,
    modelo_id,
    activo
)
VALUES

('1VHR91097569',(
    SELECT id FROM modelo
    WHERE nombre='RET630'
      AND marca_id=1
      AND tension_desde=110
      AND tension_hasta=250
),true),

('4305342',(
    SELECT id FROM modelo
    WHERE nombre='MICOM P122B'
      AND marca_id=13
      AND tension_desde=48
      AND tension_hasta=150
),true),

('39666196',(
    SELECT id FROM modelo
    WHERE nombre='MICOM P122B'
      AND marca_id=14
      AND tension_desde=24
      AND tension_hasta=220
),true),

('39525994',(
    SELECT id FROM modelo
    WHERE nombre='MICOM P120B'
      AND marca_id=14
      AND tension_desde=24
      AND tension_hasta=250
),true),

('BF0811100881',(
    SELECT id FROM modelo
    WHERE nombre='7SA52'
      AND marca_id=11
      AND tension_desde=48
      AND tension_hasta=240
),true),

('BF0903100750',(SELECT id FROM modelo WHERE nombre='7SA52' AND marca_id=11 AND tension_desde=48 AND tension_hasta=240),true),
('BF0903100751',(SELECT id FROM modelo WHERE nombre='7SA52' AND marca_id=11 AND tension_desde=48 AND tension_hasta=240),true),

('BM108000191',(
    SELECT id FROM modelo
    WHERE nombre='7SL87'
      AND marca_id=11
      AND tension_desde=48
      AND tension_hasta=240
),true),

('BM2108000103',(
    SELECT id FROM modelo
    WHERE nombre='6MD85'
      AND marca_id=11
      AND tension_desde=48
      AND tension_hasta=240
),true),

('BF9905042482',(
    SELECT id FROM modelo
    WHERE nombre='7SD502'
      AND marca_id=11
      AND tension_desde=60
      AND tension_hasta=125
),true),

('BF9703007502',(SELECT id FROM modelo WHERE nombre='7SD502' AND marca_id=11 AND tension_desde=60 AND tension_hasta=125),true),

('BF0910062395',(SELECT id FROM modelo WHERE nombre='7SD52' AND marca_id=11 AND tension_desde=48 AND tension_hasta=240),true),
('BF0910062394',(SELECT id FROM modelo WHERE nombre='7SD52' AND marca_id=11 AND tension_desde=48 AND tension_hasta=240),true),

('BF1611505365',(SELECT id FROM modelo WHERE nombre='7SD522' AND marca_id=11 AND tension_desde=110 AND tension_hasta=250),true),

('BF0810074827',(SELECT id FROM modelo WHERE nombre='7SD61' AND marca_id=11 AND tension_desde=24 AND tension_hasta=48),true),
('BF0810074826',(SELECT id FROM modelo WHERE nombre='7SD61' AND marca_id=11 AND tension_desde=24 AND tension_hasta=48),true),
('BF0810074828',(SELECT id FROM modelo WHERE nombre='7SD61' AND marca_id=11 AND tension_desde=24 AND tension_hasta=48),true),
('BF0810074822',(SELECT id FROM modelo WHERE nombre='7SD61' AND marca_id=11 AND tension_desde=24 AND tension_hasta=48),true),
('BF0810074829',(SELECT id FROM modelo WHERE nombre='7SD61' AND marca_id=11 AND tension_desde=24 AND tension_hasta=48),true),

('BF0810082298',(SELECT id FROM modelo WHERE nombre='7SJ602' AND marca_id=11 AND tension_desde=24 AND tension_hasta=48),true),
('BF0810082301',(SELECT id FROM modelo WHERE nombre='7SJ602' AND marca_id=11 AND tension_desde=24 AND tension_hasta=48),true),
('BF0810082299',(SELECT id FROM modelo WHERE nombre='7SJ602' AND marca_id=11 AND tension_desde=24 AND tension_hasta=48),true),

('BF1010054411',(SELECT id FROM modelo WHERE nombre='7SJ80' AND marca_id=11 AND tension_desde=60 AND tension_hasta=250),true),
('BF1010054410',(SELECT id FROM modelo WHERE nombre='7SJ80' AND marca_id=11 AND tension_desde=60 AND tension_hasta=250),true),

('BM2108000197',(SELECT id FROM modelo WHERE nombre='7SJ85' AND marca_id=11 AND tension_desde=48 AND tension_hasta=240),true),

('BF1805511945',(SELECT id FROM modelo WHERE nombre='7SS52' AND marca_id=11 AND tension_desde=48 AND tension_hasta=240),true),
('BF1805511947',(SELECT id FROM modelo WHERE nombre='7SS52' AND marca_id=11 AND tension_desde=48 AND tension_hasta=240),true),
('BF1805509175',(SELECT id FROM modelo WHERE nombre='7SS52' AND marca_id=11 AND tension_desde=48 AND tension_hasta=240),true),

('BM2107012075',(SELECT id FROM modelo WHERE nombre='7SX800' AND marca_id=11 AND tension_desde=48 AND tension_hasta=240),true),

('BFOB111D1030',(SELECT id FROM modelo WHERE nombre='7UT633' AND marca_id=11 AND tension_desde=110 AND tension_hasta=250),true),

('BM2107015105',(SELECT id FROM modelo WHERE nombre='7UT85' AND marca_id=11 AND tension_desde=48 AND tension_hasta=240),true),
('BM1808000380',(SELECT id FROM modelo WHERE nombre='7UT85' AND marca_id=11 AND tension_desde=48 AND tension_hasta=240),true),
('BM1808000374',(SELECT id FROM modelo WHERE nombre='7UT85' AND marca_id=11 AND tension_desde=48 AND tension_hasta=240),true),
('BM1808000368',(SELECT id FROM modelo WHERE nombre='7UT85' AND marca_id=11 AND tension_desde=48 AND tension_hasta=240),true),
('BM1808000365',(SELECT id FROM modelo WHERE nombre='7UT85' AND marca_id=11 AND tension_desde=48 AND tension_hasta=240),true),
('BM1808000359',(SELECT id FROM modelo WHERE nombre='7UT85' AND marca_id=11 AND tension_desde=48 AND tension_hasta=240),true),
('BM1808000356',(SELECT id FROM modelo WHERE nombre='7UT85' AND marca_id=11 AND tension_desde=48 AND tension_hasta=240),true),
('BM1808000353',(SELECT id FROM modelo WHERE nombre='7UT85' AND marca_id=11 AND tension_desde=48 AND tension_hasta=240),true),
('BM1808000335',(SELECT id FROM modelo WHERE nombre='7UT85' AND marca_id=11 AND tension_desde=48 AND tension_hasta=240),true),
('BM1808000305',(SELECT id FROM modelo WHERE nombre='7UT85' AND marca_id=11 AND tension_desde=48 AND tension_hasta=240),true),
('BM1808000302',(SELECT id FROM modelo WHERE nombre='7UT85' AND marca_id=11 AND tension_desde=48 AND tension_hasta=240),true),
('BM1710004711',(SELECT id FROM modelo WHERE nombre='7UT85' AND marca_id=11 AND tension_desde=48 AND tension_hasta=240),true),

('BM2108000173',(SELECT id FROM modelo WHERE nombre='7SD82' AND marca_id=11 AND tension_desde=48 AND tension_hasta=240),true),
('BM2108000170',(SELECT id FROM modelo WHERE nombre='7SD82' AND marca_id=11 AND tension_desde=48 AND tension_hasta=240),true),
('BM2108000169',(SELECT id FROM modelo WHERE nombre='7SD82' AND marca_id=11 AND tension_desde=48 AND tension_hasta=240),true),
('BM2108000163',(SELECT id FROM modelo WHERE nombre='7SD82' AND marca_id=11 AND tension_desde=48 AND tension_hasta=240),true),
('BM2108000158',(SELECT id FROM modelo WHERE nombre='7SD82' AND marca_id=11 AND tension_desde=48 AND tension_hasta=240),true),
('BM2108000157',(SELECT id FROM modelo WHERE nombre='7SD82' AND marca_id=11 AND tension_desde=48 AND tension_hasta=240),true),
('BM2108000151',(SELECT id FROM modelo WHERE nombre='7SD82' AND marca_id=11 AND tension_desde=48 AND tension_hasta=240),true),
('BM2108000148',(SELECT id FROM modelo WHERE nombre='7SD82' AND marca_id=11 AND tension_desde=48 AND tension_hasta=240),true),
('BM2108000145',(SELECT id FROM modelo WHERE nombre='7SD82' AND marca_id=11 AND tension_desde=48 AND tension_hasta=240),true),
('BM2108000141',(SELECT id FROM modelo WHERE nombre='7SD82' AND marca_id=11 AND tension_desde=48 AND tension_hasta=240),true),
('BM2108000139',(SELECT id FROM modelo WHERE nombre='7SD82' AND marca_id=11 AND tension_desde=48 AND tension_hasta=240),true),
('BM2108000138',(SELECT id FROM modelo WHERE nombre='7SD82' AND marca_id=11 AND tension_desde=48 AND tension_hasta=240),true),
('BM2108000136',(SELECT id FROM modelo WHERE nombre='7SD82' AND marca_id=11 AND tension_desde=48 AND tension_hasta=240),true),
('BM2108000135',(SELECT id FROM modelo WHERE nombre='7SD82' AND marca_id=11 AND tension_desde=48 AND tension_hasta=240),true),
('BM2108000133',(SELECT id FROM modelo WHERE nombre='7SD82' AND marca_id=11 AND tension_desde=48 AND tension_hasta=240),true),
('BM2108000131',(SELECT id FROM modelo WHERE nombre='7SD82' AND marca_id=11 AND tension_desde=48 AND tension_hasta=240),true),

('T1921161',(SELECT id FROM modelo WHERE nombre='RED670' AND marca_id=1 AND tension_desde=90 AND tension_hasta=250),true),
('B1240051',(SELECT id FROM modelo WHERE nombre='RED670' AND marca_id=1 AND tension_desde=90 AND tension_hasta=250),true),

('T1945093',(SELECT id FROM modelo WHERE nombre='RED650' AND marca_id=1 AND tension_desde=48 AND tension_hasta=240),true),

('1VHR91669651',(SELECT id FROM modelo WHERE nombre='REV615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=240),true),

('1VHR91328464',(SELECT id FROM modelo WHERE nombre='REU615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=240),true),

('T2120101',(SELECT id FROM modelo WHERE nombre='REQ650' AND marca_id=1 AND tension_desde=48 AND tension_hasta=240),true),

('T0448067',(SELECT id FROM modelo WHERE nombre='REL511' AND marca_id=1 AND tension_desde=110 AND tension_hasta=125),true),

('T1921162',(SELECT id FROM modelo WHERE nombre='RED670' AND marca_id=1 AND tension_desde=90 AND tension_hasta=250),true),

('T2318289',(SELECT id FROM modelo WHERE nombre='RET670' AND marca_id=1 AND tension_desde=48 AND tension_hasta=240),true),
('T2150013',(SELECT id FROM modelo WHERE nombre='RET670' AND marca_id=1 AND tension_desde=48 AND tension_hasta=240),true),
('T2108174',(SELECT id FROM modelo WHERE nombre='RET670' AND marca_id=1 AND tension_desde=48 AND tension_hasta=240),true),

('T1913123',(SELECT id FROM modelo WHERE nombre='RET630' AND marca_id=1 AND tension_desde=110 AND tension_hasta=250),true),
('B1246049',(SELECT id FROM modelo WHERE nombre='RET630' AND marca_id=1 AND tension_desde=110 AND tension_hasta=250),true),

('1VHR91358486',(SELECT id FROM modelo WHERE nombre='RET630' AND marca_id=1 AND tension_desde=110 AND tension_hasta=250),true),
('1VHR91358483',(SELECT id FROM modelo WHERE nombre='RET630' AND marca_id=1 AND tension_desde=110 AND tension_hasta=250),true),
('1VHR91328745',(SELECT id FROM modelo WHERE nombre='RET630' AND marca_id=1 AND tension_desde=110 AND tension_hasta=250),true),
('1VHR91296583',(SELECT id FROM modelo WHERE nombre='RET630' AND marca_id=1 AND tension_desde=110 AND tension_hasta=250),true),
('1VHR91289082',(SELECT id FROM modelo WHERE nombre='RET630' AND marca_id=1 AND tension_desde=110 AND tension_hasta=250),true),

('1VHR91850374',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91850373',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91850372',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91850371',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91693465',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91693464',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91693463',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91693462',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91693461',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91693460',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91669672',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91669666',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91472441',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91470592',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91465332',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91465331',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91415453',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91415452',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91415449',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91415448',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91410542',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91328751',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91328750',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91328748',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91328747',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91328453',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91328452',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91328450',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91328446',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91328444',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91328439',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91328432',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91328428',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91328427',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91328424',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91328422',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91328421',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91328420',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91289892',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91289887',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91289884',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91274145',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91274144',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),

('1VHR91328404',(SELECT id FROM modelo WHERE nombre='RED615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91328402',(SELECT id FROM modelo WHERE nombre='RED615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91262269',(SELECT id FROM modelo WHERE nombre='RED615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91262266',(SELECT id FROM modelo WHERE nombre='RED615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91474014',(SELECT id FROM modelo WHERE nombre='RED615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91474013',(SELECT id FROM modelo WHERE nombre='RED615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91474012',(SELECT id FROM modelo WHERE nombre='RED615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91474010',(SELECT id FROM modelo WHERE nombre='RED615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91474009',(SELECT id FROM modelo WHERE nombre='RED615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91474008',(SELECT id FROM modelo WHERE nombre='RED615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91474007',(SELECT id FROM modelo WHERE nombre='RED615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91474004',(SELECT id FROM modelo WHERE nombre='RED615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91474002',(SELECT id FROM modelo WHERE nombre='RED615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91615184',(SELECT id FROM modelo WHERE nombre='RED615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91615170',(SELECT id FROM modelo WHERE nombre='RED615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91669648',(SELECT id FROM modelo WHERE nombre='RED615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91669646',(SELECT id FROM modelo WHERE nombre='RED615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91669643',(SELECT id FROM modelo WHERE nombre='RED615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91669641',(SELECT id FROM modelo WHERE nombre='RED615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),
('1VHR91669640',(SELECT id FROM modelo WHERE nombre='RED615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),

('T2318291',(SELECT id FROM modelo WHERE nombre='REC670' AND marca_id=1 AND tension_desde=48 AND tension_hasta=240),true),
('T2150022',(SELECT id FROM modelo WHERE nombre='REC670' AND marca_id=1 AND tension_desde=48 AND tension_hasta=240),true),
('T2150020',(SELECT id FROM modelo WHERE nombre='REC670' AND marca_id=1 AND tension_desde=48 AND tension_hasta=240),true),
('T2150016',(SELECT id FROM modelo WHERE nombre='REC670' AND marca_id=1 AND tension_desde=48 AND tension_hasta=240),true),
('T2108177',(SELECT id FROM modelo WHERE nombre='REC670' AND marca_id=1 AND tension_desde=48 AND tension_hasta=240),true),

('ABHC22000903',(SELECT id FROM modelo WHERE nombre='MULTILIN T60' AND marca_id=12 AND tension_desde=48 AND tension_hasta=240),true),
('AAHC22000729',(SELECT id FROM modelo WHERE nombre='MULTILIN F60' AND marca_id=12 AND tension_desde=48 AND tension_hasta=240),true),

('BM1808000350',(SELECT id FROM modelo WHERE nombre='7UT85' AND marca_id=11 AND tension_desde=48 AND tension_hasta=240),true),

('1VHR91281015',(SELECT id FROM modelo WHERE nombre='REF615' AND marca_id=1 AND tension_desde=48 AND tension_hasta=250),true),

('39699271',(SELECT id FROM modelo WHERE nombre='MICOM P120B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=250),true),
('39666193',(SELECT id FROM modelo WHERE nombre='MICOM P122B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=220),true),
('39585325',(SELECT id FROM modelo WHERE nombre='MICOM P122B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=220),true),
('39522411',(SELECT id FROM modelo WHERE nombre='MICOM P122B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=220),true),

('35508880',(SELECT id FROM modelo WHERE nombre='P14D' AND marca_id=12 AND tension_desde=48 AND tension_hasta=240),true),
('35508225',(SELECT id FROM modelo WHERE nombre='P14D' AND marca_id=12 AND tension_desde=48 AND tension_hasta=240),true),

('35574393',(SELECT id FROM modelo WHERE nombre='P643' AND marca_id=12 AND tension_desde=48 AND tension_hasta=240),true),
('35574390',(SELECT id FROM modelo WHERE nombre='P643' AND marca_id=12 AND tension_desde=48 AND tension_hasta=240),true),
('36048085',(SELECT id FROM modelo WHERE nombre='P643' AND marca_id=12 AND tension_desde=48 AND tension_hasta=240),true),
('36048084',(SELECT id FROM modelo WHERE nombre='P643' AND marca_id=12 AND tension_desde=48 AND tension_hasta=240),true),
('36048083',(SELECT id FROM modelo WHERE nombre='P643' AND marca_id=12 AND tension_desde=48 AND tension_hasta=240),true),
('36048082',(SELECT id FROM modelo WHERE nombre='P643' AND marca_id=12 AND tension_desde=48 AND tension_hasta=240),true),
('36048081',(SELECT id FROM modelo WHERE nombre='P643' AND marca_id=12 AND tension_desde=48 AND tension_hasta=240),true),
('36045285',(SELECT id FROM modelo WHERE nombre='P643' AND marca_id=12 AND tension_desde=48 AND tension_hasta=240),true),
('36045283',(SELECT id FROM modelo WHERE nombre='P643' AND marca_id=12 AND tension_desde=48 AND tension_hasta=240),true),
('36045282',(SELECT id FROM modelo WHERE nombre='P643' AND marca_id=12 AND tension_desde=48 AND tension_hasta=240),true),
('36045281',(SELECT id FROM modelo WHERE nombre='P643' AND marca_id=12 AND tension_desde=48 AND tension_hasta=240),true),
('36045280',(SELECT id FROM modelo WHERE nombre='P643' AND marca_id=12 AND tension_desde=48 AND tension_hasta=240),true),
('36045279',(SELECT id FROM modelo WHERE nombre='P643' AND marca_id=12 AND tension_desde=48 AND tension_hasta=240),true),
('36045278',(SELECT id FROM modelo WHERE nombre='P643' AND marca_id=12 AND tension_desde=48 AND tension_hasta=240),true),

('36870353',(SELECT id FROM modelo WHERE nombre='P545' AND marca_id=12 AND tension_desde=48 AND tension_hasta=240),true),
('36870352',(SELECT id FROM modelo WHERE nombre='P545' AND marca_id=12 AND tension_desde=48 AND tension_hasta=240),true),
('36870351',(SELECT id FROM modelo WHERE nombre='P545' AND marca_id=12 AND tension_desde=48 AND tension_hasta=240),true),
('36353931',(SELECT id FROM modelo WHERE nombre='P545' AND marca_id=12 AND tension_desde=48 AND tension_hasta=240),true),
('36353923',(SELECT id FROM modelo WHERE nombre='P545' AND marca_id=12 AND tension_desde=48 AND tension_hasta=240),true),
('36353922',(SELECT id FROM modelo WHERE nombre='P545' AND marca_id=12 AND tension_desde=48 AND tension_hasta=240),true),
('36353920',(SELECT id FROM modelo WHERE nombre='P545' AND marca_id=12 AND tension_desde=48 AND tension_hasta=240),true),

('36870354',(SELECT id FROM modelo WHERE nombre='P443' AND marca_id=12 AND tension_desde=48 AND tension_hasta=240),true),
('36488083',(SELECT id FROM modelo WHERE nombre='P443' AND marca_id=12 AND tension_desde=48 AND tension_hasta=240),true),

('36422527',(SELECT id FROM modelo WHERE nombre='P14N' AND marca_id=12 AND tension_desde=48 AND tension_hasta=240),true),
('36422528',(SELECT id FROM modelo WHERE nombre='P14N' AND marca_id=12 AND tension_desde=48 AND tension_hasta=240),true),
('35597962',(SELECT id FROM modelo WHERE nombre='P14N' AND marca_id=12 AND tension_desde=48 AND tension_hasta=240),true),
('35597961',(SELECT id FROM modelo WHERE nombre='P14N' AND marca_id=12 AND tension_desde=48 AND tension_hasta=240),true),
('35597960',(SELECT id FROM modelo WHERE nombre='P14N' AND marca_id=12 AND tension_desde=48 AND tension_hasta=240),true),
('35597959',(SELECT id FROM modelo WHERE nombre='P14N' AND marca_id=12 AND tension_desde=48 AND tension_hasta=240),true),

('35509311',(SELECT id FROM modelo WHERE nombre='P14D' AND marca_id=12 AND tension_desde=48 AND tension_hasta=240),true),
('35509299',(SELECT id FROM modelo WHERE nombre='P14D' AND marca_id=12 AND tension_desde=48 AND tension_hasta=240),true),
('36519501',(SELECT id FROM modelo WHERE nombre='P14D' AND marca_id=12 AND tension_desde=48 AND tension_hasta=240),true),
('36422538',(SELECT id FROM modelo WHERE nombre='P14D' AND marca_id=12 AND tension_desde=48 AND tension_hasta=240),true),
('36422537',(SELECT id FROM modelo WHERE nombre='P14D' AND marca_id=12 AND tension_desde=48 AND tension_hasta=240),true),
('36422536',(SELECT id FROM modelo WHERE nombre='P14D' AND marca_id=12 AND tension_desde=48 AND tension_hasta=240),true),
('36422535',(SELECT id FROM modelo WHERE nombre='P14D' AND marca_id=12 AND tension_desde=48 AND tension_hasta=240),true),
('35510930',(SELECT id FROM modelo WHERE nombre='P14D' AND marca_id=12 AND tension_desde=48 AND tension_hasta=240),true),
('34971756',(SELECT id FROM modelo WHERE nombre='P14D' AND marca_id=12 AND tension_desde=48 AND tension_hasta=240),true),

('34815508',(SELECT id FROM modelo WHERE nombre='P545' AND marca_id=15 AND tension_desde=48 AND tension_hasta=240),true),
('34815507',(SELECT id FROM modelo WHERE nombre='P545' AND marca_id=15 AND tension_desde=48 AND tension_hasta=240),true),
('34815506',(SELECT id FROM modelo WHERE nombre='P545' AND marca_id=15 AND tension_desde=48 AND tension_hasta=240),true),
('34815505',(SELECT id FROM modelo WHERE nombre='P545' AND marca_id=15 AND tension_desde=48 AND tension_hasta=240),true),
('34815504',(SELECT id FROM modelo WHERE nombre='P545' AND marca_id=15 AND tension_desde=48 AND tension_hasta=240),true),
('34815503',(SELECT id FROM modelo WHERE nombre='P545' AND marca_id=15 AND tension_desde=48 AND tension_hasta=240),true),
('34815502',(SELECT id FROM modelo WHERE nombre='P545' AND marca_id=15 AND tension_desde=48 AND tension_hasta=240),true),
('34815501',(SELECT id FROM modelo WHERE nombre='P545' AND marca_id=15 AND tension_desde=48 AND tension_hasta=240),true),
('34815500',(SELECT id FROM modelo WHERE nombre='P545' AND marca_id=15 AND tension_desde=48 AND tension_hasta=240),true),
('34814858',(SELECT id FROM modelo WHERE nombre='P545' AND marca_id=15 AND tension_desde=48 AND tension_hasta=240),true),
('34814857',(SELECT id FROM modelo WHERE nombre='P545' AND marca_id=15 AND tension_desde=48 AND tension_hasta=240),true),
('34814854',(SELECT id FROM modelo WHERE nombre='P545' AND marca_id=15 AND tension_desde=48 AND tension_hasta=240),true),
('34814852',(SELECT id FROM modelo WHERE nombre='P545' AND marca_id=15 AND tension_desde=48 AND tension_hasta=240),true),

('3006342',(SELECT id FROM modelo WHERE nombre='MICOM P923' AND marca_id=13 AND tension_desde=48 AND tension_hasta=150),true),
('3006356',(SELECT id FROM modelo WHERE nombre='MICOM P923' AND marca_id=13 AND tension_desde=48 AND tension_hasta=150),true),

('30052822',(SELECT id FROM modelo WHERE nombre='MICOM P541' AND marca_id=13 AND tension_desde=110 AND tension_hasta=250),true),
('30052821',(SELECT id FROM modelo WHERE nombre='MICOM P541' AND marca_id=13 AND tension_desde=110 AND tension_hasta=250),true),
('30076753',(SELECT id FROM modelo WHERE nombre='MICOM P541' AND marca_id=13 AND tension_desde=110 AND tension_hasta=250),true),
('30076754',(SELECT id FROM modelo WHERE nombre='MICOM P541' AND marca_id=13 AND tension_desde=110 AND tension_hasta=250),true),
('30076787',(SELECT id FROM modelo WHERE nombre='MICOM P541' AND marca_id=13 AND tension_desde=110 AND tension_hasta=250),true),

('345777L',(SELECT id FROM modelo WHERE nombre='MICOM P141' AND marca_id=13 AND tension_desde=48 AND tension_hasta=125),true),

('31546860',(SELECT id FROM modelo WHERE nombre='MICOM P125' AND marca_id=13 AND tension_desde=48 AND tension_hasta=240),true),
('31546861',(SELECT id FROM modelo WHERE nombre='MICOM P125' AND marca_id=13 AND tension_desde=48 AND tension_hasta=240),true),

('4305355',(SELECT id FROM modelo WHERE nombre='MICOM P122A' AND marca_id=13 AND tension_desde=48 AND tension_hasta=150),true),

('3003',(SELECT id FROM modelo WHERE nombre='3425A' AND marca_id=16 AND tension_desde=110 AND tension_hasta=250),true),

('37131328',(SELECT id FROM modelo WHERE nombre='EASERGY P139' AND marca_id=14 AND tension_desde=48 AND tension_hasta=240),true),

('21224250248',(SELECT id FROM modelo WHERE nombre='EASERGY P5F30' AND marca_id=14 AND tension_desde=48 AND tension_hasta=240),true),
('21224240182',(SELECT id FROM modelo WHERE nombre='EASERGY P5F30' AND marca_id=14 AND tension_desde=48 AND tension_hasta=240),true),
('21224220073',(SELECT id FROM modelo WHERE nombre='EASERGY P5F30' AND marca_id=14 AND tension_desde=48 AND tension_hasta=240),true),
('21224220070',(SELECT id FROM modelo WHERE nombre='EASERGY P5F30' AND marca_id=14 AND tension_desde=48 AND tension_hasta=240),true),
('21224240183',(SELECT id FROM modelo WHERE nombre='EASERGY P5F30' AND marca_id=14 AND tension_desde=48 AND tension_hasta=240),true),
('21224240180',(SELECT id FROM modelo WHERE nombre='EASERGY P5F30' AND marca_id=14 AND tension_desde=48 AND tension_hasta=240),true),
('21224220076',(SELECT id FROM modelo WHERE nombre='EASERGY P5F30' AND marca_id=14 AND tension_desde=48 AND tension_hasta=240),true),
('21224240179',(SELECT id FROM modelo WHERE nombre='EASERGY P5F30' AND marca_id=14 AND tension_desde=48 AND tension_hasta=240),true),
('21224220079',(SELECT id FROM modelo WHERE nombre='EASERGY P5F30' AND marca_id=14 AND tension_desde=48 AND tension_hasta=240),true),
('21224220078',(SELECT id FROM modelo WHERE nombre='EASERGY P5F30' AND marca_id=14 AND tension_desde=48 AND tension_hasta=240),true),
('21224220077',(SELECT id FROM modelo WHERE nombre='EASERGY P5F30' AND marca_id=14 AND tension_desde=48 AND tension_hasta=240),true),
('21224220074',(SELECT id FROM modelo WHERE nombre='EASERGY P5F30' AND marca_id=14 AND tension_desde=48 AND tension_hasta=240),true),
('21224220072',(SELECT id FROM modelo WHERE nombre='EASERGY P5F30' AND marca_id=14 AND tension_desde=48 AND tension_hasta=240),true),
('21224220071',(SELECT id FROM modelo WHERE nombre='EASERGY P5F30' AND marca_id=14 AND tension_desde=48 AND tension_hasta=240),true),

('SM224120007',(SELECT id FROM modelo WHERE nombre='EASERGY P3L30' AND marca_id=14 AND tension_desde=48 AND tension_hasta=240),true),
('SM221030006',(SELECT id FROM modelo WHERE nombre='EASERGY P3L30' AND marca_id=14 AND tension_desde=48 AND tension_hasta=240),true),
('EB222220072',(SELECT id FROM modelo WHERE nombre='EASERGY P3L30' AND marca_id=14 AND tension_desde=48 AND tension_hasta=240),true),
('EB222220071',(SELECT id FROM modelo WHERE nombre='EASERGY P3L30' AND marca_id=14 AND tension_desde=48 AND tension_hasta=240),true),

('SM192530024',(SELECT id FROM modelo WHERE nombre='EASERGY P3U30' AND marca_id=14 AND tension_desde=48 AND tension_hasta=240),true),
('SM192340075',(SELECT id FROM modelo WHERE nombre='EASERGY P3U30' AND marca_id=14 AND tension_desde=48 AND tension_hasta=240),true),
('SM192340066',(SELECT id FROM modelo WHERE nombre='EASERGY P3U30' AND marca_id=14 AND tension_desde=48 AND tension_hasta=240),true),
('SM190930023',(SELECT id FROM modelo WHERE nombre='EASERGY P3U30' AND marca_id=14 AND tension_desde=48 AND tension_hasta=240),true),

('SM192460136',(SELECT id FROM modelo WHERE nombre='EASERGY P3U20' AND marca_id=14 AND tension_desde=48 AND tension_hasta=240),true),

('36237162',(SELECT id FROM modelo WHERE nombre='MICOM P923' AND marca_id=14 AND tension_desde=24 AND tension_hasta=250),true),
('36334299',(SELECT id FROM modelo WHERE nombre='MICOM P923' AND marca_id=14 AND tension_desde=24 AND tension_hasta=250),true),

('39520956',(SELECT id FROM modelo WHERE nombre='MICOM P921' AND marca_id=14 AND tension_desde=24 AND tension_hasta=250),true),
('36334300',(SELECT id FROM modelo WHERE nombre='MICOM P921' AND marca_id=14 AND tension_desde=24 AND tension_hasta=250),true),
('36228815',(SELECT id FROM modelo WHERE nombre='MICOM P921' AND marca_id=14 AND tension_desde=24 AND tension_hasta=250),true),
('36190731',(SELECT id FROM modelo WHERE nombre='MICOM P921' AND marca_id=14 AND tension_desde=24 AND tension_hasta=250),true),

('39872209',(SELECT id FROM modelo WHERE nombre='MICOM P643' AND marca_id=14 AND tension_desde=48 AND tension_hasta=240),true),
('39872208',(SELECT id FROM modelo WHERE nombre='MICOM P643' AND marca_id=14 AND tension_desde=48 AND tension_hasta=240),true),
('39766830',(SELECT id FROM modelo WHERE nombre='MICOM P643' AND marca_id=14 AND tension_desde=48 AND tension_hasta=240),true),
('39766829',(SELECT id FROM modelo WHERE nombre='MICOM P643' AND marca_id=14 AND tension_desde=48 AND tension_hasta=240),true),
('39698175',(SELECT id FROM modelo WHERE nombre='MICOM P643' AND marca_id=14 AND tension_desde=48 AND tension_hasta=240),true),
('39699627',(SELECT id FROM modelo WHERE nombre='MICOM P643' AND marca_id=14 AND tension_desde=48 AND tension_hasta=240),true),
('39699626',(SELECT id FROM modelo WHERE nombre='MICOM P643' AND marca_id=14 AND tension_desde=48 AND tension_hasta=240),true),

('39629059',(SELECT id FROM modelo WHERE nombre='MICOM P643' AND marca_id=14 AND tension_desde=48 AND tension_hasta=240),true),
('39629058',(SELECT id FROM modelo WHERE nombre='MICOM P643' AND marca_id=14 AND tension_desde=48 AND tension_hasta=240),true),
('39665647',(SELECT id FROM modelo WHERE nombre='MICOM P643' AND marca_id=14 AND tension_desde=48 AND tension_hasta=240),true),
('39715720',(SELECT id FROM modelo WHERE nombre='MICOM P521' AND marca_id=14 AND tension_desde=24 AND tension_hasta=250),true),
('39715718',(SELECT id FROM modelo WHERE nombre='MICOM P521' AND marca_id=14 AND tension_desde=24 AND tension_hasta=250),true),
('39715717',(SELECT id FROM modelo WHERE nombre='MICOM P521' AND marca_id=14 AND tension_desde=24 AND tension_hasta=250),true),
('39715716',(SELECT id FROM modelo WHERE nombre='MICOM P521' AND marca_id=14 AND tension_desde=24 AND tension_hasta=250),true),
('39715715',(SELECT id FROM modelo WHERE nombre='MICOM P521' AND marca_id=14 AND tension_desde=24 AND tension_hasta=250),true),
('39677569',(SELECT id FROM modelo WHERE nombre='MICOM P521' AND marca_id=14 AND tension_desde=24 AND tension_hasta=250),true),
('39677568',(SELECT id FROM modelo WHERE nombre='MICOM P521' AND marca_id=14 AND tension_desde=24 AND tension_hasta=250),true),
('39629019',(SELECT id FROM modelo WHERE nombre='MICOM P521' AND marca_id=14 AND tension_desde=24 AND tension_hasta=250),true),
('36228620',(SELECT id FROM modelo WHERE nombre='MICOM P521' AND marca_id=14 AND tension_desde=24 AND tension_hasta=250),true),

('39791232',(SELECT id FROM modelo WHERE nombre='MICOM P442' AND marca_id=14 AND tension_desde=48 AND tension_hasta=110),true),
('39791231',(SELECT id FROM modelo WHERE nombre='MICOM P442' AND marca_id=14 AND tension_desde=48 AND tension_hasta=110),true),
('39515773',(SELECT id FROM modelo WHERE nombre='MICOM P442' AND marca_id=14 AND tension_desde=48 AND tension_hasta=110),true),

('36029894',(SELECT id FROM modelo WHERE nombre='MICOM P125B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=250),true),
('36029892',(SELECT id FROM modelo WHERE nombre='MICOM P125B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=250),true),

('39741628',(SELECT id FROM modelo WHERE nombre='MICOM P123B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=220),true),

('39607472',(SELECT id FROM modelo WHERE nombre='MICOM P122B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=220),true),
('39607470',(SELECT id FROM modelo WHERE nombre='MICOM P122B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=220),true),
('39598671',(SELECT id FROM modelo WHERE nombre='MICOM P122B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=220),true),
('39568543',(SELECT id FROM modelo WHERE nombre='MICOM P122B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=220),true),
('39539156',(SELECT id FROM modelo WHERE nombre='MICOM P122B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=220),true),
('36334298',(SELECT id FROM modelo WHERE nombre='MICOM P122B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=220),true),
('39767153',(SELECT id FROM modelo WHERE nombre='MICOM P122B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=220),true),
('39767152',(SELECT id FROM modelo WHERE nombre='MICOM P122B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=220),true),
('39738334',(SELECT id FROM modelo WHERE nombre='MICOM P122B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=220),true),
('39738333',(SELECT id FROM modelo WHERE nombre='MICOM P122B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=220),true),
('39738332',(SELECT id FROM modelo WHERE nombre='MICOM P122B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=220),true),
('39738331',(SELECT id FROM modelo WHERE nombre='MICOM P122B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=220),true),
('39718064',(SELECT id FROM modelo WHERE nombre='MICOM P122B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=220),true),
('39718063',(SELECT id FROM modelo WHERE nombre='MICOM P122B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=220),true),
('39718062',(SELECT id FROM modelo WHERE nombre='MICOM P122B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=220),true),
('39718061',(SELECT id FROM modelo WHERE nombre='MICOM P122B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=220),true),
('39718060',(SELECT id FROM modelo WHERE nombre='MICOM P122B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=220),true),
('39718059',(SELECT id FROM modelo WHERE nombre='MICOM P122B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=220),true),
('39718058',(SELECT id FROM modelo WHERE nombre='MICOM P122B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=220),true),
('39715726',(SELECT id FROM modelo WHERE nombre='MICOM P122B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=220),true),
('39715725',(SELECT id FROM modelo WHERE nombre='MICOM P122B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=220),true),
('39715724',(SELECT id FROM modelo WHERE nombre='MICOM P122B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=220),true),
('39715722',(SELECT id FROM modelo WHERE nombre='MICOM P122B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=220),true),
('39715721',(SELECT id FROM modelo WHERE nombre='MICOM P122B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=220),true),

('39738340',(SELECT id FROM modelo WHERE nombre='MICOM P120B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=250),true),
('39738339',(SELECT id FROM modelo WHERE nombre='MICOM P120B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=250),true),
('39696210',(SELECT id FROM modelo WHERE nombre='MICOM P120B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=250),true),
('39607467',(SELECT id FROM modelo WHERE nombre='MICOM P120B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=250),true),
('39576369',(SELECT id FROM modelo WHERE nombre='MICOM P120B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=250),true),
('39576368',(SELECT id FROM modelo WHERE nombre='MICOM P120B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=250),true),
('39560613',(SELECT id FROM modelo WHERE nombre='MICOM P120B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=250),true),
('39530100',(SELECT id FROM modelo WHERE nombre='MICOM P120B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=250),true),
('39521281',(SELECT id FROM modelo WHERE nombre='MICOM P120B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=250),true),
('36281621',(SELECT id FROM modelo WHERE nombre='MICOM P120B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=250),true),

('39738342',(SELECT id FROM modelo WHERE nombre='MICOM P120B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=250),true),
('39664535',(SELECT id FROM modelo WHERE nombre='MICOM P120B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=250),true),
('39664533',(SELECT id FROM modelo WHERE nombre='MICOM P120B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=250),true),
('39664532',(SELECT id FROM modelo WHERE nombre='MICOM P120B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=250),true),
('39664522',(SELECT id FROM modelo WHERE nombre='MICOM P120B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=250),true),
('39663723',(SELECT id FROM modelo WHERE nombre='MICOM P120B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=250),true),
('39605139',(SELECT id FROM modelo WHERE nombre='MICOM P120B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=250),true),
('36334301',(SELECT id FROM modelo WHERE nombre='MICOM P120B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=250),true),
('36307980',(SELECT id FROM modelo WHERE nombre='MICOM P120B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=250),true),
('39806836',(SELECT id FROM modelo WHERE nombre='MICOM P120B' AND marca_id=14 AND tension_desde=24 AND tension_hasta=250),true),
('39857097',(SELECT id FROM modelo WHERE nombre='MICOM P127' AND marca_id=14 AND tension_desde=24 AND tension_hasta=240),true),
('39857095',(SELECT id FROM modelo WHERE nombre='MICOM P127' AND marca_id=14 AND tension_desde=24 AND tension_hasta=240),true),
('39857094',(SELECT id FROM modelo WHERE nombre='MICOM P127' AND marca_id=14 AND tension_desde=24 AND tension_hasta=240),true),
('39857093',(SELECT id FROM modelo WHERE nombre='MICOM P127' AND marca_id=14 AND tension_desde=24 AND tension_hasta=240),true),
('39857091',(SELECT id FROM modelo WHERE nombre='MICOM P127' AND marca_id=14 AND tension_desde=24 AND tension_hasta=240),true),
('39857090',(SELECT id FROM modelo WHERE nombre='MICOM P127' AND marca_id=14 AND tension_desde=24 AND tension_hasta=240),true),
('39857089',(SELECT id FROM modelo WHERE nombre='MICOM P127' AND marca_id=14 AND tension_desde=24 AND tension_hasta=240),true),
('39857087',(SELECT id FROM modelo WHERE nombre='MICOM P127' AND marca_id=14 AND tension_desde=24 AND tension_hasta=240),true),
('39857086',(SELECT id FROM modelo WHERE nombre='MICOM P127' AND marca_id=14 AND tension_desde=24 AND tension_hasta=240),true),
('39857085',(SELECT id FROM modelo WHERE nombre='MICOM P127' AND marca_id=14 AND tension_desde=24 AND tension_hasta=240),true),
('39857084',(SELECT id FROM modelo WHERE nombre='MICOM P127' AND marca_id=14 AND tension_desde=24 AND tension_hasta=240),true),
('39857082',(SELECT id FROM modelo WHERE nombre='MICOM P127' AND marca_id=14 AND tension_desde=24 AND tension_hasta=240),true),
('39857081',(SELECT id FROM modelo WHERE nombre='MICOM P127' AND marca_id=14 AND tension_desde=24 AND tension_hasta=240),true),
('39857080',(SELECT id FROM modelo WHERE nombre='MICOM P127' AND marca_id=14 AND tension_desde=24 AND tension_hasta=240),true),
('39857079',(SELECT id FROM modelo WHERE nombre='MICOM P127' AND marca_id=14 AND tension_desde=24 AND tension_hasta=240),true),
('39857078',(SELECT id FROM modelo WHERE nombre='MICOM P127' AND marca_id=14 AND tension_desde=24 AND tension_hasta=240),true),
('39857077',(SELECT id FROM modelo WHERE nombre='MICOM P127' AND marca_id=14 AND tension_desde=24 AND tension_hasta=240),true),
('39857076',(SELECT id FROM modelo WHERE nombre='MICOM P127' AND marca_id=14 AND tension_desde=24 AND tension_hasta=240),true),
('39857075',(SELECT id FROM modelo WHERE nombre='MICOM P127' AND marca_id=14 AND tension_desde=24 AND tension_hasta=240),true),
('39857074',(SELECT id FROM modelo WHERE nombre='MICOM P127' AND marca_id=14 AND tension_desde=24 AND tension_hasta=240),true),
('39857073',(SELECT id FROM modelo WHERE nombre='MICOM P127' AND marca_id=14 AND tension_desde=24 AND tension_hasta=240),true),
('39857072',(SELECT id FROM modelo WHERE nombre='MICOM P127' AND marca_id=14 AND tension_desde=24 AND tension_hasta=240),true),
('39857071',(SELECT id FROM modelo WHERE nombre='MICOM P127' AND marca_id=14 AND tension_desde=24 AND tension_hasta=240),true),
('39857069',(SELECT id FROM modelo WHERE nombre='MICOM P127' AND marca_id=14 AND tension_desde=24 AND tension_hasta=240),true),
('39857068',(SELECT id FROM modelo WHERE nombre='MICOM P127' AND marca_id=14 AND tension_desde=24 AND tension_hasta=240),true),

('GF2103515182',(SELECT id FROM modelo WHERE nombre='7SR5111' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2103515181',(SELECT id FROM modelo WHERE nombre='7SR5111' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2103515180',(SELECT id FROM modelo WHERE nombre='7SR5111' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2103515179',(SELECT id FROM modelo WHERE nombre='7SR5111' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2103515178',(SELECT id FROM modelo WHERE nombre='7SR5111' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2103515177',(SELECT id FROM modelo WHERE nombre='7SR5111' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2103515176',(SELECT id FROM modelo WHERE nombre='7SR5111' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2103515175',(SELECT id FROM modelo WHERE nombre='7SR5111' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2103515174',(SELECT id FROM modelo WHERE nombre='7SR5111' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2103515173',(SELECT id FROM modelo WHERE nombre='7SR5111' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2103515172',(SELECT id FROM modelo WHERE nombre='7SR5111' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2103515171',(SELECT id FROM modelo WHERE nombre='7SR5111' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2103515163',(SELECT id FROM modelo WHERE nombre='7SR5111' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2103515162',(SELECT id FROM modelo WHERE nombre='7SR5111' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2103515161',(SELECT id FROM modelo WHERE nombre='7SR5111' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2103515159',(SELECT id FROM modelo WHERE nombre='7SR5111' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2103515158',(SELECT id FROM modelo WHERE nombre='7SR5111' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2103515157',(SELECT id FROM modelo WHERE nombre='7SR5111' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2103515156',(SELECT id FROM modelo WHERE nombre='7SR5111' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2103515155',(SELECT id FROM modelo WHERE nombre='7SR5111' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2103515154',(SELECT id FROM modelo WHERE nombre='7SR5111' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2103515153',(SELECT id FROM modelo WHERE nombre='7SR5111' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2103515152',(SELECT id FROM modelo WHERE nombre='7SR5111' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2103515151',(SELECT id FROM modelo WHERE nombre='7SR5111' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2103515147',(SELECT id FROM modelo WHERE nombre='7SR5111' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),

('GF2204514079',(SELECT id FROM modelo WHERE nombre='7SR5111' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2204514078',(SELECT id FROM modelo WHERE nombre='7SR5111' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2204514076',(SELECT id FROM modelo WHERE nombre='7SR5111' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2204514071',(SELECT id FROM modelo WHERE nombre='7SR5111' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2204514069',(SELECT id FROM modelo WHERE nombre='7SR5111' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2204514068',(SELECT id FROM modelo WHERE nombre='7SR5111' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2204514067',(SELECT id FROM modelo WHERE nombre='7SR5111' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2204514066',(SELECT id FROM modelo WHERE nombre='7SR5111' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2204514065',(SELECT id FROM modelo WHERE nombre='7SR5111' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2204514064',(SELECT id FROM modelo WHERE nombre='7SR5111' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2204514063',(SELECT id FROM modelo WHERE nombre='7SR5111' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),

('GF2204510807',(SELECT id FROM modelo WHERE nombre='7SR5111' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2204510806',(SELECT id FROM modelo WHERE nombre='7SR5111' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2204510803',(SELECT id FROM modelo WHERE nombre='7SR5111' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),

('GF2204511682',(SELECT id FROM modelo WHERE nombre='7SR5111' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2204511680',(SELECT id FROM modelo WHERE nombre='7SR5111' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2204511678',(SELECT id FROM modelo WHERE nombre='7SR5111' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),

('GF2204507445',(SELECT id FROM modelo WHERE nombre='7SR5110' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2204507435',(SELECT id FROM modelo WHERE nombre='7SR5110' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2204507432',(SELECT id FROM modelo WHERE nombre='7SR5110' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2204507430',(SELECT id FROM modelo WHERE nombre='7SR5110' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2204507429',(SELECT id FROM modelo WHERE nombre='7SR5110' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2204507428',(SELECT id FROM modelo WHERE nombre='7SR5110' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2204507427',(SELECT id FROM modelo WHERE nombre='7SR5110' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2204507424',(SELECT id FROM modelo WHERE nombre='7SR5110' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2204507423',(SELECT id FROM modelo WHERE nombre='7SR5110' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true),
('GF2204503146',(SELECT id FROM modelo WHERE nombre='7SR5110' AND marca_id=18 AND tension_desde=48 AND tension_hasta=240),true);