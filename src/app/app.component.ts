import { Component, OnInit} from '@angular/core';
import { ɵNAMESPACE_URIS } from '@angular/platform-browser';
import { NgLocaleLocalization } from '@angular/common';
import { faAngleDown, faAngleUp, faCaretLeft, faCaretRight, faFileImage } from '@fortawesome/free-solid-svg-icons';
import { getAllWinners } from './resultater';
import { imageExists } from './pictures';

interface LooseObject {
  [key: string]: any;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'Farmers & Potato';
  runnerup: boolean;
  nl = [];
  t_idx = 0;
  kl_idx = 0;
  ka_idx = 0;
  nm_idx = 0;
  matches = 0;
  names = [];
  trnlimit = 4;
  trnlimitsgl = 4;
  trnlimitdbl = 4;
  players = [];
  winners = [];
  option = '1';
  detail = '1';
  filter = '';
  allcls = false;
  closetiebreaks = [];
  closetiebreaksdbl = [];
  toplist = [];
  topwinners = [];
  topwinnersdbl = [];
  mostWins = [];
  mostTournaments = [];
  longestCurrentStreak = [];
  longestStreak = [];
  mostMatches = [];
  mostWinsdbl = [];
  mostTournamentsdbl = [];
  mostMatchesdbl = [];
  topRivals = [];
  mostRivalMatches = [];
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  faCaretLeft = faCaretLeft;
  faCaretRight = faCaretRight;
  faFileImage = faFileImage;
  sortbyfirstname = false;
  labels = {lbld: 'Klasse D', lble: 'Klasse E', lblf: 'Klasse F'};

  filterPlayer(index) {
    if (!this.filter) {
        return false;
    }
    const t = this.winners[index];
    const f = this.filter.toUpperCase();
    let hidden = true;
    Object.keys(t).forEach(key => {
      const keyval = t[key];
      if (key !== 'season' && key !== 'trn' && key !== 'dt' && 
        key !== 'lbla' && key !== 'lblb' && key !== 'lblw' &&
        key !== 'klasser' && key !== 'cls' && key !== 'kamper' &&
        key !== 'dt' && key !== 'r' && key !== 'p1' &&
        key !== 'p2' && key !== 'res' && key !== 'p1b' && key !== 'p2b') {
        switch (this.detail) {
          case '1':
            if (key.indexOf('2') < 0 && key.indexOf('3') < 0) {
              if (keyval.toUpperCase().indexOf(f) >= 0) {
                hidden = false;
              }
            }
            break;
          case '2':
            if (key.indexOf('3') < 0) {
              if (keyval.toUpperCase().indexOf(f) >= 0) {
                hidden = false;
              }
            }
            break;
          case '3':
            if (keyval.toUpperCase().indexOf(f) >= 0) {
              hidden = false;
            }
            break;
        }
      }
    });
    return hidden;
  }


  toggleTourn(index) {
    if (this.winners[index].hasOwnProperty('full')) {
      this.winners[index].full = !this.winners[index].full;
    } else {
      this.winners[index].full = true;
    }
  }

  round(num: number) {
    return Math.round(num);
  }

  removeWOName(set) {
    if (set.toUpperCase().indexOf('WO') >= 0) {
      return 'WO';
    } else {
      if (set.toUpperCase().indexOf('RET') >= 0) {
        return 'RET';
      } else {
        return set;
      }
    }
  }

  toggleKlasse(index, index1) {
    if (this.winners[index].klasser[index1].hasOwnProperty('expanded')) {
      this.winners[index].klasser[index1].expanded = !this.winners[index].klasser[index1].expanded;
    } else {
      this.winners[index].klasser[index1].expanded = true;
    }
  }

  lastname(name) {
    const names = name.split(' ');
    return names[names.length - 1];
  }

  norw(name) {
      return name.replace('æ', 'z1').replace('ø', 'z2').replace('ö', 'z2').replace('å', 'z3').replace('Æ', 'z1').replace('Ø', 'z2').replace('Ö', 'z2').replace('Å', 'z3').replace('aa', 'z3').replace('Aa', 'z3').replace('AA', 'z3').replace('ü', 'y');
  }

  turneringOK(t) {
    let ok = false;
    for (const klasse of t.klasser) {
      if (this.klasseOK(klasse.klasse, false)) {
        ok = true;
        break;
      }
    }
    return ok;
  }

  countTournaments(pl) {
    let count = 0;
    for (const t in pl.tournaments) {
      if (this.turneringOK(t)) {
        count++;
      }
    }
    return count;
  }

  klasseOK(cls, bonus) {
    if ((bonus || cls.indexOf('Bonus') === -1) &&
      (this.allcls || (cls.indexOf('U12') === -1 && cls.indexOf('U11') === -1 && cls.indexOf('U10') === -1 && cls.toLowerCase().indexOf('double') === -1 && cls.indexOf('Legends') === -1))) {
      return true;
    } else {
      return false;
    }

  }

  showAllPlayers() {
    this.option = '3';
    if (!this.players[0].hasOwnProperty('imagename')) {
      for (const pl of this.players) {
        pl.imagename = imageExists(pl.name);
      }
    }
  }

  sortplayers() {    
    if (this.sortbyfirstname) {
      this.players = this.players.sort((a, b) => {
        if (a.fullname < b.fullname) {
          return -1;
        }
        if (a.fullname > b.fullname) {
          return 1;
        }
        return a.fullname > b.fullname ? 1 : 0;
      });
    } else { 
      this.players = this.players.sort((a, b) => {
        if (a.lastname < b.lastname) {
          return -1;
        }
        if (a.lastname > b.lastname) {
          return 1;
        }
        if (a.lastname === b.lastname && a.fullname < b.fullname) {
          return - 1;
        }
        return a.lastname > b.lastname ? 1 : 0;
      });
    }
    this.sortbyfirstname =! this.sortbyfirstname;
  }

  countStreaks(p) {
    let streak = 0;
    let lstreak = 0;
    let cstreak = 0;
    let cstreakfound = false;
    loop1:
    for (const t of this.winners) {
      let found = false;
      if (t.hasOwnProperty('klasser')) {
        loop2:
        for (const klasse of t.klasser) {
          if (this.klasseOK(klasse.cls, false)) {
            for (const kamp of klasse.kamper) {
              if (kamp.res && kamp.res[0].indexOf('WO') === -1) {
                for (const nm of [kamp.p1, kamp.p2, kamp.p1b, kamp.p2b]) {
                  // spilte i turnering
                  if (nm && this.klasseOK(klasse.cls, false) && nm === p.name) {
                    found = true;
                    break loop2;
                  }
                }                    
              }
            }
          }
        }
      }
      if (found) {
        if (!cstreakfound) {
          cstreak++;
        }
        streak++;
      } else {
        cstreakfound = true;
        streak = 0;
      }
      if (streak > lstreak) {
        lstreak = streak;
      }
    }
    return {'cstreak': cstreak, 'lstreak': lstreak};
  }

  findSingleRivalries() {
    let rivals = []
    for (const t of this.winners) {
      let found = false;

      if (t.hasOwnProperty('klasser')) {
        loop2:
        for (const klasse of t.klasser) {
          if (this.klasseOK(klasse.cls, false)) {
            for (const kamp of klasse.kamper) {
              if (kamp.res && kamp.res[0].indexOf('WO') === -1) {
                if (!kamp.p1b) {
                  let pair = kamp.p1 + '|' + kamp.p2;
                  if (kamp.p1 > kamp.p2) {
                    pair = kamp.p2 + '|' + kamp.p1;
                  }
                  const p = rivals.find(x => x.pair === pair);
                  if (p === undefined) {
                    rivals.push({'pair': pair, 'matches': [{'trn': t.trn, 'klasse': klasse.cls, 'kamp': kamp}], 'nbrmatches': 1});
                  } else {
                    p['matches'].push({'trn': t.trn, 'klasse': klasse.cls, 'kamp': kamp});
                    ++p['nbrmatches'];
                  }
                }
              }
            }
          }
        }
      }
    }
    this.topRivals = [];
    this.mostRivalMatches = [];
    for (const r of rivals) {
      if (r.nbrmatches>1) {
        r.players = r.pair.split('|');
        this.topRivals.push(r);
      }
    }
    rivals = [];
    this.topRivals.forEach(val => this.mostRivalMatches.push(Object.assign({}, val)));
    const sortedRivals: string[] = this.mostRivalMatches.sort((n1, n2) => {
      if (n1.nbrmatches < n2.nbrmatches) {
          return 1;
      }
      if (n1.nbrmatches > n2.nbrmatches) {
          return -1;
      }
      return 0;
    });
    this.mostRivalMatches = sortedRivals;
  }

  collectPlayers() {
    this.players = [];
    this.t_idx = 0;
    this.matches = 0;
    this.closetiebreaks = [];
    this.closetiebreaksdbl = [];
    this.kl_idx = 0;
    this.ka_idx = 0;
    this.nm_idx = 0;
    this.matches = 0;
    this.filter = '';
    this.topwinners = [];
    this.topwinnersdbl = [];
    this.mostWins = [];
    this.mostTournaments = [];
    this.mostMatches = [];
    this.mostWinsdbl = [];
    this.mostTournamentsdbl = [];
    this.mostMatchesdbl = [];
    for (const t of this.winners) {
      if (t.hasOwnProperty('klasser')) {
        this.kl_idx = 0;
        for (const klasse of t.klasser) {
          if (this.klasseOK(klasse.cls, false)) {
            this.ka_idx = 0;
            for (const kamp of klasse.kamper) {
              if (kamp.res && kamp.res[0].indexOf('WO') === -1) {
                this.matches++;
                if (kamp.res.length === 3 && kamp.res[2].indexOf('RET') === -1) {
                  const dash = kamp.res[2].indexOf('-');
                  const pts1 = parseInt(kamp.res[2].substring(0, dash), 10);
                  const pts2 = parseInt(kamp.res[2].substring(dash + 1, kamp.res[2].length), 10);
                  if (!kamp.p1b && pts1 + pts2 > 22) {
                    this.closetiebreaks.push({kamp: kamp, pts: pts1 + pts2, trn: t.trn, cls: klasse.cls});
                  }
                  if (kamp.p1b && pts1 + pts2 > 17) {
                    this.closetiebreaksdbl.push({kamp: kamp, pts: pts1 + pts2, trn: t.trn, cls: klasse.cls});
                  }
                }
              }
              this.nm_idx = 0;
              for (const nm of [kamp.p1, kamp.p2, kamp.p1b, kamp.p2b]) {
                if (nm && this.klasseOK(klasse.cls, false)) {
                  const p = this.players.find(x => x.name === nm);
                  if (p !== undefined) {
                      if (kamp.res && kamp.res[0].indexOf('WO') === -1) {
                        if (!kamp.p1b) {
                          p.matches++;
                        } else {
                          p.matchesdbl++;
                        }
                        if (this.nm_idx % 2 === this.winner(kamp) - 1) {
                          if (!kamp.p1b) {
                            p.victories++;
                          } else {
                            p.victoriesdbl++;
                          }
                        }
                      }
                  } else {
                    let vict = 0;
                    if (this.nm_idx % 2 === this.winner(kamp) - 1) {
                        vict = 1;
                    }
                    this.players.push({name: nm, matches: 0, victories: 0, matchesdbl: 0, victoriesdbl: 0});
                    const p = this.players[this.players.length - 1];
                    if (!kamp.p1b) {
                      p.matches = 1;
                      p.victories = vict;
                    } else {
                      p.matchesdbl = 1;
                      p.victoriesdbl = vict;
                    }
                  }
                }
                this.nm_idx++;
              }
              this.ka_idx++;
            }
            this.kl_idx++;
          }
        }
      }
      this.t_idx++;
    }
    for (const p of this.players) {
      p.fullname = this.norw(p.name);
      p.lastname = this.lastname(p.fullname);
    }
    for (const p of this.players) {
      const streaks = this.countStreaks(p);
      p.cstreak = streaks.cstreak;
      p.lstreak = streaks.lstreak;
    }
    this.sortplayers();
    for (let index = 0; index < this.players.length; index++) {
      this.getPlayerMatches(index, false);
      const pl = this.players[index];
      if (pl.matches) {
        pl.pctwin = Math.round(pl.victories / pl.matches * 100);
      }
      if (pl.matchesdbl) {
        pl.pctwindbl = Math.round(pl.victoriesdbl / pl.matchesdbl * 100);
      }
      let nbrt = 0;
      let nbrtdbl = 0;
      for (const t of pl.tournaments) {
        if (this.turneringOK(t)) {
          let sng = false;
          let dbl = false;
          for (const c of t.klasser) {
            for (const m of c.kamper) {
              if (!m.p1b) {
                sng = true;
              } else {
                dbl = true;
              }
            }
          }
          if (sng) {
            nbrt++;
          }
          if (dbl) {
            nbrtdbl++;
          }
        }
      }
      if (nbrt >= this.trnlimit) {
        this.topwinners.push({name: pl.name, tournaments: nbrt, tournamentsdbl: nbrtdbl, index: index,
          matches: pl.matches, victories: pl.victories, pctwin: pl.pctwin,
          matchesdbl: pl.matchesdbl, victoriesdbl: pl.victoriesdbl, pctwindbl: pl.pctwindbl});
      }
      if (nbrtdbl >= this.trnlimitdbl) {
        this.topwinnersdbl.push({name: pl.name, tournaments: nbrt, tournamentsdbl: nbrtdbl, index: index,
          matches: pl.matches, victories: pl.victories, pctwin: pl.pctwin,
          matchesdbl: pl.matchesdbl, victoriesdbl: pl.victoriesdbl, pctwindbl: pl.pctwindbl});
      }
      pl.nbrt = nbrt;
      pl.nbrtdbl = nbrtdbl;
    }
    this.topwinners.forEach(val => this.mostWins.push(Object.assign({}, val)));
    const sortedArray: string[] = this.mostWins.sort((n1, n2) => {
      if (n1.pctwin < n2.pctwin) {
          return 1;
      }
      if (n1.pctwin > n2.pctwin) {
          return -1;
      }
      if (n1.matches < n2.matches) {
          return 1;
      }
      if (n1.matches > n2.matches) {
          return -1;
      }
      return 0;
    });
    this.mostWins = sortedArray;

    this.topwinners.forEach(val => this.mostTournaments.push(Object.assign({}, val)));
    const sortedArray2: string[] = this.mostTournaments.sort((n1, n2) => {
      if (n1.tournaments < n2.tournaments) {
          return 1;
      }
      if (n1.tournaments > n2.tournaments) {
          return -1;
      }
      if (n1.matches < n2.matches) {
          return 1;
      }
      if (n1.matches > n2.matches) {
          return -1;
      }
      if (n1.pctwin < n2.pctwin) {
          return 1;
      }
      if (n1.pctwin > n2.pctwin) {
          return -1;
      }
      return 0;
    });
    this.mostTournaments = sortedArray2;
    this.longestStreak = [];
    this.players.forEach(val => this.longestStreak.push(Object.assign({}, val)));
    const sortedArraylstreak: string[] = this.longestStreak.sort((n1, n2) => {
      if (n1.lstreak < n2.lstreak) {
          return 1;
      }
      if (n1.lstreak > n2.lstreak) {
          return -1;
      }
      return 0;
    });
    this.longestStreak = sortedArraylstreak;

    this.longestCurrentStreak = [];
    this.players.forEach(val => this.longestCurrentStreak.push(Object.assign({}, val)));
    const sortedArraycstreak: string[] = this.longestCurrentStreak.sort((n1, n2) => {
      if (n1.cstreak < n2.cstreak) {
          return 1;
      }
      if (n1.cstreak > n2.cstreak) {
          return -1;
      }
      return 0;
    });
    this.longestCurrentStreak = sortedArraycstreak;

    this.topwinners.forEach(val => this.mostMatches.push(Object.assign({}, val)));
    const sortedArray3: string[] = this.mostMatches.sort((n1, n2) => {
      if (n1.matches < n2.matches) {
          return 1;
      }
      if (n1.matches > n2.matches) {
          return -1;
      }
      if (n1.tournaments < n2.tournaments) {
          return 1;
      }
      if (n1.tournaments > n2.tournaments) {
          return -1;
      }
      if (n1.pctwin < n2.pctwin) {
          return 1;
      }
      if (n1.pctwin > n2.pctwin) {
          return -1;
      }
      return 0;
    });
    this.mostMatches = sortedArray3;

    this.topwinnersdbl.forEach(val => this.mostWinsdbl.push(Object.assign({}, val)));
    const sortedArray4: string[] = this.mostWinsdbl.sort((n1, n2) => {
      if (n1.pctwindbl < n2.pctwindbl) {
          return 1;
      }
      if (n1.pctwindbl > n2.pctwindbl) {
          return -1;
      }
      if (n1.matchesdbl < n2.matchesdbl) {
          return 1;
      }
      if (n1.matchesdbl > n2.matchesdbl) {
          return -1;
      }
      return 0;
    });
    this.mostWinsdbl = sortedArray4;

    this.topwinnersdbl.forEach(val => this.mostTournamentsdbl.push(Object.assign({}, val)));
    const sortedArray5: string[] = this.mostTournamentsdbl.sort((n1, n2) => {
      if (n1.tournamentsdbl < n2.tournamentsdbl) {
          return 1;
      }
      if (n1.tournamentsdbl > n2.tournamentsdbl) {
          return -1;
      }
      if (n1.matchesdbl < n2.matchesdbl) {
          return 1;
      }
      if (n1.matchesdbl > n2.matchesdbl) {
          return -1;
      }
      if (n1.pctwindbl < n2.pctwindbl) {
          return 1;
      }
      if (n1.pctwindbl > n2.pctwindbl) {
          return -1;
      }
      return 0;
    });
    this.mostTournamentsdbl = sortedArray5;

    this.topwinnersdbl.forEach(val => this.mostMatchesdbl.push(Object.assign({}, val)));
    const sortedArray6: string[] = this.mostMatchesdbl.sort((n1, n2) => {
      if (n1.matchesdbl < n2.matchesdbl) {
          return 1;
      }
      if (n1.matchesdbl > n2.matchesdbl) {
          return -1;
      }
      if (n1.tournamentsdbl < n2.tournamentsdbl) {
          return 1;
      }
      if (n1.tournamentsdbl > n2.tournamentsdbl) {
          return -1;
      }
      if (n1.pctwindbl < n2.pctwindbl) {
          return 1;
      }
      if (n1.pctwindbl > n2.pctwindbl) {
          return -1;
      }
      return 0;
    });
    this.mostMatchesdbl = sortedArray6;

    const sortedArray7: string[] = this.closetiebreaks.sort((n1, n2) => {
      if (n1.pts < n2.pts) {
          return 1;
      }
      if (n1.pts > n2.pts) {
          return -1;
      }
      return 0;
    });
    this.closetiebreaks = sortedArray7;

    const sortedArray8: string[] = this.closetiebreaksdbl.sort((n1, n2) => {
      if (n1.pts < n2.pts) {
          return 1;
      }
      if (n1.pts > n2.pts) {
          return -1;
      }
      return 0;
    });
    this.closetiebreaksdbl = sortedArray8;
    this.findSingleRivalries();
  }

  isDouble(kamp) {
    if (kamp.hasOwnProperty('p1b')) {
      return true;
    } else {
      return false;
    }
  }

  winner(kamp) {
    const res = kamp.res;
    const lastset = res[res.length - 1];
    const pl1 = kamp.p1;
    let pl1b = '';
    if (kamp.hasOwnProperty('p1b')) {
      pl1b = kamp.p1b;
    }
    if (lastset.toUpperCase().indexOf('RET') >= 0) {
      const plname = lastset.substring(lastset.toUpperCase().indexOf('RET') + 4, lastset.length).toUpperCase();
      if (pl1.toUpperCase().indexOf(plname) >= 0 || pl1b.toUpperCase().indexOf(plname) >= 0) {
        return 2;
      } else {
        return 1;
      }
    } else if (lastset.toUpperCase().indexOf('WO') < 0) {
      const dash = lastset.indexOf('-');
      if (parseInt(lastset.substring(0, dash), 10) > parseInt(lastset.substring(dash + 1, lastset.length), 10)) {
        return 1;
      } else if (parseInt(lastset.substring(0, dash), 10) < parseInt(lastset.substring(dash + 1, lastset.length), 10)) {
        return 2;
      } else {
        return 0;
      }
    } else {
      const plname = lastset.substring(lastset.toUpperCase().indexOf('WO') + 3, lastset.length).toUpperCase();
      if (pl1.toUpperCase().indexOf(plname) >= 0 || pl1b.toUpperCase().indexOf(plname) >= 0) {
        return 1;
      } else {
        return 2;
      }
    }
  }

  winnerTB(kamp) {
    const res = kamp.res[2];
    const dash = res.indexOf('-');
    if (parseInt(res.substring(0, dash), 10) > parseInt(res.substring(dash + 1, res.length), 10)) {
      return 1;
    } else if (parseInt(res.substring(0, dash), 10) < parseInt(res.substring(dash + 1, res.length), 10)) {
      return 2;
    } else {
      return 0;
    }
  }

  getPlayerMatches(index, expand) {
    if (!this.players[index].expanded) {
      if (!this.players[index].tournaments) {
        this.players[index].tournaments = [];
        this.t_idx = -1;
        for (const t of this.winners) {
          let firstT = true;
          if (t.hasOwnProperty('klasser')) {
            this.kl_idx = -1;
            for (const kl of t.klasser) {
              let firstKl = true;
              for (const kamp of kl.kamper) {
                for (const nm of [kamp.p1, kamp.p2, kamp.p1b, kamp.p2b]) {
                // for (const nm of [kamp.p1, kamp.p2]) {
                  if (nm === this.players[index].name) {
                    if (firstT) {
                      this.t_idx++;
                      this.players[index].tournaments.push({trn: t.trn, dt: t.dt, klasser: []});
                      firstT = false;
                    }
                    if (firstKl) {
                      this.kl_idx++;
                      this.players[index].tournaments[this.t_idx].klasser.push({klasse: kl.cls, kamper: []});
                      firstKl = false;
                    }
                    this.players[index].tournaments[this.t_idx].klasser[this.kl_idx].kamper.push(kamp);
                  }
                }
              }
            }
          }
        }
      }
    }
    if (expand) {
      this.players[index].expanded = !this.players[index].expanded;
    }
  }

  allClasses() {
    if (!this.allcls) {
      this.allcls = true;
      this.lagPlasseringer();
    }
  }

  // pureJuvesen() {
  //   if (this.allcls) {
  //     this.allcls = false;
  //     this.lagPlasseringer();
  //   }
  // }

  pushNames(names, w, f, sf1, sf2, ix, lbl='') {
    if (lbl && lbl.indexOf('U12') === -1) {
      ix = 21;
    }
    if (w) {
      names.push({nm: w, t: ix});
    }
    if (f) {
      names.push({nm: f, t: ix + 1});
    }
    if (sf1) {
      names.push({nm: sf1, t: ix + 2});
    }
    if (sf2) {
      names.push({nm: sf2, t: ix + 2});
    }
  }

  collectWinners(tourn) {
    this.names = [];
    this.pushNames (this.names, tourn.a, tourn.a2, tourn.a3a, tourn.a3b, 0);
    this.pushNames (this.names, tourn.b, tourn.b2, tourn.b3a, tourn.b3b, 3);
    this.pushNames (this.names, tourn.c, tourn.c2, tourn.c3a, tourn.c3b, 6);
    this.pushNames (this.names, tourn.d, tourn.d2, tourn.d3a, tourn.d3b, 9);
    this.pushNames (this.names, tourn.e, tourn.e2, tourn.e3a, tourn.e3b, 12);
    this.pushNames (this.names, tourn.f, tourn.f2, tourn.f3a, tourn.f3b, 15);
    if (this.allcls) {
      this.pushNames (this.names, tourn.g, tourn.g2, tourn.g3a, tourn.g3b, 18, tourn.lblg);
      this.pushNames (this.names, tourn.h, tourn.h2, tourn.h3a, tourn.h3b, 18, tourn.lblh);
      this.pushNames (this.names, tourn.i, tourn.i2, tourn.i3a, tourn.i3b, 18, tourn.lbli);
      this.pushNames (this.names, tourn.j, tourn.j2, tourn.j3a, tourn.j3b, 18, tourn.lblj);
    }
  }

  lagPlasseringer() {
    this.nl = [];    
    for (let t of this.winners) {
      this.collectWinners(t);
      for (let i = 0; i < this.names.length; i++) {
        const entry = this.nl.findIndex(x => x.nm === this.names[i].nm);
        if (entry === -1) {
          let vict = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          if (this.allcls) {
            vict = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
          }
          vict[this.names[i].t] = 1;
          this.nl.push({nm: this.names[i].nm, victories: vict, tot: 1});
        } else {
          this.nl[entry].victories[this.names[i].t]++;
          this.nl[entry].tot++;
        }
      }
    }
    let siste = 17;
    if (this.allcls) {
      siste = 23;
    }
    const sortedArray: string[] = this.nl.sort((n1, n2) => {
      for (let i = 0; i <= siste; i++) {
        if (n1.victories[i] < n2.victories[i]) {
            return 1;
        }
        if (n1.victories[i] > n2.victories[i]) {
            return -1;
        }
      }
      return 0;
   });
    this.toplist = sortedArray;
    this.collectPlayers();
  }

  decrTrnLimit(dbl) {
    if (dbl) {
      if (this.trnlimitdbl > 5) {
        this.trnlimitdbl--;
        this.lagPlasseringer();
      }
    } else {
      if (this.trnlimit > 5) {
        this.trnlimit--;
        this.lagPlasseringer();
      }
    }
  }

  imagelinks(body) {
    var pos = body.indexOf('img src="bilder');
    while (pos > -1) {
      body = body.replace('img src="bilder', 'img src="http://www.fisketjon.no/stk/bilder')
      var pos = body.indexOf('img src="bilder');
    }
    return body;
  }

  incrTrnLimit(dbl) {
    if (dbl) {
      if (this.trnlimitdbl < this.winners.length) {
        this.trnlimitdbl++;
        this.lagPlasseringer();
      }
    } else {
      if (this.trnlimit < this.winners.length) {
        this.trnlimit++;
        this.lagPlasseringer();
      }
    }
  }

  ngOnInit() {
    this.detail = '1';
    this.winners = getAllWinners();
    this.runnerup = false;
    this.lagPlasseringer();
  }

}