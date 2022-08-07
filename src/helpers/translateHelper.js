const words = {
    extra: 'penunjang',
    rote: 'hafalan',
    preteenage: 'pra remaja',
    teenage: 'remaja',
    premarriedage: 'pra nikah',
    male: 'laki-laki',
    female: 'perempuan',
    teacher: 'pengajar',
}

function translate(word) {
    return words[word] ? words[word] : word
}

export default translate