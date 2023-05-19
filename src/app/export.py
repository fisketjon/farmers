import xlrd

def export(excelfile):
    wb = xlrd.open_workbook(excelfile)
    fo = open(excelfile[:-4] + 'txt', 'w')
    ws = wb.sheet_by_index(0)
    klasser = {v: '' for v in ws.col_values(3) if v != 'Klasse'}
    fo.write('klasser:[\n')
    for k in klasser:
        fo.write("{cls: '%s', kamper: [\n" % k)
        for row in range(1, ws.nrows):
            id,dato,tid,klasse,gruppe,spiller1,spiller2,spiller3,spiller4,bane,sett1,sett2,sett3,annet,turnering,runde = ws.row_values(row)
            if k == klasse:
                dato = dato + tid if tid else dato
                dd = xlrd.xldate_as_datetime(dato, wb.datemode)
                s = '{dt: '
                if tid:
                    ds = f'{dd:%d.%m.%Y %H:%M}'
                else:
                    ds = f'{dd:%d.%m.%Y}'
                if spiller3:
                    s += "'%s', r: '%s', p1: '%s', p1b: '%s', p2: '%s', p2b: '%s', " % (ds, runde, spiller1, spiller2, spiller3, spiller4)
                else:
                    s += "'%s', r: '%s', p1: '%s', p2: '%s', " % (ds, runde, spiller1, spiller2)
                if gruppe:
                    try:
                        s += "grp: '%s', " % int(gruppe)
                    except:
                        s += "grp: '%s', " % gruppe
                s += "res: ['%s'" % sett1
                if sett2:
                    s += ", '%s'" % sett2
                if sett3:
                    s += ", '%s'" % sett3
                s += ']},\n'
                fo.write(s)
        fo.write(']},\n')
    fo.write(']\n')
    fo.close()
