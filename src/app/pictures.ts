export function imageExists(player) {

    const pictureNames = [
   ]
    if (pictureNames.includes(player + '.jpg')) {
        return '/farmers/assets/' + player + '.jpg';
    } else {
        return '';
    }
}