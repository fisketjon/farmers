# -*- coding: utf-8 -*-#

# import xlsxwriter
import csv

# CUPNAME = 'Farmers cup 2015'
# CUPNAME = 'Potato Open 2015'
CUPNAME = 'Bankers Open 2022'


def getValue1(match, s):
    b = match.find('<span class="nav-link__value">', s)
    if b > -1:
        e = match.find('</span>', b + 30)
        if e > -1:
            return match[b + 30 : e], e

def getValue2(match):
    b = match.find('>')
    if b > -1:
        e = match.find('<', b + 1)
        if e > -1:
            return match[b + 1 : e]

# Åpne Excel og importér, ikke la excel analysere data og velge format
# endre kolonne 1 til dato format, dvs. skriv inn som dato i 1. rad og kopiér
# lagre som xls
# importer til ny tabell i access og kopier inn til kamper

# listview f.o.m. vintercup 2023
def getMatches(filename, dt):
    def fix(streng):
        return streng.replace('&#216;', 'Ø').replace('&#230;', 'æ').replace('&#248;', 'ø').replace('&#229;', 'å').replace('&#246;', 'ö').replace('&#197;', 'Å')

    # def writeLine(r, coldata, strong=False):
    #     c = 0
    #     for col in coldata:
    #         if strong:
    #             ws.write(r, c, col, bold)
    #         else:
    #             ws.write(r, c, col)
    #         c += 1
    #     return r + 1

    # fname = filename.replace('.html', '.xlsx')
    fname = filename.replace('.html', '.csv')
    # Workbook is created
    # wb = xlsxwriter.Workbook(fname)
    # add_sheet is used to create sheet.
    # ws = wb.add_worksheet()
    # Add a bold format to use to highlight cells.
    # ws.set_column(0, 0, 15)
    # bold = wb.add_format({'bold': True})
    # title = wb.add_format({'bold': True, 'font_size': 20})
    # r = 0
    # r = writeLine(r, ['Dato', 'Tid', 'Klasse', 'Gruppe', 'Spiller1', 'Spiller2', 'Spiller3', 'Spiller4', 'Bane', 'Sett1', 'Sett2', 'Sett3', 'Annet', 'Turnering', 'Runde'], True)
    f = open(filename)    
    dta = f.read()
    f.close()
    with open(fname, 'w', encoding='UTF8', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['Dato', 'Tid', 'Klasse', 'Gruppe', 'Spiller1', 'Spiller2', 'Spiller3', 'Spiller4', 'Bane', 'Sett1', 'Sett2', 'Sett3', 'Annet', 'Turnering', 'Runde'])
        mgrp = dta.split('<h5 class="sticky is-sticky match-group__header">')
        for mg in mgrp[1:]:
            # finn klokkeslett
            tm = mg.strip('\n').strip()[:5]
            matches = mg.split('"match__header"')
            for m in matches[1:]:
                grp, s = getValue1(m, 0)
                grp = fix(grp)
                classes = grp.split(' - Group ')
                kl = classes[0]
                grp = classes[1] if len(classes) > 1 else ''
                rr, s = getValue1(m, s)
                resultnames = []
                resultsets = []
                players = m.split('/player.aspx')
                results = players[-1:][0].split('"match__result">')
                points = results[1].split('<li class="points__cell')
                comment = ''
                mwo = 0
                for p in players[1:]:
                    pl, s = getValue1(p, 0)
                    pl = fix(pl)
                    resultnames.append(pl)
                    mwo = m.find('<span class="tag--warning tag match__message">Walkover</span>')
                    s = p.find('match__message">')
                    if s > -1:
                        e = p.find('<', s)
                        comment = f'{pl} {p[s + 16 : e]}'
                if len(resultnames) == 4:
                    resultnames=[resultnames[0:2], resultnames[2:4]]
                r1 = -1
                if mwo == -1:
                    for r in points[1:]:
                        s = r.find('">')
                        e = r.find('\n', s)
                        res = int(r[s + 2 : e])
                        if r1 == -1:
                            r1 = res
                        else:
                            resultsets.append(f'{r1}-{res}')
                            r1 = -1
                    if r1 > -1:
                        resultsets.append(f'{r1}-{res}')
                    result = ' '.join(resultsets)
                # finn bane
                court = ''
                s1 = m.find('"match__header-aside"', 0)
                if s1 > -1:
                    s1 = m.find('title="', s)
                    if s1 > -1:
                        e = m.find('"', s1 + 7)
                        if e > -1:
                            durcourt = m[s1 + 7 : e].split('|')
                            if len(durcourt) > 1:
                                court = durcourt[1]           
                print(kl, grp, rr, dt,  tm ,resultnames[0], '-', resultnames[1], result, comment )
                s1 = s2 = s3 = ''
                if resultsets:
                    s1 = resultsets[0]
                    if len(resultsets) > 1:
                        s2 = resultsets[1]
                        if len(resultsets) > 2:
                            s3 = resultsets[2]
                if type(resultnames[0]) is list:                
                    # r = writeLine(r, [dt, tm, kl, grp, resultnames[0][0], resultnames[0][1], resultnames[1][0], resultnames[1][1], court, s1, s2, s3, comment, CUPNAME, rr ])
                    writer.writerow([dt, tm, kl, grp, resultnames[0][0], resultnames[0][1], resultnames[1][0], resultnames[1][1], court, s1, s2, s3, comment, CUPNAME, rr ])
                else:
                    # r = writeLine(r, [dt, tm, kl, grp, resultnames[0], resultnames[1], '', '', court, s1, s2, s3, comment, CUPNAME, rr ])
                    writer.writerow([dt, tm, kl, grp, resultnames[0], resultnames[1], '', '', court, s1, s2, s3, comment, CUPNAME, rr ])
    # wb.close()


def getMatches_old():
    f = open('2020_1.txt')
    f2 = open('juvesen2.txt', 'w')
    myfile = f.read()
    f.close()
    s=0
    days = myfile.split('<table class="ruler matches">')

    for day in days:
        s=day.find('<caption>')
        if s>0:
            s=day.find('of ',s)
            if s>0:            
                e=day.find('\n',s)
                dato = day[s+3:e]

            firstmatch = True
            matches=day.split('<td class="plannedtime"')
            for match in matches:
                if firstmatch:
                    firstmatch = False
                else:
                    s=match.find('>')
                    e=match.find('<',s)
                    tid = match[s+1:e]        
                    
                    s=match.find('<a href="./draw')
                    s=match.find('>',s)+1
                    e=match.find('</a>',s)
                    klasse = match[s:e].strip()       

                    spiller1 = ''
                    spiller2 = ''
                    spiller3 = ''
                    spiller4 = ''
                    
                    s=match.find('<a href="player')
                    if s>0:
                        s=match.find('>',s+29)+1
                        e=match.find('</a>',s)
                        spiller1 = match[s:e].strip(' [1]').strip(' [2]').strip(' [3/4]').strip(' [5/8]')                
                        s=e
                        
                        s=match.find('<a href="player',s)
                        if s>0:
                            s=match.find('>',s+29)+1
                            e=match.find('</a>',s)
                            spiller2 = match[s:e].strip(' [1]').strip(' [2]').strip(' [3/4]').strip(' [5/8]')
                            s=e
                        
                            s=match.find('<a href="player',s)
                            if s>0:
                                s=match.find('>',s+29)+1
                                e=match.find('</a>',s)
                                spiller3 = match[s:e].strip(' [1]').strip(' [2]').strip(' [3/4]').strip(' [5/8]')
                                s=e

                                s=match.find('<a href="player',s)
                                if s>0:
                                    s=match.find('>',s+29)+1
                                    e=match.find('</a>',s)
                                    spiller4 = match[s:e].strip(' [1]').strip(' [2]').strip(' [3/4]').strip(' [5/8]')
                            
                    resultat=''
                    bane = ''
                    s=match.find('class="score">')
                    if s>0: 
                        s += 14
                        e=match.find('</span></td>',s)
                        resultat = match[s:e]
                        resultat = resultat.replace('</span> <span>', ' ')
                        resultat = resultat.replace('</span>', ' ')
                        resultat = resultat.replace('  ', ' ')
                        resultat = resultat.replace('  ', ' ')
                        resultat = resultat.replace('<span>', '').strip()
                        resultat = resultat.replace(' ', ';')
                        
                    s=match.find('court')
                    if s>0: 
                        s=match.find('>',s)+1
                        e=match.find('</a>',s)
                        bane = match[s:e]
        
                    f2.write('"'+dato+'";')
                    f2.write('"'+tid+'";')
                    f2.write('"'+klasse+'";')
                    f2.write('"'+spiller1+'";')
                    f2.write('"'+spiller2+'";')
                    f2.write('"'+spiller3+'";')
                    f2.write('"'+spiller4+'";')            
                    f2.write('"'+bane+'";')
                    f2.write(resultat+'\n')
    f2.close()