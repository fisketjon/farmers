export function imageExists(player) {

    const pictureNames = [
    'Alessandro Caselli-Helgeland.jpg',
    'Alexander Lomeland.jpg',
    'Amir Jazavac.jpg',
    'Andrea Røyrvik Eskedal.jpg',
    'Andreas Kristiansen.jpg',
    'Anine Klepp.jpg',
    'Arild Wiig-Fisketjøn.jpg',
    'Asle Hamre.jpg',
    'Athanasios Kostas.jpg',
    'Atle Haukland.jpg',
    'Atle Wiig-Fisketjøn.jpg',
    'Benjamin Vaag Miller.jpg',
    'Bjørn Reiten.jpg',
    'breezebrowser.dat',
    'Carl Fredrik Hjelle.jpg',
    'Dag Erik Fylkesnes.jpg',
    'Daniel Baxter.jpg',
    'Daniel Olsen.jpg',
    'David Benjamin Fylkesnes.jpg',
    'Dennis Rühlow.jpg',
    'Dimitris Kostopoulos.jpg',
    'Dorthea Faa Hviding.jpg',
    'Edvin Digernes Bakke.jpg',
    'Erik Sedberg Aarthun.jpg',
    'Espen Olsen.jpg',
    'Fabian Linge.jpg',
    'framside.jpg',
    'Franck Christopher Andrea Fog.JPG',
    'Fredrik Wangen.jpg',
    'Gabriel Martin.jpg',
    'Gilberto Cervantes.jpg',
    'Glenn Kollevik_.jpg',
    'Haakon Kessel.jpg',
    'Henning Frøystein.jpg',
    'Henrik Helliesen.jpg',
    'Husiar Johnsen.jpg',
    'Håkan Ascard.jpg',
    'Imad Hachimi.jpg',
    'Inge Bjørkevoll.jpg',
    'Jeppe Lodding.jpg',
    'John Christopher Fylkesnes.jpg',
    'John-Sigvard Njau.jpg',
    'Julia Oftedahl Knoth.jpg',
    'Julien Terrade.jpg',
    'Kent Håkan Ascard.jpg',
    'Kevin Molstad.jpg',
    'Khanh Duc Nguyen.jpg',
    'Kjell Arne Grini.jpg',
    'Kjetil Halvorsen.jpg',
    'Knut Gudmundsen.jpg',
    'Kristoffer Muri.jpg',
    'Kurt Jarle Salomonsen.jpg',
    'Lars Sedberg Aarthun.jpg',
    'Lars Vattøy.jpg',
    'Line Huglen.jpg',
    'Lukasz Idzik.jpg',
    'Marcus Sulen.jpg',
    'Marie Skarica.jpg',
    'Marius Rygh.jpg',
    'Mathias Jæger-Pedersen.jpg',
    'Mats Albert Kamps.jpg',
    'Michal Beranek.jpg',
    'Mikal Olsen.jpg',
    'Milos Herceg.jpg',
    'Morten Aadnøy Goa.jpg',
    'Nils Tveit Gjerdåker.jpg',
    'Olav Eltervåg.jpg',
    'Ole Storhaug.jpg',
    'Pål Særvoll.jpg',
    'Rikhard Holmström.jpg',
    'Rikke Nordvik.jpg',
    'Robin McClusky.jpg',
    'Saskia Verkaik.jpg',
    'Sindre Aase.jpg',
    'Tho Anh Ngo.jpg',
    'Thomas Jensen.jpg',
    'Thor Butler Wang.jpg',
    'Tor Arne Refsnes.jpg',
    'Trym Landa.jpg',
    'Unn Helliesen Ramsland.jpg',
    'Urs Oftedahl Knoth.jpg',
    'William Grimholt.jpg',
    ]
    if (pictureNames.includes(player + '.jpg')) {
        return '/juvesen/assets/' + player + '.jpg';
    } else {
        return '';
    }
}